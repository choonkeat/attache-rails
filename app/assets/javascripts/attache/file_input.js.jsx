var AttacheFileInput = React.createClass({

  getInitialState: function() {
    var files = {};
    if (this.props['data-value']) $.each(JSON.parse(this.props['data-value']), function(uid, json) {
      if (json) files[uid] = { path: json };
    });
    return {files: files};
  },

  onRemove: function(uid, e) {
    e.preventDefault();
    e.stopPropagation();

    delete this.state.files[uid];
    this.setState(this.state);
  },

  onChange: function() {
    var file_element = this.getDOMNode().firstChild;
    // user cancelled file chooser dialog. ignore
    if (file_element.files.length == 0) return;
    if (! this.props.multiple) this.state.files = {};

    this.setState(this.state);
    // upload the file via CORS
    var that = this;
    new AttacheCORSUpload({
      file_element: file_element,
      onComplete:   this.setFileValue,
      onProgress:   this.setFileValue,
      onError: function(uid, status) {
        that.setFileValue(uid, { pctString: '90%', pctDesc: status, className: 'progress-bar progress-bar-danger' });
      }
    });

    // we don't want the file binary to be uploaded in the main form
    // so the actual file input is neutered
    file_element.value = '';
  },

  setFileValue: function(key, value) {
    this.state.files[key] = value;
    this.setState(this.state);
  },

  render: function() {
    var that = this;

    var previews = [];
    $.each(that.state.files, function(key, result) {
      var json = JSON.stringify(result);
      if (result.path) {
        var parts = result.path.split('/');
        parts.splice(parts.length-1, 0, encodeURIComponent(that.props['data-geometry'] || '128x128#'));
        result.src = that.props['data-downloadurl'] + '/' + parts.join('/');
        result.filename = result.src.split('/').pop().split(/[#?]/).shift();
        result.multiple = that.props.multiple;
      }
      previews.push(
        <div className="attache-file-input">
          <input type="hidden" name={that.props.name} value={result.path} readOnly="true" />
          <AttacheFilePreview {...result} key={key} onRemove={that.onRemove.bind(that, key)}/>
        </div>
      );
    });

    var placeholders = [];
    if (previews.length == 0 && that.props['data-placeholder']) $.each(JSON.parse(that.props['data-placeholder']), function(uid, src) {
      placeholders.push(
        <AttachePlaceholder  {...that.props} src={src} />
      );
    });

    var className = ["attache-file-selector", "attache-placeholders-count-" + placeholders.length, "attache-previews-count-" + previews.length, this.props['data-classname']].join(' ').trim();
    return (
      <label htmlFor={that.props.id} className={className}>
        <input type="file" {...that.props} onChange={this.onChange}/>
        <AttacheHeader {...that.props} />
        {previews}
        {placeholders}
      </label>
    );
  }
});
