require "cgi"
require "uri"
require "httpclient"
require "attache/api"

module AttacheRails
  module Model
    def self.included(base)
      base.send(:include, Attache::API::Model)
      base.extend ClassMethods
      base.class_eval do
        attr_accessor :attaches_discarded
        after_commit if: :attaches_discarded do |instance|
          instance.attaches_discard!(instance.attaches_discarded)
        end
      end
    end

    module ClassMethods
      def has_one_attache(name)
        serialize name, JSON
        define_method "#{name}_options",    -> (geometry, options = {}) { attache_field_options(self.send(name), geometry, Hash(multiple: false).merge(options)) }
        define_method "#{name}_url",        -> (geometry)               { attache_field_urls(self.send(name), geometry).try(:first) }
        define_method "#{name}_attributes", -> (geometry)               { attache_field_attributes(self.send(name), geometry).try(:first) }
        define_method "#{name}=",           -> (value)                  { super(attache_field_set(Array.wrap(value)).try(:first)) }
        after_update                        ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), self.send("#{name}"), self.attaches_discarded) }
        after_destroy                       ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), [], self.attaches_discarded) }
      end

      def has_many_attaches(name)
        serialize name, JSON
        define_method "#{name}_options",    -> (geometry, options = {}) { attache_field_options(self.send(name), geometry, Hash(multiple: true).merge(options)) }
        define_method "#{name}_urls",       -> (geometry)               { attache_field_urls(self.send(name), geometry) }
        define_method "#{name}_attributes", -> (geometry)               { attache_field_attributes(self.send(name), geometry) }
        define_method "#{name}=",           -> (value)                  { super(attache_field_set(Array.wrap(value))) }
        after_update                        ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), self.send("#{name}"), self.attaches_discarded) }
        after_destroy                       ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), [], self.attaches_discarded) }
      end
    end
  end
end

ActiveRecord::Base.send(:include, AttacheRails::Model)
