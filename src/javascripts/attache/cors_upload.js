/*global $*/
/*global alert*/
/*global XMLHttpRequest*/
/*global XDomainRequest*/

var counter = 0

export class CORSUpload {
  constructor (options) {
    if (options == null) options = {}
    var option
    for (option in options) {
      this[option] = options[option]
    }
  }

  // for overwriting
  createLocalThumbnail () { }
  onComplete (uid, json) { }
  onProgress (uid, json) { }
  onError (uid, status) { alert(status) }

  handleFileSelect () {
    var f, _i, _len, _results, url, $ele, prefix
    $ele = $(this.file_element)
    url = $ele.data('uploadurl')
    if ($ele.data('hmac')) {
      url = url +
        '?hmac=' + encodeURIComponent($ele.data('hmac')) +
        '&uuid=' + encodeURIComponent($ele.data('uuid')) +
        '&expiration=' + encodeURIComponent($ele.data('expiration')) +
        ''
    }

    prefix = Date.now() + '_'
    _results = []
    for (_i = 0, _len = this.files.length; _i < _len; _i++) {
      f = this.files[_i]
      this.createLocalThumbnail(f) // if any
      f.uid = prefix + (counter++)
      this.onProgress(f.uid, { src: f.src, filename: f.name, percentLoaded: 0, bytesLoaded: 0, bytesTotal: f.size })
      _results.push(this.performUpload(f, url))
    }
    return _results
  }

  createCORSRequest (method, url) {
    var xhr
    xhr = new XMLHttpRequest()
    if (xhr.withCredentials != null) {
      xhr.open(method, url, true)
    } else if (typeof XDomainRequest !== 'undefined') {
      xhr = new XDomainRequest()
      xhr.open(method, url)
    } else {
      xhr = null
    }
    return xhr
  }

  performUpload (file, url) {
    var this_s3upload, xhr
    this_s3upload = this
    url = url + (url.indexOf('?') === -1 ? '?' : '&') + 'file=' + encodeURIComponent(file.name)
    xhr = this.createCORSRequest('PUT', url)
    if (!xhr) {
      this.onError(file.uid, 'CORS not supported')
    } else {
      xhr.onload = function (e) {
        if (xhr.status === 200) {
          this_s3upload.onComplete(file.uid, JSON.parse(e.target.responseText))
        } else {
          return this_s3upload.onError(file.uid, xhr.status + ' ' + xhr.statusText)
        }
      }
      xhr.onerror = function () {
        return this_s3upload.onError(file.uid, 'Unable to reach server')
      }
      xhr.upload.onprogress = function (e) {
        var percentLoaded
        if (e.lengthComputable) {
          percentLoaded = Math.round((e.loaded / e.total) * 100)
          return this_s3upload.onProgress(file.uid, { src: file.src, filename: file.name, percentLoaded: percentLoaded, bytesLoaded: e.loaded, bytesTotal: e.total })
        }
      }
    }
    return xhr.send(file)
  }
}
