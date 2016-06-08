module Attache
  module Rails
  end
end

require "attache/rails/engine"
require "attache/rails/model"
require 'attache/rails/railtie' if defined? ::Rails::Railtie
require "attache/api/test" if defined?(Rails) && Rails.env.test?
