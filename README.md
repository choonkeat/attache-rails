# attache-rails

[![Gem Version](https://badge.fury.io/rb/attache-rails.svg)](https://badge.fury.io/rb/attache-rails)
[![Build Status](https://travis-ci.org/choonkeat/attache-rails.svg?branch=master)](https://travis-ci.org/choonkeat/attache-rails)

Ruby on Rails / ActiveRecord integration for [attache server](https://github.com/choonkeat/attache) using [attache/api](https://github.com/choonkeat/attache-api)

## Dependencies

[React](https://github.com/reactjs/react-rails), jQuery, Bootstrap 3

## Installation

**WARNING: Please see upgrade notes below if you are upgrading from V2**

Install the attache-rails package from Rubygems:

``` bash
gem install attache-rails
```

Or add this to your `Gemfile`

``` ruby
gem "attache-rails"
```

Add the attache javascript to your `application.js`

``` javascript
//= require attache
```

#### Using its components alone

If you prefer to skip automatic upgrading of `input[type=file]`, you can wield the components yourself

``` javascript
//= require attache/cors_upload
//= require attache/bootstrap3
//= require attache/file_input

attache_cors_upload.CORSUpload
attache_bootstrap3.Bootstrap3FilePreview
attache_bootstrap3.Bootstrap3Header
attache_bootstrap3.Bootstrap3Placeholder
```

#### Customize UI

If you want to customize the file upload look and feel, define your own React `<AttacheFilePreview/>`, `<AttacheHeader/>`, `<AttachePlaceholder/>` renderer *before* including the attache js. For example,

``` javascript
//= require ./my_attache_file_preview.js
//= require attache
```

The `attache_file_input.AttacheFileInput` idempotent function is setup to find all the elements with `enable-attache` css class and upgrade them to use the direct upload & preview javascript. If you wish to re-run this function any other time, e.g. hookup the `cocoon:after-insert` event, you may

``` javascript
$(document).on('cocoon:after-insert', attache_file_input.AttacheFileInput);
```


## Usage

### Database

To use `attache`, you only need to store the JSON attributes given to you after you've uploaded a file. So if you have an existing model, you only need to add a text column (PostgreSQL users see below)

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
  params.require(:user).permit(:name, :photo, attaches_discarded: [])
end
```

If you're accepting multiple file uploads, change it to

``` ruby
def user_params
  params.require(:user).permit(:name, photos: [], attaches_discarded: [])
end
```

NOTE: You do not have to manage `params[:attaches_discarded]` yourself. It is automatically managed for you between the frontend javascript and the ActiveRecord integration: files that are discarded will be removed from the attache server when you update or destroy your model.

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

`ATTACHE_URL` points to the attache server. e.g. `http://localhost:9292`

`ATTACHE_UPLOAD_DURATION` refers to the number of seconds before a signed upload request is considered expired, e.g. `600`

`ATTACHE_SECRET_KEY` is the shared secret with the `attache` server. e.g. `t0psecr3t`

* If this variable is not set, then upload requests will not be signed & `ATTACHE_UPLOAD_DURATION` will be ignored
* If this variable is set, it must be the same value as `SECRET_KEY` is set on the `attache` server

### PostgreSQL

Take advantage of the [json support](http://guides.rubyonrails.org/active_record_postgresql.html#json) by using the [`json` or `jsonb` column types](http://www.postgresql.org/docs/9.4/static/functions-json.html) instead

``` bash
rails generate migration AddPhotoPathToUsers photo:json
```

This opens up the possibility to query inside the column, e.g.

``` ruby
User.where("photo ->> 'content_type' = ?", 'image/png')
```

# License

MIT
