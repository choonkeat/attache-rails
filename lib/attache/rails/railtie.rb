require 'rails'

module Attache
  module Rails
    class Attache::Rails::Railtie < ::Rails::Railtie
      initializer "attache-rails.configure" do |app|
        ActiveRecord::Base.send(:include, Attache::Rails::Model)
      end
    end
  end
end
