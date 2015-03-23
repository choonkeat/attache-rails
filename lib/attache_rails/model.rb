module AttacheRails
  module Utils
    class << self
      def with_url(json_string, geometry)
        JSON.parse(json_string).tap do |attrs|
          prefix, basename = File.split(attrs['path'])
          attrs['url'] = [ATTACHE_DOWNLOAD_URL, prefix, CGI.escape(geometry), basename].join('/')
        end
      end

      def attache_options(geometry, current_value, options)
        auth = if ENV['ATTACHE_SECRET_KEY']
          uuid = SecureRandom.uuid
          expiration = (Time.now + ATTACHE_UPLOAD_DURATION).to_i
          hmac = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha1'), ENV['ATTACHE_SECRET_KEY'], "#{uuid}#{expiration}")
          { uuid: uuid, expiration: expiration, hmac: hmac }
        else
          {}
        end

        {
          multiple: options[:multiple],
          class: 'enable-attache',
          data: {
            geometry: geometry,
            value: [*current_value],
            placeholder: [*options[:placeholder]],
            uploadurl: ATTACHE_UPLOAD_URL,
            downloadurl: ATTACHE_DOWNLOAD_URL,
          }.merge(options[:data_attrs] || {}).merge(auth),
        }
      end
    end
  end
  module Model
    def self.included(base)
      base.extend ClassMethods
    end


    module ClassMethods
      def has_one_attache(name)
        serialize name, JSON
        define_method "#{name}_options",    -> (geometry, options = {}) { Utils.attache_options(geometry, [self.send("#{name}_attributes", geometry)], multiple: false, **options) }
        define_method "#{name}_url",        -> (geometry) {               self.send("#{name}_attributes", geometry).try(:[], 'url') }
        define_method "#{name}_attributes", -> (geometry) {               str = self.send(name); Utils.with_url(str, geometry) if str; }
      end

      def has_many_attaches(name)
        serialize name, JSON
        define_method "#{name}_options",    -> (geometry, options = {}) { Utils.attache_options(geometry, self.send("#{name}_attributes", geometry), multiple: true, **options) }
        define_method "#{name}_urls",       -> (geometry) {               self.send("#{name}_attributes", geometry).collect {|attrs| attrs['url'] } }
        define_method "#{name}_attributes", -> (geometry) {
          (self.send(name) || []).inject([]) do |sum, str|
            sum + (str.blank? ? [] : [Utils.with_url(str, geometry)])
          end
        }
      end
    end
  end
end

ActiveRecord::Base.send(:include, AttacheRails::Model)
