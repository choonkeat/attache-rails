# attache_rails

Ruby on Rails integration for [attache server](https://github.com/choonkeat/attache)

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

If you want to customize the file upload look and feel, define your own react `<AttacheFilePreview/>` renderer *before* including the attache js. For example,

``` javascript
//= require ./my_attache_file_preview.js
//= require attache
```


## Usage

### Database

To use `attache`, you only need to store the JSON attributes given to you after you've uploaded a file. So if you have an existing model, you only need to add a text column

``` bash
rails generate migration AddPhotoPathToUsers photo:text
```

To assign **multiple** images to **one** model, the same column can be used, although pluralized column name reads better

``` bash
rails generate migration AddPhotoPathToUsers photos:text
```

### Model

In your model, define whether it `has_one_attache` or `has_many_attaches`

``` ruby
class User < ActiveRecord::Base
  has_many_attaches :photos
end
```

### New or Edit form

In your form, you would add some options to `file_field` using the `attache_options` helper method:

``` slim
= f.file_field :photos, f.object.avatar_options('64x64#')
```

If you were using `has_many_attaches` the file input will automatically allow multiple files, otherwise the file input will only accept 1 file.


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
  params.require(:user).permit(:name, :photo)
end
```

If you're accepting multiple file uploads, change it to

``` ruby
def user_params
  params.require(:user).permit(:name, photos: [])
end
```

### Show

Use the `*_url` or `*_urls` methods (depending on whether you are accepting multiple files) to obtain full urls.

``` slim
= image_tag @user.photo_url('100x100#')
```

or

``` slim
- @user.photos_urls('200x200#').each do |url|
  = image_tag url
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
