import React, { Component } from 'react';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);


class Author extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row wallet-copyright">
        <div className="col">
          <div className="d-flex h-100 justify-content-start align-items-center">
            <p className="white">A product powered by</p><i className="kambria" />
          </div>
        </div>
        <div className="col">
          <div className="d-flex h-100 justify-content-end align-items-center">
            <i className="github" />
            <a className="white" href="https://github.com/sontuphan/capsule-wallet" target="_blank" rel="noopener noreferrer" >View on Github</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Author;