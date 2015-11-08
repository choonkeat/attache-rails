module Attache
  module Rails
    class Engine < ::Rails::Engine
      isolate_namespace Attache::Rails
    end
  end
end
