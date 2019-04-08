import React, { Component } from 'react';

var COUNTER = null;


class Loading extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false; // Remoce risk of memory leak

    this.state = {
      loading: ''
    }

  }

  componentDidMount() {
    this._isMounted = true;
    var self = this;

    COUNTER = setInterval(function () {
      switch (self.state.loading) {
        case '':
          if (self._isMounted) self.setState({ loading: '.' });
          break;
        case '.':
          if (self._isMounted) self.setState({ loading: '..' });
          break;
        case '..':
          if (self._isMounted) self.setState({ loading: '...' });
          break;
        default:
          if (self._isMounted) self.setState({ loading: '' });
          break;
      }
    }, 500);
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(COUNTER);
  }

  render() {
    return (
      <span>{this.state.loading}</span>
    );
  }
}

export default Loading;