$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "attache_client/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "attache_client"
  s.version     = AttacheClient::VERSION
  s.authors     = ["choonkeat"]
  s.email       = ["choonkeat@gmail.com"]
  s.homepage    = "https://github.com/choonkeat/attache_client"
  s.summary     = "Client lib to use attache server"
  s.license     = "MIT"

  s.files       = Dir["{app,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
end
