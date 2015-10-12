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

      def jsonify(value)
        case value
        when Hash
          value
        else
          JSON.parse(value.to_s) rescue Hash.new
        end
      end

      def url_for(json_string, geometry)
        json_string.tap do |attrs|
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
        after_commit if: :attaches_discarded do |instance|
          instance.attaches_discard!(instance.attaches_discarded)
        end
      end
    end

    def attache_field_options(attr_value, geometry, options = {})
      Utils.attache_options(geometry, attache_field_attributes(attr_value, geometry), **options)
    end

    def attache_field_urls(attr_value, geometry)
      attache_field_attributes(attr_value, geometry).collect {|attrs| attrs['url']}
    end

    def attache_field_attributes(attr_value, geometry)
      Utils.array(attr_value).inject([]) do |sum, obj|
        sum + Utils.array(obj.present? && Utils.url_for(obj, geometry))
      end
    end

    def attache_field_set(array)
      new_value = Utils.array(array).inject([]) {|sum,value|
        hash = Utils.jsonify(value.respond_to?(:read) && Utils.attache_upload(value) || value)
        okay = hash.respond_to?(:[]) && (hash['path'] || hash[:path])
        okay ? sum + [hash] : sum
      }
      Utils.array(new_value)
    end

    def attache_mark_for_discarding(old_value, new_value, attaches_discarded)
      obsoleted = Utils.array(old_value).collect {|x| x['path'] } - Utils.array(new_value).collect {|x| x['path'] }
      obsoleted.each {|path| attaches_discarded.push(path) }
    end

    def attaches_discard!(files)
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
        define_method "#{name}_options",    -> (geometry, options = {}) { attache_field_options(self.send(name), geometry, Hash(multiple: false).merge(options)) }
        define_method "#{name}_url",        -> (geometry)               { attache_field_urls(self.send(name), geometry).try(:first) }
        define_method "#{name}_attributes", -> (geometry)               { attache_field_attributes(self.send(name), geometry).try(:first) }
        define_method "#{name}=",           -> (value)                  { super(attache_field_set(Utils.array(value)).try(:first)) }
        after_update                        ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), self.send("#{name}"), self.attaches_discarded) }
        after_destroy                       ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), [], self.attaches_discarded) }
      end

      def has_many_attaches(name)
        serialize name, JSON
        define_method "#{name}_options",    -> (geometry, options = {}) { attache_field_options(self.send(name), geometry, Hash(multiple: true).merge(options)) }
        define_method "#{name}_urls",       -> (geometry)               { attache_field_urls(self.send(name), geometry) }
        define_method "#{name}_attributes", -> (geometry)               { attache_field_attributes(self.send(name), geometry) }
        define_method "#{name}=",           -> (value)                  { super(attache_field_set(Utils.array(value))) }
        after_update                        ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), self.send("#{name}"), self.attaches_discarded) }
        after_destroy                       ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), [], self.attaches_discarded) }
      end
    end
  end
end

ActiveRecord::Base.send(:include, AttacheRails::Model)
