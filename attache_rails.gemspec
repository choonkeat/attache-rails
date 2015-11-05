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

  s.add_dependency "rails", ">= 4.0.0"
  s.add_dependency "attache_api", "~> 0.1.1"

  s.add_runtime_dependency 'httpclient'

  s.add_development_dependency "rspec-rails"
  s.add_development_dependency "guard-rspec"
  s.add_development_dependency "sqlite3"
  s.add_development_dependency "factory_girl_rails"
end
