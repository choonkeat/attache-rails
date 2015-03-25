module AttacheRails
  ATTACHE_URL             = ENV.fetch('ATTACHE_URL')             { "http://localhost:9292" }
  ATTACHE_UPLOAD_URL      = ENV.fetch('ATTACHE_UPLOAD_URL')      { "#{ATTACHE_URL}/upload" }
  ATTACHE_DOWNLOAD_URL    = ENV.fetch('ATTACHE_DOWNLOAD_URL')    { "#{ATTACHE_URL}/view" }
  ATTACHE_DELETE_URL      = ENV.fetch('ATTACHE_DELETE_URL')      { "#{ATTACHE_URL}/delete" }
  ATTACHE_UPLOAD_DURATION = ENV.fetch('ATTACHE_UPLOAD_DURATION') { "600" }.to_i # signed upload form expires in 10 minutes
end

require "attache_rails/engine"
require "attache_rails/model"
