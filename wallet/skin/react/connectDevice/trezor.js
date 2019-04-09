import React, { Component } from 'react';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const STATUS = {
  INIT: 'Please connect the devide and click the button!',
  TEST: 'Connecting',
  FAIL: 'Cannot connect the devide!'
}


class Trezor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: STATUS.INIT
    }

    this.returnData2Parent = this.returnData2Parent.bind(this);
  }

  returnData2Parent() {
    this.props.done({
      subType: 'trezor'
    });
  }

  render() {
    return (
      <div className="wallet-form">
        <div className="row mb-3">
          <div className="col d-flex">
            <i className="checked" />
            <p className="checked">This is a recommend way to access your wallet.</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-8 col-lg-9 d-flex align-items-end">
            <p className="text-bottom">Comming soon</p>
          </div>
          <div className="col-4 col-lg-3 d-flex">
            <button className="primary-btn" onClick={this.returnData2Parent}>Connect</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Trezor;