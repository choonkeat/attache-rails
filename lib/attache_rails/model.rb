require "cgi"
require "uri"
require "httpclient"
require "attache/api"

module AttacheRails
  module Model
    include Attache::API::Model

    def self.included(base)
      # has_one_attache, has_many_attaches
      base.extend ClassMethods

      # `discard` management
      base.class_eval do
        attr_accessor :attaches_discarded
        after_commit if: :attaches_discarded do |instance|
          instance.attaches_discard!(instance.attaches_discarded)
        end
      end
    end

    module ClassMethods
      def attache_setup_column(name)
        case coltype = column_for_attribute(name).type
        when :text, :string, :binary
          serialize name, JSON
        end
      rescue Exception
      end

      def has_one_attache(name)
        attache_setup_column(name)
        define_method "#{name}_options",    -> (geometry, options = {}) { Hash(class: 'enable-attache', multiple: false).merge(attache_field_options(self.send(name), geometry, options)) }
        define_method "#{name}_url",        -> (geometry)               { attache_field_urls(self.send(name), geometry).try(:first) }
        define_method "#{name}_attributes", -> (geometry)               { attache_field_attributes(self.send(name), geometry).try(:first) }
        define_method "#{name}=",           -> (value)                  { super(attache_field_set(Array.wrap(value)).try(:first)) }
        after_update                        ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), self.send("#{name}"), self.attaches_discarded) }
        after_destroy                       ->                          { self.attaches_discarded ||= []; attache_mark_for_discarding(self.send("#{name}_was"), [], self.attaches_discarded) }
      end

      def has_many_attaches(name)
        attache_setup_column(name)
        define_method "#{name}_options",    -> (geometry, options = {}) { Hash(class: 'enable-attache', multiple: true).merge(attache_field_options(self.send(name), geometry, options)) }
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
