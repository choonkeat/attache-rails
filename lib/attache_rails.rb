require "attache_rails/engine"

module AttacheRails
  module ViewHelper
    ATTACHE_UPLOAD_URL   = ENV.fetch('ATTACHE_UPLOAD_URL')   { 'http://localhost:9292/upload' }
    ATTACHE_DOWNLOAD_URL = ENV.fetch('ATTACHE_DOWNLOAD_URL') { 'http://localhost:9292/view' }
    ATTACHE_UPLOAD_DURATION = ENV.fetch('ATTACHE_UPLOAD_DURATION') { '600' }.to_i # 10 minutes

    def attache_urls(json, geometry)
      array = json.kind_of?(Array) ? json : [*json]
      array.collect do |path|
        download_url = ATTACHE_DOWNLOAD_URL
        prefix, basename = File.split(path)
        [download_url, prefix, CGI.escape(geometry), basename].join('/').tap do |url|
          yield url if block_given?
        end
      end
    end

    def attache_options(geometry, current_value)
      auth = if ENV['ATTACHE_SECRET_KEY']
        uuid = SecureRandom.uuid
        expiration = (Time.now + ATTACHE_UPLOAD_DURATION).to_i
        hmac = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha1'), ENV['ATTACHE_SECRET_KEY'], "#{uuid}#{expiration}")
        { uuid: uuid, expiration: expiration, hmac: hmac }
      else
        {}
      end

      {
        class: 'enable-attache',
        data: {
          geometry: geometry,
          value: [*current_value],
          uploadurl: ATTACHE_UPLOAD_URL,
          downloadurl: ATTACHE_DOWNLOAD_URL,
        }.merge(auth),
      }
    end
  end
end

ActionView::Base.send(:include, AttacheRails::ViewHelper)
