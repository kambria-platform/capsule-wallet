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
        <div className="col col-md">
          <p>Ethereum Donation:</p>
          <a href="https://etherscan.io/address/0x04a3E43d2415cC97d1946B87485DE5a5B9Fa6F2b" target="_blank" rel="noopener noreferrer">0x04a3E43d2415cC97d1946B87485DE5a5B9Fa6F2b</a>
        </div>
        <div className="col text-right">
          <div className="d-flex h-100 justify-content-end align-items-center">
            <i className="github" />
            <a href="https://github.com/sontuphan/capsule-wallet" target="_blank" rel="noopener noreferrer" >View on Github</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Author;