# attache_client

Ruby on Rails integration for [attache server](https://github.com/choonkeat/attache)

## Dependencies

[React](https://github.com/reactjs/react-rails), jQuery, Bootstrap 3

## Installation

Install the attache_client package from Rubygems:

``` bash
gem install attache_client
```

Or add this to your `Gemfile`

``` ruby
gem "attache_client"
```

Add the attache javascript to your `application.js`

``` javascript
//= require attache
```

Or you can include the various scripts yourself

``` javascript
//= require attache/cors_upload
//= require attache/bootstrap3
//= require attache/ujs
```

## Usage

### Database

To use `attache`, you only need to store the `path`, given to you after you've uploaded a file. So if you have an existing model, you only need to add a string, varchar or text field

``` bash
rails generate migration AddPhotoPathToUsers photo_path:string
```

To assign **multiple** images to **one** model, you'd only need one text field

``` bash
rails generate migration AddPhotoPathToUsers photo_path:text
```

### Model

In your model, `serialize` the column

``` ruby
class User < ActiveRecord::Base
  serialize :photo_path, JSON
end
```

### New or Edit form

In your form, you would add some options to `file_field` using the `attache_options` helper method. For example, a regular file field may look like this:

``` slim
= f.file_field :photo_path
```

Change it to

``` slim
= f.file_field :photo_path, **attache_options('64x64#', f.object.photo_path)
```

Or if you're expecting multiple files uploaded, simply add `multiple: true`

``` slim
= f.file_field :photo_path, multiple: true, **attache_options('64x64#', f.object.photo_path)
```

NOTE: `64x64#` is just an example, you should define a suitable [geometry](http://www.imagemagick.org/Usage/resize/) for your form

### Show

Use the `attache_urls` helper to obtain full urls for the values you've captured in your database.

``` slim
- attache_urls(@user.photo_path, '128x128#') do |url|
  = image_tag(url)
```

Alternatively, you can get the list of urls and manipulate it however you want

``` slim
= image_tag attache_urls(@user.photo_path, '128x128#').sample
```

# License

MIT
