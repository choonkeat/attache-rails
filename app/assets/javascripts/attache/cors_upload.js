(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.attache_cors_upload = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjQuMS4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUvY29yc191cGxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNLQSxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUE7O0lBRUYsVUFBVSxXQUFWLFVBQVU7QUFDckIsV0FEVyxVQUFVLENBQ1IsT0FBTyxFQUFFOzBCQURYLFVBQVU7O0FBRW5CLFFBQUksT0FBTyxJQUFJLElBQUksRUFBRSxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBQ2pDLFFBQUksTUFBTSxDQUFBO0FBQ1YsU0FBSyxNQUFNLElBQUksT0FBTyxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDL0I7R0FDRjs7O0FBQUE7ZUFQVSxVQUFVOzsyQ0FVRyxFQUFHOzs7K0JBQ2YsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFHOzs7K0JBQ2QsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFHOzs7NEJBQ2pCLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFBRSxXQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7S0FBRTs7O3VDQUVuQjtBQUNsQixVQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQTtBQUM1QyxVQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUMzQixTQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUM1QixVQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDckIsV0FBRyxHQUFHLEdBQUcsR0FDUCxRQUFRLEdBQUcsa0JBQWtCLENB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Q0wsbUJBQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtXQUMxRTtTQUNGLENBQUE7QUFDRCxXQUFHLENBQUMsT0FBTyxHQUFHLFlBQVk7QUFDeEIsaUJBQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLHdCQUF3QixDQUFDLENBQUE7U0FDakUsQ0FBQTtBQUNELFdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxFQUFFO0FBQ25DLGNBQUksYUFBYSxDQUFBO0FBQ2pCLGNBQUksQ0FBQyxDQUFDLGdCQUFnQixFQUFFO0FBQ3RCLHlCQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxBQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBSSxHQUFHLENBQUMsQ0FBQTtBQUN0RCxtQkFBTyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtXQUM1SjtTQUNGLENBQUE7T0FDRjtBQUNELGFBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN0Qjs7O1NBaEZVLFVBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypnbG9iYWwgJCovXG4vKmdsb2JhbCBhbGVydCovXG4vKmdsb2JhbCBYTUxIdHRwUmVxdWVzdCovXG4vKmdsb2JhbCBYRG9tYWluUmVxdWVzdCovXG5cbnZhciBjb3VudGVyID0gMFxuXG5leHBvcnQgY2xhc3MgQ09SU1VwbG9hZCB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkgb3B0aW9ucyA9IHt9XG4gICAgdmFyIG9wdGlvblxuICAgIGZvciAob3B0aW9uIGluIG9wdGlvbnMpIHtcbiAgICAgIHRoaXNbb3B0aW9uXSA9IG9wdGlvbnNbb3B0aW9uXVxuICAgIH1cbiAgfVxuXG4gIC8vIGZvciBvdmVyd3JpdGluZ1xuICBjcmVhdGVMb2NhbFRodW1ibmFpbCAoKSB7IH1cbiAgb25Db21wbGV0ZSAodWlkLCBqc29uKSB7IH1cbiAgb25Qcm9ncmVzcyAodWlkLCBqc29uKSB7IH1cbiAgb25FcnJvciAodWlkLCBzdGF0dXMpIHsgYWxlcnQoc3RhdHVzKSB9XG5cbiAgaGFuZGxlRmlsZVNlbGVjdCAoKSB7XG4gICAgdmFyIGYsIF9pLCBfbGVuLCBfcmVzdWx0cywgdXJsLCAkZWxlLCBwcmVmaXhcbiAgICAkZWxlID0gJCh0aGlzLmZpbGVfZWxlbWVudClcbiAgICB1cmwgPSAkZWxlLmRhdGEoJ3VwbG9hZHVybCcpXG4gICAgaWYgKCRlbGUuZGF0YSgnaG1hYycpKSB7XG4gICAgICB1cmwgPSB1cmwgK1xuICAgICAgICAnP2htYWM9JyArIGVuY29kZVVSSUNvbXBvbmVudCgkZWxlLmRhdGEoJ2htYWMnKSkgK1xuICAgICAgICAnJnV1aWQ9JyArIGVuY29kZVVSSUNvbXBvbmVudCgkZWxlLmRhdGEoJ3V1aWQnKSkgK1xuICAgICAgICAnJmV4cGlyYXRpb249JyArIGVuY29kZVVSSUNvbXBvbmVudCgkZWxlLmRhdGEoJ2V4cGlyYXRpb24nKSkgK1xuICAgICAgICAnJ1xuICAgIH1cblxuICAgIHByZWZpeCA9IERhdGUubm93KCkgKyAnXydcbiAgICBfcmVzdWx0cyA9IFtdXG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSB0aGlzLmZpbGVzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBmID0gdGhpcy5maWxlc1tfaV1cbiAgICAgIHRoaXMuY3JlYXRlTG9jYWxUaHVtYm5haWwoZikgLy8gaWYgYW55XG4gICAgICBmLnVpZCA9IHByZWZpeCArIChjb3VudGVyKyspXG4gICAgICB0aGlzLm9uUHJvZ3Jlc3MoZi51aWQsIHsgc3JjOiBmLnNyYywgZmlsZW5hbWU6IGYubmFtZSwgcGVyY2VudExvYWRlZDogMCwgYnl0ZXNMb2FkZWQ6IDAsIGJ5dGVzVG90YWw6IGYuc2l6ZSB9KVxuICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLnBlcmZvcm1VcGxvYWQoZiwgdXJsKSlcbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzXG4gIH1cblxuICBjcmVhdGVDT1JTUmVxdWVzdCAobWV0aG9kLCB1cmwpIHtcbiAgICB2YXIgeGhyXG4gICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICBpZiAoeGhyLndpdGhDcmVkZW50aWFscyAhPSBudWxsKSB7XG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBYRG9tYWluUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHhociA9IG5ldyBYRG9tYWluUmVxdWVzdCgpXG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybClcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyID0gbnVsbFxuICAgIH1cbiAgICByZXR1cm4geGhyXG4gIH1cblxuICBwZXJmb3JtVXBsb2FkIChmaWxlLCB1cmwpIHtcbiAgICB2YXIgdGhpc19zM3VwbG9hZCwgeGhyXG4gICAgdGhpc19zM3VwbG9hZCA9IHRoaXNcbiAgICB1cmwgPSB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgJ2ZpbGU9JyArIGVuY29kZVVSSUNvbXBvbmVudChmaWxlLm5hbWUpXG4gICAgeGhyID0gdGhpcy5jcmVhdGVDT1JTUmVxdWVzdCgnUFVUJywgdXJsKVxuICAgIGlmICgheGhyKSB7XG4gICAgICB0aGlzLm9uRXJyb3IoZmlsZS51aWQsICdDT1JTIG5vdCBzdXBwb3J0ZWQnKVxuICAgIH0gZWxzZSB7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHRoaXNfczN1cGxvYWQub25Db21wbGV0ZShmaWxlLnVpZCwgSlNPTi5wYXJzZShlLnRhcmdldC5yZXNwb25zZVRleHQpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzX3MzdXBsb2FkLm9uRXJyb3IoZmlsZS51aWQsIHhoci5zdGF0dXMgKyAnICcgKyB4aHIuc3RhdHVzVGV4dClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzX3MzdXBsb2FkLm9uRXJyb3IoZmlsZS51aWQsICdVbmFibGUgdG8gcmVhY2ggc2VydmVyJylcbiAgICAgIH1cbiAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBwZXJjZW50TG9hZGVkXG4gICAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICBwZXJjZW50TG9hZGVkID0gTWF0aC5yb3VuZCgoZS5sb2FkZWQgLyBlLnRvdGFsKSAqIDEwMClcbiAgICAgICAgICByZXR1cm4gdGhpc19zM3VwbG9hZC5vblByb2dyZXNzKGZpbGUudWlkLCB7IHNyYzogZmlsZS5zcmMsIGZpbGVuYW1lOiBmaWxlLm5hbWUsIHBlcmNlbnRMb2FkZWQ6IHBlcmNlbnRMb2FkZWQsIGJ5dGVzTG9hZGVkOiBlLmxvYWRlZCwgYnl0ZXNUb3RhbDogZS50b3RhbCB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB4aHIuc2VuZChmaWxlKVxuICB9XG59XG4iXX0=
