if (typeof AttacheFilePreview === 'undefined') {

  var AttacheFilePreview = React.createClass({

    getInitialState: function() {
      return { srcWas: '' };
    },

    onSrcLoaded: function() {
      this.setState({ srcWas: this.props.src });
    },

    render: function() {
      // progressbar
      if (this.state.srcWas != this.props.src) {
        var className = this.props.className || "progress-bar progress-bar-striped active" + (this.props.src ? " progress-bar-success" : "");
        var pctString = this.props.pctString || (this.props.src ? 100 : this.props.percentLoaded) + "%";
        var pctDesc   = this.props.pctDesc   || (this.props.src ? 'Loading...' : pctString);
        var pctStyle  = { width: pctString, minWidth: '3em' };
        var progress = (
          <div className="progress">
            <div className={className} role="progressbar" aria-valuenow={this.props.percentLoaded} aria-valuemin="0" aria-valuemax="100" style={pctStyle}>
              {pctDesc}
            </div>
          </div>
        );
      }

      // img tag
      if (this.props.src) {
        var img = <img src={this.props.src} onLoad={this.onSrcLoaded} />;
      }

      // combined
      return (
        <div className="attache-file-preview">
          {progress}
          {img}
          <div className="clearfix">
            <div className="pull-left">{this.props.filename}</div>
            <a href="#remove" className="pull-right" onClick={this.props.onRemove} title="Click to remove">&times;</a>
          </div>
        </div>
      );
    }
  });

}

if (typeof AttachePlaceholder === 'undefined') {

  var AttachePlaceholder = React.createClass({
    render: function() {
      return (
        <div className="attache-file-preview">
          <img src={this.props.src} />
        </div>
      );
    }
  });

}

if (typeof AttacheHeader === 'undefined') {

  var AttacheHeader = React.createClass({
    render: function() {
      return (
        <noscript />
      );
    }
  });

}
