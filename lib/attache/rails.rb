module Attache
  module Rails
  end
end

require "attache/rails/engine"
require "attache/rails/model"
require "attache/api/test" if defined?(Rails) && Rails.env.test?
