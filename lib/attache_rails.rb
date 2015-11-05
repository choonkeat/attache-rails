module AttacheRails
  ATTACHE_URL             = ENV.fetch('ATTACHE_URL')             { "http://localhost:9292" }
  ATTACHE_UPLOAD_URL      = ENV.fetch('ATTACHE_UPLOAD_URL')      { "#{ATTACHE_URL}/upload" }
  ATTACHE_DOWNLOAD_URL    = ENV.fetch('ATTACHE_DOWNLOAD_URL')    { "#{ATTACHE_URL}/view" }
  ATTACHE_DELETE_URL      = ENV.fetch('ATTACHE_DELETE_URL')      { "#{ATTACHE_URL}/delete" }
  ATTACHE_UPLOAD_DURATION = ENV.fetch('ATTACHE_UPLOAD_DURATION') { 3.hours }.to_i # expires signed upload form
end

require "attache_rails/engine"
require "attache_rails/model"
require "attache/api/test" if defined?(Rails) && Rails.env.test?
