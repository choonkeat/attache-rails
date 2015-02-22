var CORSUpload = (function() {
  var counter = 0;

  CORSUpload.prototype.onComplete = function(uid, json) { };
  CORSUpload.prototype.onProgress = function(uid, json) { };
  CORSUpload.prototype.onError = function(uid, status) { alert(status); };

  function CORSUpload(options) {
    if (options == null) options = {};
    for (option in options) {
      this[option] = options[option];
    }
    this.handleFileSelect(options.file_element);
  }

  CORSUpload.prototype.handleFileSelect = function(file_element) {
    var f, files, output, _i, _len, _results, url, $ele;
    $ele = $(file_element);
    url = $ele.data('uploadurl');
    if ($ele.data('hmac')) {
      url = url +
            "?hmac=" + encodeURIComponent($ele.data('hmac')) +
            "&uuid=" + encodeURIComponent($ele.data('uuid')) +
            "&expiration=" + encodeURIComponent($ele.data('expiration')) +
            ""
    }

    files = file_element.files;
    output = [];
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      f = files[_i];
      f.uid = counter++;
      this.onProgress(f.uid, { filename: f.name, percentLoaded: 0, bytesLoaded: 0, bytesTotal: f.size });
      _results.push(this.performUpload(f, url));
    }
    return _results;
  };

  CORSUpload.prototype.createCORSRequest = function(method, url) {
    var xhr;
    xhr = new XMLHttpRequest();
    if (xhr.withCredentials != null) {
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined") {
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      xhr = null;
    }
    return xhr;
  };

  CORSUpload.prototype.performUpload = function(file, url) {
    var this_s3upload, xhr;
    this_s3upload = this;
    url = url + (url.indexOf('?') == -1 ? '?' : '&') + 'file=' + encodeURIComponent(file.name);
    xhr = this.createCORSRequest('PUT', url);
    if (!xhr) {
      this.onError(file.uid, 'CORS not supported');
    } else {
      xhr.onload = function(e) {
        if (xhr.status === 200) {
          this_s3upload.onComplete(file.uid, JSON.parse(e.target.responseText));
        } else {
          return this_s3upload.onError(file.uid, 'Upload error: ' + xhr.status);
        }
      };
      xhr.onerror = function() {
        return this_s3upload.onError(file.uid, 'XHR error.');
      };
      xhr.upload.onprogress = function(e) {
        var percentLoaded;
        if (e.lengthComputable) {
          percentLoaded = Math.round((e.loaded / e.total) * 100);
          return this_s3upload.onProgress(file.uid, { filename: file.name, percentLoaded: percentLoaded, bytesLoaded: e.loaded, bytesTotal: e.total });
        }
      };
    }
    return xhr.send(file);
  };

  return CORSUpload;

})();
