require 'rails/generators/active_record'

module Attache
  module Rails
    class UpgradeV2ToV3Generator < ::Rails::Generators::Base
      include ::Rails::Generators::Migration

      def self.next_migration_number(dir)
        ActiveRecord::Generators::Base.next_migration_number(dir)
      end

      def self.source_root
        @source_root ||= File.expand_path('../templates', __FILE__)
      end

      def generate_migration
        migration_template "upgrade_v2_to_v3_migration.rb.erb", "db/migrate/#{migration_file_name}"
      end

      def migration_name
        "UpgradeAttacheFieldsFromV2ToV3"
      end

      def migration_file_name
        "#{migration_name.underscore}.rb"
      end

      def migration_class_name
        migration_name.camelize
      end

      $has_one_attache = []
      $has_many_attaches = []

      ActiveRecord::Base.class_eval do
        def self.has_one_attache(name)
          $has_one_attache.push([self.name, name])
        end

        def self.has_many_attaches(name)
          $has_many_attaches.push([self.name, name])
        end
      end

      # Rails::ConsoleMethods#reload!
      ActionDispatch::Reloader.cleanup!
      ActionDispatch::Reloader.prepare!

      ActiveRecord::Base.connection.tables.each do |table|
        if klass = table.classify.safe_constantize
        else
          puts "skipped #{table}"
        end
      end
    end
  end
end
