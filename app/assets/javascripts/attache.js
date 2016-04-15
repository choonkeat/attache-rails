(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.attache = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _file_input = require('./attache/file_input');

var upgradeFileInput = function upgradeFileInput() {
  var safeWords = { 'class': 'className', 'for': 'htmlFor' };
  var sel = document.getElementsByClassName('enable-attache');
  var ele, attrs, name, value;
  for (var i = sel.length - 1; i >= 0; i--) {
    ele = sel[i];
    attrs = ele.dataset.attacheProps;
    if (attrs) {
      attrs = JSON.parse(attrs);
    } else {
      attrs = {};
      for (var j = 0; j < ele.attributes.length; j++) {
        name = ele.attributes[j].name;
        value = ele.attributes[j].value;
        if (name === 'class') value = value.replace('enable-attache', 'attache-enabled');
        name = safeWords[name] || name;
        attrs[name] = value;
      }
    }
    var wrap = document.createElement('div');
    wrap.className = 'enable-attache';
    wrap.dataset.attacheProps = JSON.stringify(attrs);
    ele.parentNode.replaceChild(wrap, ele);
    ReactDOM.render(React.createElement(_file_input.AttacheFileInput, React.__spread({}, attrs)), wrap);
  }
}; /*global $*/
/*global React*/
/*global ReactDOM*/

$(document).on('page:change turbolinks:load', upgradeFileInput);
$(upgradeFileInput);

},{"./attache/file_input":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*global $*/
/*global React*/

var Bootstrap3FilePreview = exports.Bootstrap3FilePreview = React.createClass({
  displayName: 'Bootstrap3FilePreview',
  getInitialState: function getInitialState() {
    return { srcWas: '' };
  },
  onSrcLoaded: function onSrcLoaded(event) {
    this.setState({ srcWas: this.props.src });
    $(event.target).trigger('attache:imgload');
  },
  onSrcError: function onSrcError(event) {
    $(event.target).trigger('attache:imgerror');
  },
  render: function render() {
    var previewClassName = 'attache-file-preview';

    // progressbar
    if (this.state.srcWas !== this.props.src) {
      previewClassName = previewClassName + ' attache-loading';
      var className = this.props.className || 'progress-bar progress-bar-striped active' + (this.props.src ? ' progress-bar-success' : '');
      var pctString = this.props.pctString || (this.props.src ? 100 : this.props.percentLoaded) + '%';
      var pctDesc = this.props.pctDesc || (this.props.src ? 'Loading...' : pctString);
      var pctStyle = { width: pctString, minWidth: '3em' };
      var progress = React.createElement(
        'div',
        { className: 'progress' },
        React.createElement(
          'div',
          {
            className: className,
            role: 'progressbar',
            'aria-valuenow': this.props.percentLoaded,
            'aria-valuemin': '0',
            'aria-valuemax': '100',
            style: pctStyle },
          pctDesc
        )
      );
    }

    // img tag
    if (this.props.src) {
      var img = React.createElement('img', { src: this.props.src, onLoad: this.onSrcLoaded, onError: this.onSrcError });
    }

    // combined
    return React.createElement(
      'div',
      { className: previewClassName },
      progress,
      img,
      React.createElement(
        'div',
        { className: 'clearfix' },
        React.createElement(
          'div',
          { className: 'pull-left' },
          this.props.filename
        ),
        React.createElement(
          'a',
          {
            href: '#remove',
            className: 'pull-right',
            onClick: this.props.onRemove,
            title: 'Click to remove' },
          '×'
        )
      )
    );
  }
});

var Bootstrap3Placeholder = exports.Bootstrap3Placeholder = React.createClass({
  displayName: 'Bootstrap3Placeholder',
  render: function render() {
    return React.createElement(
      'div',
      { className: 'attache-file-preview' },
      React.createElement('img', { src: this.props.src })
    );
  }
});

var Bootstrap3Header = exports.Bootstrap3Header = React.createClass({
  displayName: 'Bootstrap3Header',
  render: function render() {
    return React.createElement('noscript', null);
  }
});

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global $*/
/*global alert*/
/*global XMLHttpRequest*/
/*global XDomainRequest*/

var counter = 0;

var CORSUpload = exports.CORSUpload = (function () {
  function CORSUpload(options) {
    _classCallCheck(this, CORSUpload);

    if (options == null) options = {};
    var option;
    for (option in options) {
      this[option] = options[option];
    }
  }

  // for overwriting

  _createClass(CORSUpload, [{
    key: 'createLocalThumbnail',
    value: function createLocalThumbnail() {}
  }, {
    key: 'onComplete',
    value: function onComplete(uid, json) {}
  }, {
    key: 'onProgress',
    value: function onProgress(uid, json) {}
  }, {
    key: 'onError',
    value: function onError(uid, status) {
      alert(status);
    }
  }, {
    key: 'handleFileSelect',
    value: function handleFileSelect() {
      var f, _i, _len, _results, url, $ele, prefix;
      $ele = $(this.file_element);
      url = $ele.data('uploadurl');
      if ($ele.data('hmac')) {
        url = url + '?hmac=' + encodeURIComponent($ele.data('hmac')) + '&uuid=' + encodeURIComponent($ele.data('uuid')) + '&expiration=' + encodeURIComponent($ele.data('expiration')) + '';
      }

      prefix = Date.now() + '_';
      _results = [];
      for (_i = 0, _len = this.files.length; _i < _len; _i++) {
        f = this.files[_i];
        this.createLocalThumbnail(f); // if any
        f.uid = prefix + counter++;
        this.onProgress(f.uid, { src: f.src, filename: f.name, percentLoaded: 0, bytesLoaded: 0, bytesTotal: f.size });
        _results.push(this.performUpload(f, url));
      }
      return _results;
    }
  }, {
    key: 'createCORSRequest',
    value: function createCORSRequest(method, url) {
      var xhr;
      xhr = new XMLHttpRequest();
      if (xhr.withCredentials != null) {
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest !== 'undefined') {
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        xhr = null;
      }
      return xhr;
    }
  }, {
    key: 'performUpload',
    value: function performUpload(file, url) {
      var this_s3upload, xhr;
      this_s3upload = this;
      url = url + (url.indexOf('?') === -1 ? '?' : '&') + 'file=' + encodeURIComponent(file.name);
      xhr = this.createCORSRequest('PUT', url);
      if (!xhr) {
        this.onError(file.uid, 'CORS not supported');
      } else {
        xhr.onload = function (e) {
          if (xhr.status === 200) {
            this_s3upload.onComplete(file.uid, JSON.parse(e.target.responseText));
          } else {
            return this_s3upload.onError(file.uid, xhr.status + ' ' + xhr.statusText);
          }
        };
        xhr.onerror = function () {
          return this_s3upload.onError(file.uid, 'Unable to reach server');
        };
        xhr.upload.onprogress = function (e) {
          var percentLoaded;
          if (e.lengthComputable) {
            percentLoaded = Math.round(e.loaded / e.total * 100);
            return this_s3upload.onProgress(file.uid, { src: file.src, filename: file.name, percentLoaded: percentLoaded, bytesLoaded: e.loaded, bytesTotal: e.total });
          }
        };
      }
      return xhr.send(file);
    }
  }]);

  return CORSUpload;
})();

},{}],4:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*global $*/
/*global window*/
/*global React*/
/*global ReactDOM*/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttacheFileInput = undefined;

var _cors_upload = require('./cors_upload');

var _bootstrap = require('./bootstrap3');

var AttacheFileInput = exports.AttacheFileInput = React.createClass({
  displayName: 'AttacheFileInput',
  getInitialState: function getInitialState() {
    var files = {};
    if (this.props['data-value']) {
      $.each(JSON.parse(this.props['data-value']), function (uid, json) {
        if (json) files[uid] = json;
      });
    }
    return { files: files, attaches_discarded: [], uploading: 0 };
  },
  onRemove: function onRemove(uid, e) {
    e.preventDefault();
    e.stopPropagation();

    var fieldname = ReactDOM.findDOMNode(this).firstChild.name; // when   'user[avatar]'
    var newfield = fieldname.replace(/\w+\](\[\]|)$/, 'attaches_discarded][]'); // become 'user[attaches_discarded][]'

    this.state.attaches_discarded.push({ fieldname: newfield, path: this.state.files[uid].path });
    delete this.state.files[uid];

    this.setState(this.state);
  },
  performUpload: function performUpload(file_element, files) {
    // user cancelled file chooser dialog. ignore
    if (!files || files.length === 0) return;
    if (!this.props.multiple) {
      this.state.files = {};
      files = [files[0]]; // array of 1 element
    }

    this.setState(this.state);
    // upload the file via CORS
    var that = this;

    that.state.uploading = that.state.uploading + files.length;
    if (!that.state.submit_buttons) that.state.submit_buttons = $("button,input[type='submit']", $(file_element).parents('form')[0]).filter(':not(:disabled)');

    var upload = new _cors_upload.CORSUpload({
      file_element: file_element,
      files: files,
      onProgress: this.setFileValue,
      onComplete: function onComplete() {
        that.state.uploading--;
        that.setFileValue.apply(this, arguments);
      },
      onError: function onError(uid, status) {
        that.state.uploading--;
        that.setFileValue(uid, { pctString: '90%', pctDesc: status, className: 'progress-bar progress-bar-danger' });
      }
    });
    upload.handleFileSelect();

    // we don't want the file binary to be uploaded in the main form
    // so the actual file input is neutered
    file_element.value = '';
  },
  onChange: function onChange() {
    var file_element = ReactDOM.findDOMNode(this).firstChild;
    this.performUpload(file_element, file_element && file_element.files);
  },
  onDragOver: function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    $(ReactDOM.findDOMNode(this)).addClass('attache-dragover');
  },
  onDragLeave: function onDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    $(ReactDOM.findDOMNode(this)).removeClass('attache-dragover');
  },
  onDrop: function onDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    var file_element = ReactDOM.findDOMNode(this).firstChild;
    this.performUpload(file_element, e.target.files || e.dataTransfer.files);
    $(ReactDOM.findDOMNode(this)).removeClass('attache-dragover');
  },
  setFileValue: function setFileValue(key, value) {
    this.state.files[key] = value;
    this.setState(this.state);
  },
  render: function render() {
    var that = this;
    var Header = window.AttacheHeader || _bootstrap.Bootstrap3Header;
    var FilePreview = window.AttacheFilePreview || _bootstrap.Bootstrap3FilePreview;
    var Placeholder = window.AttachePlaceholder || _bootstrap.Bootstrap3Placeholder;

    if (that.state.uploading > 0) {
      that.state.submit_buttons.attr('disabled', true);
    } else if (that.state.submit_buttons) {
      that.state.submit_buttons.attr('disabled', null);
    }

    var previews = [];
    $.each(that.state.files, function (key, result) {
      // json is input[value], drop non essential values
      var copy = JSON.parse(JSON.stringify(result));
      delete copy.src;
      delete copy.filename;
      var json = JSON.stringify(copy);
      //
      result.multiple = that.props.multiple;
      if (result.path) {
        var parts = result.path.split('/');
        result.filename = parts.pop().split(/[#?]/).shift();
        parts.push(encodeURIComponent(that.props['data-geometry'] || '128x128#'));
        parts.push(encodeURIComponent(result.filename));
        result.src = that.props['data-downloadurl'] + '/' + parts.join('/');
      }
      var previewKey = 'preview' + key;
      previews.push(React.createElement(
        'div',
        { key: previewKey, className: 'attache-file-input' },
        React.createElement('input', {
          type: 'hidden',
          name: that.props.name,
          value: json,
          readOnly: 'true' }),
        React.createElement(FilePreview, _extends({}, result, { key: key, onRemove: that.onRemove.bind(that, key) }))
      ));
    });

    var placeholders = [];
    if (previews.length === 0 && that.props['data-placeholder']) {
      $.each(JSON.parse(that.props['data-placeholder']), function (uid, src) {
        placeholders.push(React.createElement(Placeholder, _extends({ key: 'placeholder' }, that.props, { src: src })));
      });
    }

    var discards = [];
    $.each(that.state.attaches_discarded, function (index, discard) {
      var discardKey = 'discard' + discard.path;
      discards.push(React.createElement('input', {
        key: discardKey,
        type: 'hidden',
        name: discard.fieldname,
        value: discard.path }));
    });

    var className = ['attache-file-selector', 'attache-placeholders-count-' + placeholders.length, 'attache-previews-count-' + previews.length, this.props['data-classname']].join(' ').trim();
    return React.createElement(
      'label',
      {
        htmlFor: that.props.id,
        className: className,
        onDragOver: this.onDragOver,
        onDragLeave: this.onDragLeave,
        onDrop: this.onDrop },
      React.createElement('input', _extends({ type: 'file' }, that.props, { onChange: this.onChange })),
      React.createElement('input', { type: 'hidden', name: that.props.name, value: '' }),
      React.createElement(Header, that.props),
      previews,
      placeholders,
      discards
    );
  }
});

},{"./bootstrap3":2,"./cors_upload":3}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjQuMS4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUuanMiLCJzcmMvamF2YXNjcmlwdHMvYXR0YWNoZS9ib290c3RyYXAzLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUvY29yc191cGxvYWQuanMiLCJzcmMvamF2YXNjcmlwdHMvYXR0YWNoZS9maWxlX2lucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ01BLElBQUksZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLEdBQWU7QUFDakMsTUFBSSxTQUFTLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQTtBQUMxRCxNQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUMzRCxNQUFJLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQTtBQUMzQixPQUFLLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsT0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNaLFNBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQTtBQUNoQyxRQUFJLEtBQUssRUFBRTtBQUNULFdBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQzFCLE1BQU07QUFDTCxXQUFLLEdBQUcsRUFBRSxDQUFBO0FBQ1YsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlDLFlBQUks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USxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDMUwsV0FDQTs7O0FBQ0UsZUFBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxBQUFDO0FBQ3ZCLGlCQUFTLEVBQUUsU0FBUyxBQUFDO0FBQ3JCLGtCQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQztBQUM1QixtQkFBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEFBQUM7QUFDOUIsY0FBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEFBQUM7TUFDcEIsd0NBQU8sSUFBSSxFQUFDLE1BQU0sSUFBSyxJQUFJLENBQUMsS0FBSyxJQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxBQUFDLElBQUc7TUFDOUQsK0JBQU8sSUFBSSxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQUMsRUFBQyxLQUFLLEVBQUMsRUFBRSxHQUFHO01BQ3ZELG9CQUFDLE1BQU0sRUFBSyxJQUFJLENBQUMsS0FBSyxDQUFJO01BQ3pCLFFBQVE7TUFDUixZQUFZO01BQ1osUUFBUTtLQUNILENBQ1A7R0FDRjtDQUNGLENBQUMsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKmdsb2JhbCAkKi9cbi8qZ2xvYmFsIFJlYWN0Ki9cbi8qZ2xvYmFsIFJlYWN0RE9NKi9cblxuaW1wb3J0IHsgQXR0YWNoZUZpbGVJbnB1dCB9IGZyb20gJy4vYXR0YWNoZS9maWxlX2lucHV0J1xuXG52YXIgdXBncmFkZUZpbGVJbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNhZmVXb3JkcyA9IHsgJ2NsYXNzJzogJ2NsYXNzTmFtZScsICdmb3InOiAnaHRtbEZvcicgfVxuICB2YXIgc2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZW5hYmxlLWF0dGFjaGUnKVxuICB2YXIgZWxlLCBhdHRycywgbmFtZSwgdmFsdWVcbiAgZm9yICh2YXIgaSA9IHNlbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGVsZSA9IHNlbFtpXVxuICAgIGF0dHJzID0gZWxlLmRhdGFzZXQuYXR0YWNoZVByb3BzXG4gICAgaWYgKGF0dHJzKSB7XG4gICAgICBhdHRycyA9IEpTT04ucGFyc2UoYXR0cnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGF0dHJzID0ge31cbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZWxlLmF0dHJpYnV0ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgbmFtZSA9IGVsZS5hdHRyaWJ1dGVzW2pdLm5hbWVcbiAgICAgICAgdmFsdWUgPSBlbGUuYXR0cmlidXRlc1tqXS52YWx1ZVxuICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCdlbmFibGUtYXR0YWNoZScsICdhdHRhY2hlLWVuYWJsZWQnKVxuICAgICAgICBuYW1lID0gc2FmZVdvcmRzW25hbWVdIHx8IG5hbWVcbiAgICAgICAgYXR0cnNbbmFtZV0gPSB2YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgd3JhcC5jbGFzc05hbWUgPSAnZW5hYmxlLWF0dGFjaGUnXG4gICAgd3JhcC5kYXRhc2V0LmF0dGFjaGVQcm9wcyA9IEpTT04uc3RyaW5naWZ5KGF0dHJzKVxuICAgIGVsZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh3cmFwLCBlbGUpXG4gICAgUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXR0YWNoZUZpbGVJbnB1dCwgUmVhY3QuX19zcHJlYWQoe30sIGF0dHJzKSksIHdyYXApXG4gIH1cbn1cblxuJChkb2N1bWVudCkub24oJ3BhZ2U6Y2hhbmdlIHR1cmJvbGlua3M6bG9hZCcsIHVwZ3JhZGVGaWxlSW5wdXQpXG4kKHVwZ3JhZGVGaWxlSW5wdXQpXG4iLCIvKmdsb2JhbCAkKi9cbi8qZ2xvYmFsIFJlYWN0Ki9cblxuZXhwb3J0IHZhciBCb290c3RyYXAzRmlsZVByZXZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHsgc3JjV2FzOiAnJyB9XG4gIH0sXG5cbiAgb25TcmNMb2FkZWQgKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNyY1dhczogdGhpcy5wcm9wcy5zcmMgfSlcbiAgICAkKGV2ZW50LnRhcmdldCkudHJpZ2dlcignYXR0YWNoZTppbWdsb2FkJylcbiAgfSxcblxuICBvblNyY0Vycm9yIChldmVudCkge1xuICAgICQoZXZlbnQudGFyZ2V0KS50cmlnZ2VyKCdhdHRhY2hlOmltZ2Vycm9yJylcbiAgfSxcblxuICByZW5kZXIgKCkge1xuICAgIHZhciBwcmV2aWV3Q2xhc3NOYW1lID0gJ2F0dGFjaGUtZmlsZS1wcmV2aWV3J1xuXG4gICAgLy8gcHJvZ3Jlc3NiYXJcbiAgICBpZiAodGhpcy5zdGF0ZS5zcmNXYXMgIT09IHRoaXMucHJvcHMuc3JjKSB7XG4gICAgICBwcmV2aWV3Q2xhc3NOYW1lID0gcHJldmlld0NsYXNzTmFtZSArICcgYXR0YWNoZS1sb2FkaW5nJ1xuICAgICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMucHJvcHMuY2xhc3NOYW1lIHx8ICdwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgYWN0aXZlJyArICh0aGlzLnByb3BzLnNyYyA/ICcgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3MnIDogJycpXG4gICAgICB2YXIgcGN0U3RyaW5nID0gdGhpcy5wcm9wcy5wY3RTdHJpbmcgfHwgKHRoaXMucHJvcHMuc3JjID8gMTAwIDogdGhpcy5wcm9wcy5wZXJjZW50TG9hZGVkKSArICclJ1xuICAgICAgdmFyIHBjdERlc2MgPSB0aGlzLnByb3BzLnBjdERlc2MgfHwgKHRoaXMucHJvcHMuc3JjID8gJ0xvYWRpbmcuLi4nIDogcGN0U3RyaW5nKVxuICAgICAgdmFyIHBjdFN0eWxlID0geyB3aWR0aDogcGN0U3RyaW5nLCBtaW5XaWR0aDogJzNlbScgfVxuICAgICAgdmFyIHByb2dyZXNzID0gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgICAgcm9sZT1cInByb2dyZXNzYmFyXCJcbiAgICAgICAgICBhcmlhLXZhbHVlbm93PXt0aGlzLnByb3BzLnBlcmNlbnRMb2FkZWR9XG4gICAgICAgICAgYXJpYS12YWx1ZW1pbj1cIjBcIlxuICAgICAgICAgIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxuICAgICAgICAgIHN0eWxlPXtwY3RTdHlsZX0+XG4gICAgICAgICAge3BjdERlc2N9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgLy8gaW1nIHRhZ1xuICAgIGlmICh0aGlzLnByb3BzLnNyYykge1xuICAgICAgdmFyIGltZyA9IDxpbWcgc3JjPXt0aGlzLnByb3BzLnNyY30gb25Mb2FkPXt0aGlzLm9uU3JjTG9hZGVkfSBvbkVycm9yPXt0aGlzLm9uU3JjRXJyb3J9IC8+XG4gICAgfVxuXG4gICAgLy8gY29tYmluZWRcbiAgICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtwcmV2aWV3Q2xhc3NOYW1lfT5cbiAgICAgIHtwcm9ncmVzc31cbiAgICAgIHtpbWd9XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsZWFyZml4XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVsbC1sZWZ0XCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuZmlsZW5hbWV9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YVxuICAgICAgICAgIGhyZWY9XCIjcmVtb3ZlXCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJwdWxsLXJpZ2h0XCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLm9uUmVtb3ZlfVxuICAgICAgICAgIHRpdGxlPVwiQ2xpY2sgdG8gcmVtb3ZlXCI+JnRpbWVzOzwvYT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIClcbiAgfVxufSlcblxuZXhwb3J0IHZhciBCb290c3RyYXAzUGxhY2Vob2xkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImF0dGFjaGUtZmlsZS1wcmV2aWV3XCI+XG4gICAgICA8aW1nIHNyYz17dGhpcy5wcm9wcy5zcmN9IC8+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9XG59KVxuXG5leHBvcnQgdmFyIEJvb3RzdHJhcDNIZWFkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICA8bm9zY3JpcHQgLz5cbiAgICApXG4gIH1cbn0pXG4iLCIvKmdsb2JhbCAkKi9cbi8qZ2xvYmFsIGFsZXJ0Ki9cbi8qZ2xvYmFsIFhNTEh0dHBSZXF1ZXN0Ki9cbi8qZ2xvYmFsIFhEb21haW5SZXF1ZXN0Ki9cblxudmFyIGNvdW50ZXIgPSAwXG5cbmV4cG9ydCBjbGFzcyBDT1JTVXBsb2FkIHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSBvcHRpb25zID0ge31cbiAgICB2YXIgb3B0aW9uXG4gICAgZm9yIChvcHRpb24gaW4gb3B0aW9ucykge1xuICAgICAgdGhpc1tvcHRpb25dID0gb3B0aW9uc1tvcHRpb25dXG4gICAgfVxuICB9XG5cbiAgLy8gZm9yIG92ZXJ3cml0aW5nXG4gIGNyZWF0ZUxvY2FsVGh1bWJuYWlsICgpIHsgfVxuICBvbkNvbXBsZXRlICh1aWQsIGpzb24pIHsgfVxuICBvblByb2dyZXNzICh1aWQsIGpzb24pIHsgfVxuICBvbkVycm9yICh1aWQsIHN0YXR1cykgeyBhbGVydChzdGF0dXMpIH1cblxuICBoYW5kbGVGaWxlU2VsZWN0ICgpIHtcbiAgICB2YXIgZiwgX2ksIF9sZW4sIF9yZXN1bHRzLCB1cmwsICRlbGUsIHByZWZpeFxuICAgICRlbGUgPSAkKHRoaXMuZmlsZV9lbGVtZW50KVxuICAgIHVybCA9ICRlbGUuZGF0YSgndXBsb2FkdXJsJylcbiAgICBpZiAoJGVsZS5kYXRhKCdobWFjJykpIHtcbiAgICAgIHVybCA9IHVybCArXG4gICAgICAgICc/aG1hYz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCRlbGUuZGF0YSgnaG1hYycpKSArXG4gICAgICAgICcmdXVpZD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCRlbGUuZGF0YSgndXVpZCcpKSArXG4gICAgICAgICcmZXhwaXJhdGlvbj0nICsgZW5jb2RlVVJJQ29tcG9uZW50KCRlbGUuZGF0YSgnZXhwaXJhdGlvbicpKSArXG4gICAgICAgICcnXG4gICAgfVxuXG4gICAgcHJlZml4ID0gRGF0ZS5ub3coKSArICdfJ1xuICAgIF9yZXN1bHRzID0gW11cbiAgICBmb3IgKF9pID0gMCwgX2xlbiA9IHRoaXMuZmlsZXMubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIGYgPSB0aGlzLmZpbGVzW19pXVxuICAgICAgdGhpcy5jcmVhdGVMb2NhbFRodW1ibmFpbChmKSAvLyBpZiBhbnlcbiAgICAgIGYudWlkID0gcHJlZml4ICsgKGNvdW50ZXIrKylcbiAgICAgIHRoaXMub25Qcm9ncmVzcyhmLnVpZCwgeyBzcmM6IGYuc3JjLCBmaWxlbmFtZTogZi5uYW1lLCBwZXJjZW50TG9hZGVkOiAwLCBieXRlc0xvYWRlZDogMCwgYnl0ZXNUb3RhbDogZi5zaXplIH0pXG4gICAgICBfcmVzdWx0cy5wdXNoKHRoaXMucGVyZm9ybVVwbG9hZChmLCB1cmwpKVxuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHNcbiAgfVxuXG4gIGNyZWF0ZUNPUlNSZXF1ZXN0IChtZXRob2QsIHVybCkge1xuICAgIHZhciB4aHJcbiAgICB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIGlmICh4aHIud2l0aENyZWRlbnRpYWxzICE9IG51bGwpIHtcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIFhEb21haW5SZXF1ZXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgeGhyID0gbmV3IFhEb21haW5SZXF1ZXN0KClcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsKVxuICAgIH0gZWxzZSB7XG4gICAgICB4aHIgPSBudWxsXG4gICAgfVxuICAgIHJldHVybiB4aHJcbiAgfVxuXG4gIHBlcmZvcm1VcGxvYWQgKGZpbGUsIHVybCkge1xuICAgIHZhciB0aGlzX3MzdXBsb2FkLCB4aHJcbiAgICB0aGlzX3MzdXBsb2FkID0gdGhpc1xuICAgIHVybCA9IHVybCArICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyAnZmlsZT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGZpbGUubmFtZSlcbiAgICB4aHIgPSB0aGlzLmNyZWF0ZUNPUlNSZXF1ZXN0KCdQVVQnLCB1cmwpXG4gICAgaWYgKCF4aHIpIHtcbiAgICAgIHRoaXMub25FcnJvcihmaWxlLnVpZCwgJ0NPUlMgbm90IHN1cHBvcnRlZCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgdGhpc19zM3VwbG9hZC5vbkNvbXBsZXRlKGZpbGUudWlkLCBKU09OLnBhcnNlKGUudGFyZ2V0LnJlc3BvbnNlVGV4dCkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXNfczN1cGxvYWQub25FcnJvcihmaWxlLnVpZCwgeGhyLnN0YXR1cyArICcgJyArIHhoci5zdGF0dXNUZXh0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNfczN1cGxvYWQub25FcnJvcihmaWxlLnVpZCwgJ1VuYWJsZSB0byByZWFjaCBzZXJ2ZXInKVxuICAgICAgfVxuICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHBlcmNlbnRMb2FkZWRcbiAgICAgICAgaWYgKGUubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgIHBlcmNlbnRMb2FkZWQgPSBNYXRoLnJvdW5kKChlLmxvYWRlZCAvIGUudG90YWwpICogMTAwKVxuICAgICAgICAgIHJldHVybiB0aGlzX3MzdXBsb2FkLm9uUHJvZ3Jlc3MoZmlsZS51aWQsIHsgc3JjOiBmaWxlLnNyYywgZmlsZW5hbWU6IGZpbGUubmFtZSwgcGVyY2VudExvYWRlZDogcGVyY2VudExvYWRlZCwgYnl0ZXNMb2FkZWQ6IGUubG9hZGVkLCBieXRlc1RvdGFsOiBlLnRvdGFsIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHhoci5zZW5kKGZpbGUpXG4gIH1cbn1cbiIsIi8qZ2xvYmFsICQqL1xuLypnbG9iYWwgd2luZG93Ki9cbi8qZ2xvYmFsIFJlYWN0Ki9cbi8qZ2xvYmFsIFJlYWN0RE9NKi9cblxuaW1wb3J0IHsgQ09SU1VwbG9hZCB9IGZyb20gJy4vY29yc191cGxvYWQnXG5pbXBvcnQgeyBCb290c3RyYXAzSGVhZGVyLCBCb290c3RyYXAzRmlsZVByZXZpZXcsIEJvb3RzdHJhcDNQbGFjZWhvbGRlciB9IGZyb20gJy4vYm9vdHN0cmFwMydcblxuZXhwb3J0IHZhciBBdHRhY2hlRmlsZUlucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGUgKCkge1xuICAgIHZhciBmaWxlcyA9IHt9XG4gICAgaWYgKHRoaXMucHJvcHNbJ2RhdGEtdmFsdWUnXSkge1xuICAgICAgJC5lYWNoKEpTT04ucGFyc2UodGhpcy5wcm9wc1snZGF0YS12YWx1ZSddKSwgZnVuY3Rpb24gKHVpZCwganNvbikge1xuICAgICAgICBpZiAoanNvbikgZmlsZXNbdWlkXSA9IGpzb25cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB7IGZpbGVzOiBmaWxlcywgYXR0YWNoZXNfZGlzY2FyZGVkOiBbXSwgdXBsb2FkaW5nOiAwIH1cbiAgfSxcblxuICBvblJlbW92ZSAodWlkLCBlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgdmFyIGZpZWxkbmFtZSA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpLmZpcnN0Q2hpbGQubmFtZSAvLyB3aGVuICAgJ3VzZXJbYXZhdGFyXSdcbiAgICB2YXIgbmV3ZmllbGQgPSBmaWVsZG5hbWUucmVwbGFjZSgvXFx3K1xcXShcXFtcXF18KSQvLCAnYXR0YWNoZXNfZGlzY2FyZGVkXVtdJykgLy8gYmVjb21lICd1c2VyW2F0dGFjaGVzX2Rpc2NhcmRlZF1bXSdcblxuICAgIHRoaXMuc3RhdGUuYXR0YWNoZXNfZGlzY2FyZGVkLnB1c2goeyBmaWVsZG5hbWU6IG5ld2ZpZWxkLCBwYXRoOiB0aGlzLnN0YXRlLmZpbGVzW3VpZF0ucGF0aCB9KVxuICAgIGRlbGV0ZSB0aGlzLnN0YXRlLmZpbGVzW3VpZF1cblxuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZSlcbiAgfSxcblxuICBwZXJmb3JtVXBsb2FkIChmaWxlX2VsZW1lbnQsIGZpbGVzKSB7XG4gICAgLy8gdXNlciBjYW5jZWxsZWQgZmlsZSBjaG9vc2VyIGRpYWxvZy4gaWdub3JlXG4gICAgaWYgKCFmaWxlcyB8fCBmaWxlcy5sZW5ndGggPT09IDApIHJldHVyblxuICAgIGlmICghdGhpcy5wcm9wcy5tdWx0aXBsZSkge1xuICAgICAgdGhpcy5zdGF0ZS5maWxlcyA9IHt9XG4gICAgICBmaWxlcyA9IFtmaWxlc1swXV0gLy8gYXJyYXkgb2YgMSBlbGVtZW50XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlKVxuICAgIC8vIHVwbG9hZCB0aGUgZmlsZSB2aWEgQ09SU1xuICAgIHZhciB0aGF0ID0gdGhpc1xuXG4gICAgdGhhdC5zdGF0ZS51cGxvYWRpbmcgPSB0aGF0LnN0YXRlLnVwbG9hZGluZyArIGZpbGVzLmxlbmd0aFxuICAgIGlmICghdGhhdC5zdGF0ZS5zdWJtaXRfYnV0dG9ucykgdGhhdC5zdGF0ZS5zdWJtaXRfYnV0dG9ucyA9ICQoXCJidXR0b24saW5wdXRbdHlwZT0nc3VibWl0J11cIiwgJChmaWxlX2VsZW1lbnQpLnBhcmVudHMoJ2Zvcm0nKVswXSkuZmlsdGVyKCc6bm90KDpkaXNhYmxlZCknKVxuXG4gICAgdmFyIHVwbG9hZCA9IG5ldyBDT1JTVXBsb2FkKHtcbiAgICAgIGZpbGVfZWxlbWVudDogZmlsZV9lbGVtZW50LFxuICAgICAgZmlsZXM6IGZpbGVzLFxuICAgICAgb25Qcm9ncmVzczogdGhpcy5zZXRGaWxlVmFsdWUsXG4gICAgICBvbkNvbXBsZXRlICgpIHtcbiAgICAgICAgdGhhdC5zdGF0ZS51cGxvYWRpbmctLVxuICAgICAgICB0aGF0LnNldEZpbGVWYWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9LFxuICAgICAgb25FcnJvciAodWlkLCBzdGF0dXMpIHtcbiAgICAgICAgdGhhdC5zdGF0ZS51cGxvYWRpbmctLVxuICAgICAgICB0aGF0LnNldEZpbGVWYWx1ZSh1aWQsIHsgcGN0U3RyaW5nOiAnOTAlJywgcGN0RGVzYzogc3RhdHVzLCBjbGFzc05hbWU6ICdwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLWRhbmdlcicgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHVwbG9hZC5oYW5kbGVGaWxlU2VsZWN0KClcblxuICAgIC8vIHdlIGRvbid0IHdhbnQgdGhlIGZpbGUgYmluYXJ5IHRvIGJlIHVwbG9hZGVkIGluIHRoZSBtYWluIGZvcm1cbiAgICAvLyBzbyB0aGUgYWN0dWFsIGZpbGUgaW5wdXQgaXMgbmV1dGVyZWRcbiAgICBmaWxlX2VsZW1lbnQudmFsdWUgPSAnJ1xuICB9LFxuXG4gIG9uQ2hhbmdlICgpIHtcbiAgICB2YXIgZmlsZV9lbGVtZW50ID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcykuZmlyc3RDaGlsZFxuICAgIHRoaXMucGVyZm9ybVVwbG9hZChmaWxlX2VsZW1lbnQsIGZpbGVfZWxlbWVudCAmJiBmaWxlX2VsZW1lbnQuZmlsZXMpXG4gIH0sXG5cbiAgb25EcmFnT3ZlciAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5hZGRDbGFzcygnYXR0YWNoZS1kcmFnb3ZlcicpXG4gIH0sXG5cbiAgb25EcmFnTGVhdmUgKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkucmVtb3ZlQ2xhc3MoJ2F0dGFjaGUtZHJhZ292ZXInKVxuICB9LFxuXG4gIG9uRHJvcCAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB2YXIgZmlsZV9lbGVtZW50ID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcykuZmlyc3RDaGlsZFxuICAgIHRoaXMucGVyZm9ybVVwbG9hZChmaWxlX2VsZW1lbnQsIGUudGFyZ2V0LmZpbGVzIHx8IGUuZGF0YVRyYW5zZmVyLmZpbGVzKVxuICAgICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLnJlbW92ZUNsYXNzKCdhdHRhY2hlLWRyYWdvdmVyJylcbiAgfSxcblxuICBzZXRGaWxlVmFsdWUgKGtleSwgdmFsdWUpIHtcbiAgICB0aGlzLnN0YXRlLmZpbGVzW2tleV0gPSB2YWx1ZVxuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZSlcbiAgfSxcblxuICByZW5kZXIgKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBIZWFkZXIgPSB3aW5kb3cuQXR0YWNoZUhlYWRlciB8fCBCb290c3RyYXAzSGVhZGVyXG4gICAgdmFyIEZpbGVQcmV2aWV3ID0gd2luZG93LkF0dGFjaGVGaWxlUHJldmlldyB8fCBCb290c3RyYXAzRmlsZVByZXZpZXdcbiAgICB2YXIgUGxhY2Vob2xkZXIgPSB3aW5kb3cuQXR0YWNoZVBsYWNlaG9sZGVyIHx8IEJvb3RzdHJhcDNQbGFjZWhvbGRlclxuXG4gICAgaWYgKHRoYXQuc3RhdGUudXBsb2FkaW5nID4gMCkge1xuICAgICAgdGhhdC5zdGF0ZS5zdWJtaXRfYnV0dG9ucy5hdHRyKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgfSBlbHNlIGlmICh0aGF0LnN0YXRlLnN1Ym1pdF9idXR0b25zKSB7XG4gICAgICB0aGF0LnN0YXRlLnN1Ym1pdF9idXR0b25zLmF0dHIoJ2Rpc2FibGVkJywgbnVsbClcbiAgICB9XG5cbiAgICB2YXIgcHJldmlld3MgPSBbXVxuICAgICQuZWFjaCh0aGF0LnN0YXRlLmZpbGVzLCBmdW5jdGlvbiAoa2V5LCByZXN1bHQpIHtcbiAgICAgIC8vIGpzb24gaXMgaW5wdXRbdmFsdWVdLCBkcm9wIG5vbiBlc3NlbnRpYWwgdmFsdWVzXG4gICAgICB2YXIgY29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzdWx0KSlcbiAgICAgIGRlbGV0ZSBjb3B5LnNyY1xuICAgICAgZGVsZXRlIGNvcHkuZmlsZW5hbWVcbiAgICAgIHZhciBqc29uID0gSlNPTi5zdHJpbmdpZnkoY29weSlcbiAgICAgIC8vXG4gICAgICByZXN1bHQubXVsdGlwbGUgPSB0aGF0LnByb3BzLm11bHRpcGxlXG4gICAgICBpZiAocmVzdWx0LnBhdGgpIHtcbiAgICAgICAgdmFyIHBhcnRzID0gcmVzdWx0LnBhdGguc3BsaXQoJy8nKVxuICAgICAgICByZXN1bHQuZmlsZW5hbWUgPSBwYXJ0cy5wb3AoKS5zcGxpdCgvWyM/XS8pLnNoaWZ0KClcbiAgICAgICAgcGFydHMucHVzaChlbmNvZGVVUklDb21wb25lbnQodGhhdC5wcm9wc1snZGF0YS1nZW9tZXRyeSddIHx8ICcxMjh4MTI4IycpKVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChyZXN1bHQuZmlsZW5hbWUpKVxuICAgICAgICByZXN1bHQuc3JjID0gdGhhdC5wcm9wc1snZGF0YS1kb3dubG9hZHVybCddICsgJy8nICsgcGFydHMuam9pbignLycpXG4gICAgICB9XG4gICAgICB2YXIgcHJldmlld0tleSA9ICdwcmV2aWV3JyArIGtleVxuICAgICAgcHJldmlld3MucHVzaChcbiAgICAgICAgPGRpdiBrZXk9e3ByZXZpZXdLZXl9IGNsYXNzTmFtZT1cImF0dGFjaGUtZmlsZS1pbnB1dFwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cImhpZGRlblwiXG4gICAgICAgICAgICBuYW1lPXt0aGF0LnByb3BzLm5hbWV9XG4gICAgICAgICAgICB2YWx1ZT17anNvbn1cbiAgICAgICAgICAgIHJlYWRPbmx5PVwidHJ1ZVwiIC8+XG4gICAgICAgICAgPEZpbGVQcmV2aWV3IHsuLi5yZXN1bHR9IGtleT17a2V5fSBvblJlbW92ZT17dGhhdC5vblJlbW92ZS5iaW5kKHRoYXQsIGtleSl9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0pXG5cbiAgICB2YXIgcGxhY2Vob2xkZXJzID0gW11cbiAgICBpZiAocHJldmlld3MubGVuZ3RoID09PSAwICYmIHRoYXQucHJvcHNbJ2RhdGEtcGxhY2Vob2xkZXInXSkge1xuICAgICAgJC5lYWNoKEpTT04ucGFyc2UodGhhdC5wcm9wc1snZGF0YS1wbGFjZWhvbGRlciddKSwgZnVuY3Rpb24gKHVpZCwgc3JjKSB7XG4gICAgICAgIHBsYWNlaG9sZGVycy5wdXNoKFxuICAgICAgICAgIDxQbGFjZWhvbGRlciBrZXk9XCJwbGFjZWhvbGRlclwiIHsuLi50aGF0LnByb3BzfSBzcmM9e3NyY30gLz5cbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB2YXIgZGlzY2FyZHMgPSBbXVxuICAgICQuZWFjaCh0aGF0LnN0YXRlLmF0dGFjaGVzX2Rpc2NhcmRlZCwgZnVuY3Rpb24gKGluZGV4LCBkaXNjYXJkKSB7XG4gICAgICB2YXIgZGlzY2FyZEtleSA9ICdkaXNjYXJkJyArIGRpc2NhcmQucGF0aFxuICAgICAgZGlzY2FyZHMucHVzaChcbiAgICAgICAgPGlucHV0XG4gICAgICAgICAga2V5PXtkaXNjYXJkS2V5fVxuICAgICAgICAgIHR5cGU9XCJoaWRkZW5cIlxuICAgICAgICAgIG5hbWU9e2Rpc2NhcmQuZmllbGRuYW1lfVxuICAgICAgICAgIHZhbHVlPXtkaXNjYXJkLnBhdGh9IC8+XG4gICAgICApXG4gICAgfSlcblxuICAgIHZhciBjbGFzc05hbWUgPSBbJ2F0dGFjaGUtZmlsZS1zZWxlY3RvcicsICdhdHRhY2hlLXBsYWNlaG9sZGVycy1jb3VudC0nICsgcGxhY2Vob2xkZXJzLmxlbmd0aCwgJ2F0dGFjaGUtcHJldmlld3MtY291bnQtJyArIHByZXZpZXdzLmxlbmd0aCwgdGhpcy5wcm9wc1snZGF0YS1jbGFzc25hbWUnXV0uam9pbignICcpLnRyaW0oKVxuICAgIHJldHVybiAoXG4gICAgPGxhYmVsXG4gICAgICBodG1sRm9yPXt0aGF0LnByb3BzLmlkfVxuICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICBvbkRyYWdPdmVyPXt0aGlzLm9uRHJhZ092ZXJ9XG4gICAgICBvbkRyYWdMZWF2ZT17dGhpcy5vbkRyYWdMZWF2ZX1cbiAgICAgIG9uRHJvcD17dGhpcy5vbkRyb3B9PlxuICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgey4uLnRoYXQucHJvcHN9IG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfSAvPlxuICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPXt0aGF0LnByb3BzLm5hbWV9IHZhbHVlPVwiXCIgLz5cbiAgICAgIDxIZWFkZXIgey4uLnRoYXQucHJvcHN9IC8+XG4gICAgICB7cHJldmlld3N9XG4gICAgICB7cGxhY2Vob2xkZXJzfVxuICAgICAge2Rpc2NhcmRzfVxuICAgIDwvbGFiZWw+XG4gICAgKVxuICB9XG59KVxuIl19
