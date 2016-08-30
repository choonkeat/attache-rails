/*global $*/
/*global window*/
/*global React*/
/*global ReactDOM*/

import { Bootstrap3Header, Bootstrap3FilePreview, Bootstrap3Placeholder } from './attache/bootstrap3'
import { AttacheFileInput } from './attache/file_input'
import { CORSUpload } from './attache/cors_upload'

export var upgradeFileInput = function () {
  var safeWords = { 'class': 'className', 'for': 'htmlFor' }
  var sel = document.getElementsByClassName('enable-attache')
  var ele, attrs, name, value
  for (var i = sel.length - 1; i >= 0; i--) {
    ele = sel[i]
    attrs = ele.dataset.attacheProps
    if (attrs) {
      attrs = JSON.parse(attrs)
    } else {
      attrs = {}
      for (var j = 0; j < ele.attributes.length; j++) {
        name = ele.attributes[j].name
        value = ele.attributes[j].value
        if (name === 'class') value = value.replace('enable-attache', 'attache-enabled')
        name = safeWords[name] || name
        attrs[name] = value
      }
    }
    var wrap = document.createElement('div')
    wrap.className = 'enable-attache'
    wrap.dataset.attacheProps = JSON.stringify(attrs)
    ele.parentNode.replaceChild(wrap, ele)
    ReactDOM.render(React.createElement(AttacheFileInput, $.extend({}, attrs)), wrap)
  }
}

window.attache_cors_upload = { CORSUpload }
window.attache_bootstrap3 = { Bootstrap3Header, Bootstrap3FilePreview, Bootstrap3Placeholder }
window.attache_file_input = { AttacheFileInput, upgradeFileInput }
$(document).on('page:change turbolinks:load', upgradeFileInput)
$(upgradeFileInput)
