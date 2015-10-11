require "cgi"
require "uri"
require "httpclient"
require "attache/api/v1"

module AttacheRails
  module Utils
    class << self
      include Attache::API::V1

      def array(value)
        Array.wrap(value).reject(&:blank?)
      end

      def url_for(json_string, geometry)
        JSON.parse(json_string).tap do |attrs|
          attrs['url'] = attache_url_for(attrs['path'], geometry)
        end
      end
    end
  end
  module Model
    def self.included(base)
      base.extend ClassMethods
      base.class_eval do
        attr_accessor :attaches_discarded
        after_commit  :attaches_discard!, if: :attaches_discarded
      end
    end

    def attaches_discard!(files = attaches_discarded)
      files.reject!(&:blank?)
      files.uniq!
      if files.present?
        logger.info "DELETE #{files.inspect}"
        Utils.attache_delete(*files)
      end
    rescue Exception
      raise if ENV['ATTACHE_DISCARD_FAILURE_RAISE_ERROR']
      logger.warn [$!, $@]
    end

    module ClassMethods
      def has_one_attache(name)
        serialize name, JSON
        define_method "#{name}_options",    -> (geometry, options = {}) { Utils.attache_options(geometry, Utils.array(self.send("#{name}_attributes", geometry)), multiple: false, **options) }
        define_method "#{name}_url",        -> (geometry) {               self.send("#{name}_attributes", geometry).try(:[], 'url') }
        define_method "#{name}_attributes", -> (geometry) {               str = self.send(name); Utils.url_for(str, geometry) if str; }
        define_method "#{name}=",           -> (value)    {
          new_value = (value.respond_to?(:read) ? Utils.attache_upload(value) : value)
          okay = JSON.parse(new_value)['path'] rescue nil
          super(Utils.array(okay ? new_value : nil).first)
        }
        define_method "#{name}_discard_was",-> do
          new_value = self.send("#{name}")
          old_value = self.send("#{name}_was")
          obsoleted = Utils.array(old_value).collect {|x| JSON.parse(x)['path'] } - Utils.array(new_value).collect {|x| JSON.parse(x)['path'] }
          self.attaches_discarded ||= []
          self.attaches_discarded.push(*obsoleted)
        end
        after_update "#{name}_discard_was"
        define_method "#{name}_discard",    -> do
          self.attaches_discarded ||= []
          if attrs = self.send("#{name}_attributes", 'original')
            self.attaches_discarded.push(attrs['path'])
          end
        end
        after_destroy "#{name}_discard"
      end

      def has_many_attaches(name)
        serialize name, JSON
        define_method "#{name}_options",    -> (geometry, options = {}) { Utils.attache_options(geometry, self.send("#{name}_attributes", geometry), multiple: true, **options) }
        define_method "#{name}_urls",       -> (geometry) {               self.send("#{name}_attributes", geometry).collect {|attrs| attrs['url'] } }
        define_method "#{name}_attributes", -> (geometry) {
          (self.send(name) || []).inject([]) do |sum, str|
            sum + Utils.array(str.present? && Utils.url_for(str, geometry))
          end
        }
        define_method "#{name}=",           -> (array)    {
          new_value = Utils.array(array).inject([]) {|sum,value|
            hash = value.respond_to?(:read) ? Utils.attache_upload(value) : value
            okay = JSON.parse(hash)['path'] rescue nil
            okay ? sum + [hash] : sum
          }
          super(Utils.array new_value)
        }
        define_method "#{name}_discard_was",-> do
          new_value = [*self.send("#{name}")]
          old_value = [*self.send("#{name}_was")]
          obsoleted = old_value.collect {|x| JSON.parse(x)['path'] } - new_value.collect {|x| JSON.parse(x)['path'] }
          self.attaches_discarded ||= []
          obsoleted.each {|path| self.attaches_discarded.push(path) }
        end
        after_update "#{name}_discard_was"
        define_method "#{name}_discard",    -> do
          self.attaches_discarded ||= []
          self.send("#{name}_attributes", 'original').each {|attrs| self.attaches_discarded.push(attrs['path']) }
        end
        after_destroy "#{name}_discard"
      end
    end
  end
end

ActiveRecord::Base.send(:include, AttacheRails::Model)
