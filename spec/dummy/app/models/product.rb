class Product < ActiveRecord::Base
  has_one_attache :hero_image
  has_many_attaches :photos
end
