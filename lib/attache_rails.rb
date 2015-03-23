module AttacheRails
  ATTACHE_UPLOAD_URL      = ENV.fetch('ATTACHE_UPLOAD_URL')      { 'http://localhost:9292/upload' }
  ATTACHE_DOWNLOAD_URL    = ENV.fetch('ATTACHE_DOWNLOAD_URL')    { 'http://localhost:9292/view' }
  ATTACHE_UPLOAD_DURATION = ENV.fetch('ATTACHE_UPLOAD_DURATION') { '600' }.to_i # signed upload form expires in 10 minutes
end

require "attache_rails/engine"
require "attache_rails/model"
