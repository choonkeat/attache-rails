# attache_rails

Ruby on Rails integration for [attache server](https://github.com/choonkeat/attache)

NOTE: You can learn how to use this gem by looking at the [changes made to our example app](https://github.com/choonkeat/attache-railsapp/commit/16cb1274dcce5be01b6c9d42ad60c30c106ad7f9) or follow the step by step instructions in this `README`

## Dependencies

[React](https://github.com/reactjs/react-rails), jQuery, Bootstrap 3

## Installation

Install the attache_rails package from Rubygems:

``` bash
gem install attache_rails
```

Or add this to your `Gemfile`

``` ruby
gem "attache_rails"
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

### Strong Parameters

You'd need to permit the new field in your controller. For example, a strong parameters definition may look like this in your `Users` controller

``` ruby
def user_params
  params.require(:user).permit(:name)
end
```

If you're only accepting a single file upload, change it to

``` ruby
def user_params
  params.require(:user).permit(:name, :photo_path)
end
```

If you're accepting multiple file uploads via `multiple: true`, change it to

``` ruby
def user_params
  params.require(:user).permit(:name, photo_path: [])
end
```

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

### Environment configs

`ATTACHE_UPLOAD_URL` points to the attache server upload url. e.g. `http://localhost:9292/upload`

`ATTACHE_DOWNLOAD_URL` points to url prefix for downloading the resized images, e.g. `http://cdn.lvh.me:9292/view`

`ATTACHE_UPLOAD_DURATION` refers to the number of seconds before a signed upload request is considered expired, e.g. `600`

`ATTACHE_SECRET_KEY` is the shared secret with the `attache` server. e.g. `t0psecr3t`

* If this variable is not set, then upload requests will not be signed & `ATTACHE_UPLOAD_DURATION` will be ignored
* If this variable is set, it must be the same value as `SECRET_KEY` is set on the `attache` server


# License

MIT
