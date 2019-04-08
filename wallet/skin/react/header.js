import React, { Component } from 'react';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);


class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row wallet-header">
        <div className="container h-100">
          <div className="h-100 d-flex flex-column">
            <div className="row">
              <h1 className="font-weight-bold secondary">CAPSULE WALLET.</h1>
            </div>
            <div className="row">
              <h2 className="font-italic secondary">Lorem ipsum dolor sit amet, et legendos liberavisse sit.</h2>
            </div>
            <div className="row flex-grow-1 justify-content-end align-items-end">
              <div className="box-line ropsten">
                <i className="ethereum" />
                <p className="my-auto">Ropsten Network</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;