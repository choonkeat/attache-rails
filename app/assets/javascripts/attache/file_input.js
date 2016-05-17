(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.attache_file_input = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./bootstrap3":1,"./cors_upload":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjQuMS4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUvYm9vdHN0cmFwMy5qcyIsInNyYy9qYXZhc2NyaXB0cy9hdHRhY2hlL2NvcnNfdXBsb2FkLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUvZmlsZV9pbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDR08sSUFBSSxxQkFBcUIsV0FBckIscUJBQXFCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7QUFDbkQsaUJBQWUsNkJBQUk7QUFDakIsV0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQTtHQUN0QjtBQUVELGFBQVcsdUJBQUUsS0FBSyxFQUFFO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBQ3pDLEtBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7R0FDM0M7QUFFRCxZQUFVLHNCQUFFLEtBQUssRUFBRTtBQUNqQixLQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0dBQzVDO0FBRUQsUUFBTSxvQkFBSTtBQUNSLFFBQUksZ0JBQWdCLEdBQUcsc0JBQXNCOzs7QUFBQSxBQUc3QyxRQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ3hDLHNCQUFnQixHQUFHLGdCQUFnQixHQUFHLGtCQUFrQixDQUFBO0FBQ3hELFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLDBDQUEwQyxJQUFJLElB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TUFDekIsUUFBUTtNQUNSLFlBQVk7TUFDWixRQUFRO0tBQ0gsQ0FDUDtHQUNGO0NBQ0YsQ0FBQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qZ2xvYmFsICQqL1xuLypnbG9iYWwgUmVhY3QqL1xuXG5leHBvcnQgdmFyIEJvb3RzdHJhcDNGaWxlUHJldmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlICgpIHtcbiAgICByZXR1cm4geyBzcmNXYXM6ICcnIH1cbiAgfSxcblxuICBvblNyY0xvYWRlZCAoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc3JjV2FzOiB0aGlzLnByb3BzLnNyYyB9KVxuICAgICQoZXZlbnQudGFyZ2V0KS50cmlnZ2VyKCdhdHRhY2hlOmltZ2xvYWQnKVxuICB9LFxuXG4gIG9uU3JjRXJyb3IgKGV2ZW50KSB7XG4gICAgJChldmVudC50YXJnZXQpLnRyaWdnZXIoJ2F0dGFjaGU6aW1nZXJyb3InKVxuICB9LFxuXG4gIHJlbmRlciAoKSB7XG4gICAgdmFyIHByZXZpZXdDbGFzc05hbWUgPSAnYXR0YWNoZS1maWxlLXByZXZpZXcnXG5cbiAgICAvLyBwcm9ncmVzc2JhclxuICAgIGlmICh0aGlzLnN0YXRlLnNyY1dhcyAhPT0gdGhpcy5wcm9wcy5zcmMpIHtcbiAgICAgIHByZXZpZXdDbGFzc05hbWUgPSBwcmV2aWV3Q2xhc3NOYW1lICsgJyBhdHRhY2hlLWxvYWRpbmcnXG4gICAgICB2YXIgY2xhc3NOYW1lID0gdGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgJ3Byb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBhY3RpdmUnICsgKHRoaXMucHJvcHMuc3JjID8gJyBwcm9ncmVzcy1iYXItc3VjY2VzcycgOiAnJylcbiAgICAgIHZhciBwY3RTdHJpbmcgPSB0aGlzLnByb3BzLnBjdFN0cmluZyB8fCAodGhpcy5wcm9wcy5zcmMgPyAxMDAgOiB0aGlzLnByb3BzLnBlcmNlbnRMb2FkZWQpICsgJyUnXG4gICAgICB2YXIgcGN0RGVzYyA9IHRoaXMucHJvcHMucGN0RGVzYyB8fCAodGhpcy5wcm9wcy5zcmMgPyAnTG9hZGluZy4uLicgOiBwY3RTdHJpbmcpXG4gICAgICB2YXIgcGN0U3R5bGUgPSB7IHdpZHRoOiBwY3RTdHJpbmcsIG1pbldpZHRoOiAnM2VtJyB9XG4gICAgICB2YXIgcHJvZ3Jlc3MgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgICByb2xlPVwicHJvZ3Jlc3NiYXJcIlxuICAgICAgICAgIGFyaWEtdmFsdWVub3c9e3RoaXMucHJvcHMucGVyY2VudExvYWRlZH1cbiAgICAgICAgICBhcmlhLXZhbHVlbWluPVwiMFwiXG4gICAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgc3R5bGU9e3BjdFN0eWxlfT5cbiAgICAgICAgICB7cGN0RGVzY31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICAvLyBpbWcgdGFnXG4gICAgaWYgKHRoaXMucHJvcHMuc3JjKSB7XG4gICAgICB2YXIgaW1nID0gPGltZyBzcmM9e3RoaXMucHJvcHMuc3JjfSBvbkxvYWQ9e3RoaXMub25TcmNMb2FkZWR9IG9uRXJyb3I9e3RoaXMub25TcmNFcnJvcn0gLz5cbiAgICB9XG5cbiAgICAvLyBjb21iaW5lZFxuICAgIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e3ByZXZpZXdDbGFzc05hbWV9PlxuICAgICAge3Byb2dyZXNzfVxuICAgICAge2ltZ31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJmaXhcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLWxlZnRcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5maWxlbmFtZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxhXG4gICAgICAgICAgaHJlZj1cIiNyZW1vdmVcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25SZW1vdmV9XG4gICAgICAgICAgdGl0bGU9XCJDbGljayB0byByZW1vdmVcIj4mdGltZXM7PC9hPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9XG59KVxuXG5leHBvcnQgdmFyIEJvb3RzdHJhcDNQbGFjZWhvbGRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXR0YWNoZS1maWxlLXByZXZpZXdcIj5cbiAgICAgIDxpbWcgc3JjPXt0aGlzLnByb3BzLnNyY30gLz5cbiAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbmV4cG9ydCB2YXIgQm9vdHN0cmFwM0hlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgIDxub3NjcmlwdCAvPlxuICAgIClcbiAgfVxufSlcbiIsIi8qZ2xvYmFsICQqL1xuLypnbG9iYWwgYWxlcnQqL1xuLypnbG9iYWwgWE1MSHR0cFJlcXVlc3QqL1xuLypnbG9iYWwgWERvbWFpblJlcXVlc3QqL1xuXG52YXIgY291bnRlciA9IDBcblxuZXhwb3J0IGNsYXNzIENPUlNVcGxvYWQge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIG9wdGlvbnMgPSB7fVxuICAgIHZhciBvcHRpb25cbiAgICBmb3IgKG9wdGlvbiBpbiBvcHRpb25zKSB7XG4gICAgICB0aGlzW29wdGlvbl0gPSBvcHRpb25zW29wdGlvbl1cbiAgICB9XG4gIH1cblxuICAvLyBmb3Igb3ZlcndyaXRpbmdcbiAgY3JlYXRlTG9jYWxUaHVtYm5haWwgKCkgeyB9XG4gIG9uQ29tcGxldGUgKHVpZCwganNvbikgeyB9XG4gIG9uUHJvZ3Jlc3MgKHVpZCwganNvbikgeyB9XG4gIG9uRXJyb3IgKHVpZCwgc3RhdHVzKSB7IGFsZXJ0KHN0YXR1cykgfVxuXG4gIGhhbmRsZUZpbGVTZWxlY3QgKCkge1xuICAgIHZhciBmLCBfaSwgX2xlbiwgX3Jlc3VsdHMsIHVybCwgJGVsZSwgcHJlZml4XG4gICAgJGVsZSA9ICQodGhpcy5maWxlX2VsZW1lbnQpXG4gICAgdXJsID0gJGVsZS5kYXRhKCd1cGxvYWR1cmwnKVxuICAgIGlmICgkZWxlLmRhdGEoJ2htYWMnKSkge1xuICAgICAgdXJsID0gdXJsICtcbiAgICAgICAgJz9obWFjPScgKyBlbmNvZGVVUklDb21wb25lbnQoJGVsZS5kYXRhKCdobWFjJykpICtcbiAgICAgICAgJyZ1dWlkPScgKyBlbmNvZGVVUklDb21wb25lbnQoJGVsZS5kYXRhKCd1dWlkJykpICtcbiAgICAgICAgJyZleHBpcmF0aW9uPScgKyBlbmNvZGVVUklDb21wb25lbnQoJGVsZS5kYXRhKCdleHBpcmF0aW9uJykpICtcbiAgICAgICAgJydcbiAgICB9XG5cbiAgICBwcmVmaXggPSBEYXRlLm5vdygpICsgJ18nXG4gICAgX3Jlc3VsdHMgPSBbXVxuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gdGhpcy5maWxlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgZiA9IHRoaXMuZmlsZXNbX2ldXG4gICAgICB0aGlzLmNyZWF0ZUxvY2FsVGh1bWJuYWlsKGYpIC8vIGlmIGFueVxuICAgICAgZi51aWQgPSBwcmVmaXggKyAoY291bnRlcisrKVxuICAgICAgdGhpcy5vblByb2dyZXNzKGYudWlkLCB7IHNyYzogZi5zcmMsIGZpbGVuYW1lOiBmLm5hbWUsIHBlcmNlbnRMb2FkZWQ6IDAsIGJ5dGVzTG9hZGVkOiAwLCBieXRlc1RvdGFsOiBmLnNpemUgfSlcbiAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5wZXJmb3JtVXBsb2FkKGYsIHVybCkpXG4gICAgfVxuICAgIHJldHVybiBfcmVzdWx0c1xuICB9XG5cbiAgY3JlYXRlQ09SU1JlcXVlc3QgKG1ldGhvZCwgdXJsKSB7XG4gICAgdmFyIHhoclxuICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgaWYgKHhoci53aXRoQ3JlZGVudGlhbHMgIT0gbnVsbCkge1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgWERvbWFpblJlcXVlc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB4aHIgPSBuZXcgWERvbWFpblJlcXVlc3QoKVxuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHhociA9IG51bGxcbiAgICB9XG4gICAgcmV0dXJuIHhoclxuICB9XG5cbiAgcGVyZm9ybVVwbG9hZCAoZmlsZSwgdXJsKSB7XG4gICAgdmFyIHRoaXNfczN1cGxvYWQsIHhoclxuICAgIHRoaXNfczN1cGxvYWQgPSB0aGlzXG4gICAgdXJsID0gdXJsICsgKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArICdmaWxlPScgKyBlbmNvZGVVUklDb21wb25lbnQoZmlsZS5uYW1lKVxuICAgIHhociA9IHRoaXMuY3JlYXRlQ09SU1JlcXVlc3QoJ1BVVCcsIHVybClcbiAgICBpZiAoIXhocikge1xuICAgICAgdGhpcy5vbkVycm9yKGZpbGUudWlkLCAnQ09SUyBub3Qgc3VwcG9ydGVkJylcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICB0aGlzX3MzdXBsb2FkLm9uQ29tcGxldGUoZmlsZS51aWQsIEpTT04ucGFyc2UoZS50YXJnZXQucmVzcG9uc2VUZXh0KSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpc19zM3VwbG9hZC5vbkVycm9yKGZpbGUudWlkLCB4aHIuc3RhdHVzICsgJyAnICsgeGhyLnN0YXR1c1RleHQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpc19zM3VwbG9hZC5vbkVycm9yKGZpbGUudWlkLCAnVW5hYmxlIHRvIHJlYWNoIHNlcnZlcicpXG4gICAgICB9XG4gICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgcGVyY2VudExvYWRlZFxuICAgICAgICBpZiAoZS5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgcGVyY2VudExvYWRlZCA9IE1hdGgucm91bmQoKGUubG9hZGVkIC8gZS50b3RhbCkgKiAxMDApXG4gICAgICAgICAgcmV0dXJuIHRoaXNfczN1cGxvYWQub25Qcm9ncmVzcyhmaWxlLnVpZCwgeyBzcmM6IGZpbGUuc3JjLCBmaWxlbmFtZTogZmlsZS5uYW1lLCBwZXJjZW50TG9hZGVkOiBwZXJjZW50TG9hZGVkLCBieXRlc0xvYWRlZDogZS5sb2FkZWQsIGJ5dGVzVG90YWw6IGUudG90YWwgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geGhyLnNlbmQoZmlsZSlcbiAgfVxufVxuIiwiLypnbG9iYWwgJCovXG4vKmdsb2JhbCB3aW5kb3cqL1xuLypnbG9iYWwgUmVhY3QqL1xuLypnbG9iYWwgUmVhY3RET00qL1xuXG5pbXBvcnQgeyBDT1JTVXBsb2FkIH0gZnJvbSAnLi9jb3JzX3VwbG9hZCdcbmltcG9ydCB7IEJvb3RzdHJhcDNIZWFkZXIsIEJvb3RzdHJhcDNGaWxlUHJldmlldywgQm9vdHN0cmFwM1BsYWNlaG9sZGVyIH0gZnJvbSAnLi9ib290c3RyYXAzJ1xuXG5leHBvcnQgdmFyIEF0dGFjaGVGaWxlSW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZSAoKSB7XG4gICAgdmFyIGZpbGVzID0ge31cbiAgICBpZiAodGhpcy5wcm9wc1snZGF0YS12YWx1ZSddKSB7XG4gICAgICAkLmVhY2goSlNPTi5wYXJzZSh0aGlzLnByb3BzWydkYXRhLXZhbHVlJ10pLCBmdW5jdGlvbiAodWlkLCBqc29uKSB7XG4gICAgICAgIGlmIChqc29uKSBmaWxlc1t1aWRdID0ganNvblxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHsgZmlsZXM6IGZpbGVzLCBhdHRhY2hlc19kaXNjYXJkZWQ6IFtdLCB1cGxvYWRpbmc6IDAgfVxuICB9LFxuXG4gIG9uUmVtb3ZlICh1aWQsIGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICB2YXIgZmllbGRuYW1lID0gUmVhY3RET00uZmluZERPTU5vZGUodGhpcykuZmlyc3RDaGlsZC5uYW1lIC8vIHdoZW4gICAndXNlclthdmF0YXJdJ1xuICAgIHZhciBuZXdmaWVsZCA9IGZpZWxkbmFtZS5yZXBsYWNlKC9cXHcrXFxdKFxcW1xcXXwpJC8sICdhdHRhY2hlc19kaXNjYXJkZWRdW10nKSAvLyBiZWNvbWUgJ3VzZXJbYXR0YWNoZXNfZGlzY2FyZGVkXVtdJ1xuXG4gICAgdGhpcy5zdGF0ZS5hdHRhY2hlc19kaXNjYXJkZWQucHVzaCh7IGZpZWxkbmFtZTogbmV3ZmllbGQsIHBhdGg6IHRoaXMuc3RhdGUuZmlsZXNbdWlkXS5wYXRoIH0pXG4gICAgZGVsZXRlIHRoaXMuc3RhdGUuZmlsZXNbdWlkXVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlKVxuICB9LFxuXG4gIHBlcmZvcm1VcGxvYWQgKGZpbGVfZWxlbWVudCwgZmlsZXMpIHtcbiAgICAvLyB1c2VyIGNhbmNlbGxlZCBmaWxlIGNob29zZXIgZGlhbG9nLiBpZ25vcmVcbiAgICBpZiAoIWZpbGVzIHx8IGZpbGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG4gICAgaWYgKCF0aGlzLnByb3BzLm11bHRpcGxlKSB7XG4gICAgICB0aGlzLnN0YXRlLmZpbGVzID0ge31cbiAgICAgIGZpbGVzID0gW2ZpbGVzWzBdXSAvLyBhcnJheSBvZiAxIGVsZW1lbnRcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUpXG4gICAgLy8gdXBsb2FkIHRoZSBmaWxlIHZpYSBDT1JTXG4gICAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgICB0aGF0LnN0YXRlLnVwbG9hZGluZyA9IHRoYXQuc3RhdGUudXBsb2FkaW5nICsgZmlsZXMubGVuZ3RoXG4gICAgaWYgKCF0aGF0LnN0YXRlLnN1Ym1pdF9idXR0b25zKSB0aGF0LnN0YXRlLnN1Ym1pdF9idXR0b25zID0gJChcImJ1dHRvbixpbnB1dFt0eXBlPSdzdWJtaXQnXVwiLCAkKGZpbGVfZWxlbWVudCkucGFyZW50cygnZm9ybScpWzBdKS5maWx0ZXIoJzpub3QoOmRpc2FibGVkKScpXG5cbiAgICB2YXIgdXBsb2FkID0gbmV3IENPUlNVcGxvYWQoe1xuICAgICAgZmlsZV9lbGVtZW50OiBmaWxlX2VsZW1lbnQsXG4gICAgICBmaWxlczogZmlsZXMsXG4gICAgICBvblByb2dyZXNzOiB0aGlzLnNldEZpbGVWYWx1ZSxcbiAgICAgIG9uQ29tcGxldGUgKCkge1xuICAgICAgICB0aGF0LnN0YXRlLnVwbG9hZGluZy0tXG4gICAgICAgIHRoYXQuc2V0RmlsZVZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH0sXG4gICAgICBvbkVycm9yICh1aWQsIHN0YXR1cykge1xuICAgICAgICB0aGF0LnN0YXRlLnVwbG9hZGluZy0tXG4gICAgICAgIHRoYXQuc2V0RmlsZVZhbHVlKHVpZCwgeyBwY3RTdHJpbmc6ICc5MCUnLCBwY3REZXNjOiBzdGF0dXMsIGNsYXNzTmFtZTogJ3Byb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItZGFuZ2VyJyB9KVxuICAgICAgfVxuICAgIH0pXG4gICAgdXBsb2FkLmhhbmRsZUZpbGVTZWxlY3QoKVxuXG4gICAgLy8gd2UgZG9uJ3Qgd2FudCB0aGUgZmlsZSBiaW5hcnkgdG8gYmUgdXBsb2FkZWQgaW4gdGhlIG1haW4gZm9ybVxuICAgIC8vIHNvIHRoZSBhY3R1YWwgZmlsZSBpbnB1dCBpcyBuZXV0ZXJlZFxuICAgIGZpbGVfZWxlbWVudC52YWx1ZSA9ICcnXG4gIH0sXG5cbiAgb25DaGFuZ2UgKCkge1xuICAgIHZhciBmaWxlX2VsZW1lbnQgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKS5maXJzdENoaWxkXG4gICAgdGhpcy5wZXJmb3JtVXBsb2FkKGZpbGVfZWxlbWVudCwgZmlsZV9lbGVtZW50ICYmIGZpbGVfZWxlbWVudC5maWxlcylcbiAgfSxcblxuICBvbkRyYWdPdmVyIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICQoUmVhY3RET00uZmluZERPTU5vZGUodGhpcykpLmFkZENsYXNzKCdhdHRhY2hlLWRyYWdvdmVyJylcbiAgfSxcblxuICBvbkRyYWdMZWF2ZSAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAkKFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpKS5yZW1vdmVDbGFzcygnYXR0YWNoZS1kcmFnb3ZlcicpXG4gIH0sXG5cbiAgb25Ecm9wIChlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHZhciBmaWxlX2VsZW1lbnQgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKS5maXJzdENoaWxkXG4gICAgdGhpcy5wZXJmb3JtVXBsb2FkKGZpbGVfZWxlbWVudCwgZS50YXJnZXQuZmlsZXMgfHwgZS5kYXRhVHJhbnNmZXIuZmlsZXMpXG4gICAgJChSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKSkucmVtb3ZlQ2xhc3MoJ2F0dGFjaGUtZHJhZ292ZXInKVxuICB9LFxuXG4gIHNldEZpbGVWYWx1ZSAoa2V5LCB2YWx1ZSkge1xuICAgIHRoaXMuc3RhdGUuZmlsZXNba2V5XSA9IHZhbHVlXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlKVxuICB9LFxuXG4gIHJlbmRlciAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIEhlYWRlciA9IHdpbmRvdy5BdHRhY2hlSGVhZGVyIHx8IEJvb3RzdHJhcDNIZWFkZXJcbiAgICB2YXIgRmlsZVByZXZpZXcgPSB3aW5kb3cuQXR0YWNoZUZpbGVQcmV2aWV3IHx8IEJvb3RzdHJhcDNGaWxlUHJldmlld1xuICAgIHZhciBQbGFjZWhvbGRlciA9IHdpbmRvdy5BdHRhY2hlUGxhY2Vob2xkZXIgfHwgQm9vdHN0cmFwM1BsYWNlaG9sZGVyXG5cbiAgICBpZiAodGhhdC5zdGF0ZS51cGxvYWRpbmcgPiAwKSB7XG4gICAgICB0aGF0LnN0YXRlLnN1Ym1pdF9idXR0b25zLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICB9IGVsc2UgaWYgKHRoYXQuc3RhdGUuc3VibWl0X2J1dHRvbnMpIHtcbiAgICAgIHRoYXQuc3RhdGUuc3VibWl0X2J1dHRvbnMuYXR0cignZGlzYWJsZWQnLCBudWxsKVxuICAgIH1cblxuICAgIHZhciBwcmV2aWV3cyA9IFtdXG4gICAgJC5lYWNoKHRoYXQuc3RhdGUuZmlsZXMsIGZ1bmN0aW9uIChrZXksIHJlc3VsdCkge1xuICAgICAgLy8ganNvbiBpcyBpbnB1dFt2YWx1ZV0sIGRyb3Agbm9uIGVzc2VudGlhbCB2YWx1ZXNcbiAgICAgIHZhciBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKVxuICAgICAgZGVsZXRlIGNvcHkuc3JjXG4gICAgICBkZWxldGUgY29weS5maWxlbmFtZVxuICAgICAgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeShjb3B5KVxuICAgICAgLy9cbiAgICAgIHJlc3VsdC5tdWx0aXBsZSA9IHRoYXQucHJvcHMubXVsdGlwbGVcbiAgICAgIGlmIChyZXN1bHQucGF0aCkge1xuICAgICAgICB2YXIgcGFydHMgPSByZXN1bHQucGF0aC5zcGxpdCgnLycpXG4gICAgICAgIHJlc3VsdC5maWxlbmFtZSA9IHBhcnRzLnBvcCgpLnNwbGl0KC9bIz9dLykuc2hpZnQoKVxuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudCh0aGF0LnByb3BzWydkYXRhLWdlb21ldHJ5J10gfHwgJzEyOHgxMjgjJykpXG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHJlc3VsdC5maWxlbmFtZSkpXG4gICAgICAgIHJlc3VsdC5zcmMgPSB0aGF0LnByb3BzWydkYXRhLWRvd25sb2FkdXJsJ10gKyAnLycgKyBwYXJ0cy5qb2luKCcvJylcbiAgICAgIH1cbiAgICAgIHZhciBwcmV2aWV3S2V5ID0gJ3ByZXZpZXcnICsga2V5XG4gICAgICBwcmV2aWV3cy5wdXNoKFxuICAgICAgICA8ZGl2IGtleT17cHJldmlld0tleX0gY2xhc3NOYW1lPVwiYXR0YWNoZS1maWxlLWlucHV0XCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwiaGlkZGVuXCJcbiAgICAgICAgICAgIG5hbWU9e3RoYXQucHJvcHMubmFtZX1cbiAgICAgICAgICAgIHZhbHVlPXtqc29ufVxuICAgICAgICAgICAgcmVhZE9ubHk9XCJ0cnVlXCIgLz5cbiAgICAgICAgICA8RmlsZVByZXZpZXcgey4uLnJlc3VsdH0ga2V5PXtrZXl9IG9uUmVtb3ZlPXt0aGF0Lm9uUmVtb3ZlLmJpbmQodGhhdCwga2V5KX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcblxuICAgIHZhciBwbGFjZWhvbGRlcnMgPSBbXVxuICAgIGlmIChwcmV2aWV3cy5sZW5ndGggPT09IDAgJiYgdGhhdC5wcm9wc1snZGF0YS1wbGFjZWhvbGRlciddKSB7XG4gICAgICAkLmVhY2goSlNPTi5wYXJzZSh0aGF0LnByb3BzWydkYXRhLXBsYWNlaG9sZGVyJ10pLCBmdW5jdGlvbiAodWlkLCBzcmMpIHtcbiAgICAgICAgcGxhY2Vob2xkZXJzLnB1c2goXG4gICAgICAgICAgPFBsYWNlaG9sZGVyIGtleT1cInBsYWNlaG9sZGVyXCIgey4uLnRoYXQucHJvcHN9IHNyYz17c3JjfSAvPlxuICAgICAgICApXG4gICAgICB9KVxuICAgIH1cblxuICAgIHZhciBkaXNjYXJkcyA9IFtdXG4gICAgJC5lYWNoKHRoYXQuc3RhdGUuYXR0YWNoZXNfZGlzY2FyZGVkLCBmdW5jdGlvbiAoaW5kZXgsIGRpc2NhcmQpIHtcbiAgICAgIHZhciBkaXNjYXJkS2V5ID0gJ2Rpc2NhcmQnICsgZGlzY2FyZC5wYXRoXG4gICAgICBkaXNjYXJkcy5wdXNoKFxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBrZXk9e2Rpc2NhcmRLZXl9XG4gICAgICAgICAgdHlwZT1cImhpZGRlblwiXG4gICAgICAgICAgbmFtZT17ZGlzY2FyZC5maWVsZG5hbWV9XG4gICAgICAgICAgdmFsdWU9e2Rpc2NhcmQucGF0aH0gLz5cbiAgICAgIClcbiAgICB9KVxuXG4gICAgdmFyIGNsYXNzTmFtZSA9IFsnYXR0YWNoZS1maWxlLXNlbGVjdG9yJywgJ2F0dGFjaGUtcGxhY2Vob2xkZXJzLWNvdW50LScgKyBwbGFjZWhvbGRlcnMubGVuZ3RoLCAnYXR0YWNoZS1wcmV2aWV3cy1jb3VudC0nICsgcHJldmlld3MubGVuZ3RoLCB0aGlzLnByb3BzWydkYXRhLWNsYXNzbmFtZSddXS5qb2luKCcgJykudHJpbSgpXG4gICAgcmV0dXJuIChcbiAgICA8bGFiZWxcbiAgICAgIGh0bWxGb3I9e3RoYXQucHJvcHMuaWR9XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgIG9uRHJhZ092ZXI9e3RoaXMub25EcmFnT3Zlcn1cbiAgICAgIG9uRHJhZ0xlYXZlPXt0aGlzLm9uRHJhZ0xlYXZlfVxuICAgICAgb25Ecm9wPXt0aGlzLm9uRHJvcH0+XG4gICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiB7Li4udGhhdC5wcm9wc30gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9IC8+XG4gICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9e3RoYXQucHJvcHMubmFtZX0gdmFsdWU9XCJcIiAvPlxuICAgICAgPEhlYWRlciB7Li4udGhhdC5wcm9wc30gLz5cbiAgICAgIHtwcmV2aWV3c31cbiAgICAgIHtwbGFjZWhvbGRlcnN9XG4gICAgICB7ZGlzY2FyZHN9XG4gICAgPC9sYWJlbD5cbiAgICApXG4gIH1cbn0pXG4iXX0=
