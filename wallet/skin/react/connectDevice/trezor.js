import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

const STATUS = {
  INIT: 'Please connect the devide and click the button!',
  TEST: 'Connecting',
  FAIL: 'Cannot connect the devide!'
}


class TrezorAsset extends Component {
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
      <div className={cx("wallet-form")}>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col", "d-flex")}>
            <i className={cx("checked")} />
            <p className={cx("checked")}>This is a recommend way to access your wallet.</p>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col-6", "col-md-8", "col-lg-9", "d-flex", "align-items-end")}>
            <p className={cx("text-left")}>(Comming soon)</p>
          </div>
          <div className={cx("col-6", "col-md-4", "col-lg-3", "d-flex", "align-items-end")}>
            <button className={cx("primary-btn")} onClick={() => { /* Empty func */ }}>Connect</button>
          </div>
        </div>
      </div>
    )
  }
}

export default TrezorAsset;