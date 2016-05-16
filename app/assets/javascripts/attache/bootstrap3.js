(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.attache_bootstrap3 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdjQuMS4wL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2phdmFzY3JpcHRzL2F0dGFjaGUvYm9vdHN0cmFwMy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDR08sSUFBSSxxQkFBcUIsV0FBckIscUJBQXFCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7QUFDbkQsaUJBQWUsNkJBQUk7QUFDakIsV0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQTtHQUN0QjtBQUVELGFBQVcsdUJBQUUsS0FBSyxFQUFFO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBQ3pDLEtBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7R0FDM0M7QUFFRCxZQUFVLHNCQUFFLEtBQUssRUFBRTtBQUNqQixLQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0dBQzVDO0FBRUQsUUFBTSxvQkFBSTtBQUNSLFFBQUksZ0JBQWdCLEdBQUcsc0JBQXNCOzs7QUFBQSxBQUc3QyxRQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ3hDLHNCQUFnQixHQUFHLGdCQUFnQixHQUFHLGtCQUFrQixDQUFBO0FBQ3hELFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLDBDQUEwQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLHVCQUF1QixHQUFHLEVBQUUsQ0FBQSxBQUFDLENBQUE7QUFDcEksVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUEsR0FBSSxHQUFHLENBQUE7QUFDL0YsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsWUFBWSxHQUFHLFNBQVMsQ0FBQSxBQUFDLENBQUE7QUFDL0UsVUFBSSxRQUFRLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQTtBQUNwRCxVQUFJLFFBQVEsR0FDWjs7VUFBSyxTQUFTLEVBQUMsVUFBVTtRQUN2Qjs7O0FBQ0UscUJBQVMsRUFBRSxTQUFTLEFBQUM7QUFDckIsZ0JBQUksRUFBQyxhQUFhO0FBQ2xCLDZCQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxBQUFDO0FBQ3hDLDZCQUFjLEdBQUc7QUFDakIsNkJBQWMsS0FBSztBQUNuQixpQkFBSyxFQUFFLFFBQVEsQUFBQztVQUNmLE9BQU87U0FDSjtPQUNGLEFBQ0wsQ0FBQTtLQUNGOzs7QUFBQSxBQUdELFFBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDbEIsVUFBSSxHQUFHLEdBQUcsNkJBQUssR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxBQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLEFBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQUFBQyxHQUFHLENBQUE7S0FDM0Y7OztBQUFBLEFBR0QsV0FDQTs7UUFBSyxTQUFTLEVBQUUsZ0JBQWdCLEFBQUM7TUFDOUIsUUFBUTtNQUNSLEdBQUc7TUFDSjs7VUFBSyxTQUFTLEVBQUMsVUFBVTtRQUN2Qjs7WUFBSyxTQUFTLEVBQUMsV0FBVztVQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7U0FDaEI7UUFDTjs7O0FBQ0UsZ0JBQUksRUFBQyxTQUFTO0FBQ2QscUJBQVMsRUFBQyxZQUFZO0FBQ3RCLG1CQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEFBQUM7QUFDN0IsaUJBQUssRUFBQyxpQkFBaUI7O1NBQVk7T0FDakM7S0FDRixDQUNMO0dBQ0Y7Q0FDRixDQUFDLENBQUE7O0FBRUssSUFBSSxxQkFBcUIsV0FBckIscUJBQXFCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7QUFDbkQsUUFBTSxvQkFBSTtBQUNSLFdBQ0E7O1FBQUssU0FBUyxFQUFDLHNCQUFzQjtNQUNuQyw2QkFBSyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEFBQUMsR0FBRztLQUN4QixDQUNMO0dBQ0Y7Q0FDRixDQUFDLENBQUE7O0FBRUssSUFBSSxnQkFBZ0IsV0FBaEIsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7QUFDOUMsUUFBTSxvQkFBSTtBQUNSLFdBQ0EscUNBQVksQ0FDWDtHQUNGO0NBQ0YsQ0FBQyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qZ2xvYmFsICQqL1xuLypnbG9iYWwgUmVhY3QqL1xuXG5leHBvcnQgdmFyIEJvb3RzdHJhcDNGaWxlUHJldmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlICgpIHtcbiAgICByZXR1cm4geyBzcmNXYXM6ICcnIH1cbiAgfSxcblxuICBvblNyY0xvYWRlZCAoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc3JjV2FzOiB0aGlzLnByb3BzLnNyYyB9KVxuICAgICQoZXZlbnQudGFyZ2V0KS50cmlnZ2VyKCdhdHRhY2hlOmltZ2xvYWQnKVxuICB9LFxuXG4gIG9uU3JjRXJyb3IgKGV2ZW50KSB7XG4gICAgJChldmVudC50YXJnZXQpLnRyaWdnZXIoJ2F0dGFjaGU6aW1nZXJyb3InKVxuICB9LFxuXG4gIHJlbmRlciAoKSB7XG4gICAgdmFyIHByZXZpZXdDbGFzc05hbWUgPSAnYXR0YWNoZS1maWxlLXByZXZpZXcnXG5cbiAgICAvLyBwcm9ncmVzc2JhclxuICAgIGlmICh0aGlzLnN0YXRlLnNyY1dhcyAhPT0gdGhpcy5wcm9wcy5zcmMpIHtcbiAgICAgIHByZXZpZXdDbGFzc05hbWUgPSBwcmV2aWV3Q2xhc3NOYW1lICsgJyBhdHRhY2hlLWxvYWRpbmcnXG4gICAgICB2YXIgY2xhc3NOYW1lID0gdGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgJ3Byb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBhY3RpdmUnICsgKHRoaXMucHJvcHMuc3JjID8gJyBwcm9ncmVzcy1iYXItc3VjY2VzcycgOiAnJylcbiAgICAgIHZhciBwY3RTdHJpbmcgPSB0aGlzLnByb3BzLnBjdFN0cmluZyB8fCAodGhpcy5wcm9wcy5zcmMgPyAxMDAgOiB0aGlzLnByb3BzLnBlcmNlbnRMb2FkZWQpICsgJyUnXG4gICAgICB2YXIgcGN0RGVzYyA9IHRoaXMucHJvcHMucGN0RGVzYyB8fCAodGhpcy5wcm9wcy5zcmMgPyAnTG9hZGluZy4uLicgOiBwY3RTdHJpbmcpXG4gICAgICB2YXIgcGN0U3R5bGUgPSB7IHdpZHRoOiBwY3RTdHJpbmcsIG1pbldpZHRoOiAnM2VtJyB9XG4gICAgICB2YXIgcHJvZ3Jlc3MgPSAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgICByb2xlPVwicHJvZ3Jlc3NiYXJcIlxuICAgICAgICAgIGFyaWEtdmFsdWVub3c9e3RoaXMucHJvcHMucGVyY2VudExvYWRlZH1cbiAgICAgICAgICBhcmlhLXZhbHVlbWluPVwiMFwiXG4gICAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgc3R5bGU9e3BjdFN0eWxlfT5cbiAgICAgICAgICB7cGN0RGVzY31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICAvLyBpbWcgdGFnXG4gICAgaWYgKHRoaXMucHJvcHMuc3JjKSB7XG4gICAgICB2YXIgaW1nID0gPGltZyBzcmM9e3RoaXMucHJvcHMuc3JjfSBvbkxvYWQ9e3RoaXMub25TcmNMb2FkZWR9IG9uRXJyb3I9e3RoaXMub25TcmNFcnJvcn0gLz5cbiAgICB9XG5cbiAgICAvLyBjb21iaW5lZFxuICAgIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e3ByZXZpZXdDbGFzc05hbWV9PlxuICAgICAge3Byb2dyZXNzfVxuICAgICAge2ltZ31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xlYXJmaXhcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdWxsLWxlZnRcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5maWxlbmFtZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxhXG4gICAgICAgICAgaHJlZj1cIiNyZW1vdmVcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cInB1bGwtcmlnaHRcIlxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMub25SZW1vdmV9XG4gICAgICAgICAgdGl0bGU9XCJDbGljayB0byByZW1vdmVcIj4mdGltZXM7PC9hPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9XG59KVxuXG5leHBvcnQgdmFyIEJvb3RzdHJhcDNQbGFjZWhvbGRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXR0YWNoZS1maWxlLXByZXZpZXdcIj5cbiAgICAgIDxpbWcgc3JjPXt0aGlzLnByb3BzLnNyY30gLz5cbiAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbmV4cG9ydCB2YXIgQm9vdHN0cmFwM0hlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgIDxub3NjcmlwdCAvPlxuICAgIClcbiAgfVxufSlcbiJdfQ==
