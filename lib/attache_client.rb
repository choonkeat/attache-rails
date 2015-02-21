require "attache_client/engine"

module AttacheClient
  module ViewHelper
    ATTACHE_UPLOAD_URL   = ENV.fetch('ATTACHE_UPLOAD_URL')   { 'http://localhost:9292/upload' }
    ATTACHE_DOWNLOAD_URL = ENV.fetch('ATTACHE_DOWNLOAD_URL') { 'http://localhost:9292/view' }

    def attache_urls(json, geometry)
      array = json.kind_of?(Array) ? json : [*json]
      array.collect do |path|
        download_url = ATTACHE_DOWNLOAD_URL
        prefix, basename = File.split(path)
        [download_url, prefix, CGI.escape(geometry), basename].join('/').tap do |url|
          yield url if block_given?
        end
      end
    end

    def attache_options(geometry, current_value)
      {
        class: 'enable-attache',
        data: {
          geometry: geometry,
          value: [*current_value],
          uploadurl: ATTACHE_UPLOAD_URL,
          downloadurl: ATTACHE_DOWNLOAD_URL,
        },
      }
    end
  end
end

ActionView::Base.send(:include, AttacheClient::ViewHelper)
