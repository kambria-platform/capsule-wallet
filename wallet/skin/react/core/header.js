import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

var util = require('../../../lib/util');

class Header extends Component {
  constructor(props) {
    super(props);
  }

  net() {
    let net = util.chainCode(window.capsuleWallet.net, 'string');
    let Net = net.charAt(0).toUpperCase() + net.slice(1)
    return (
      <div className={cx("box-line", net)}>
        <i className={cx("ethereum")} />
        <p className={cx("my-auto")}>{Net} Network</p>
      </div>
    )
  }

  render() {
    return (
      <div className={cx("row", "wallet-header")}>
        <div className={cx("container", "h-100")}>
          <div className={cx("h-100", "d-flex", "flex-column")}>
            <div className={cx("row")}>
              <h1 className={cx("font-weight-bold", "secondary")}>CAPSULE WALLET</h1>
            </div>
            <div className={cx("row")}>
              <h2 className={cx("secondary", "font-italic")}>- Capsule wallet as a bridge connects the Dapps to Ethereum blockchain in many easy ways -</h2>
            </div>
            <div className={cx("row", "flex-grow-1", "justify-content-end", "align-items-end")}>
              {this.net()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;