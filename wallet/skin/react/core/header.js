import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);


class Header extends Component {
  constructor(props) {
    super(props);
  }

  getNetName = function (chainId) {
    if (!chainId) return null;
    chainId = chainId.toString();
    var network = null;
    switch (chainId.toLowerCase()) {
      case '1':
        network = 'mainnet';
        break;
      case 'mainnet':
        network = 'mainnet';
        break;
      case '3':
        network = 'ropsten';
        break;
      case 'ropsten':
        network = 'ropsten';
        break;
      case '4':
        network = 'rinkeby';
        break;
      case 'rinkeby':
        network = 'rinkeby';
        break;
      case '42':
        network = 'kovan';
        break;
      case 'kovan':
        network = 'kovan';
        break;
      default:
        network = null;
    }
    return network;
  }

  net() {
    let net = this.getNetName(window.capsuleWallet.net);
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
              <h1 className={cx("font-weight-bold", "secondary")}>CAPSULE WALLET.</h1>
            </div>
            <div className={cx("row")}>
              <h2 className={cx("secondary")}>Capsule wallet will power your Dapps with multi-wallets interaction.</h2>
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