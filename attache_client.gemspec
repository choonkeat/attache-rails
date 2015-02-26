$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "attache_rails/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "attache_rails"
  s.version     = AttacheRails::VERSION
  s.authors     = ["choonkeat"]
  s.email       = ["choonkeat@gmail.com"]
  s.homepage    = "https://github.com/choonkeat/attache_rails"
  s.summary     = "Client lib to use attache server"
  s.license     = "MIT"

  s.files       = Dir["{app,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
end
