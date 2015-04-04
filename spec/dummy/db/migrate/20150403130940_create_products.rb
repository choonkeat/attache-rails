class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.string :name
      t.text :hero_image
      t.text :photos

      t.timestamps null: false
    end
  end
end
