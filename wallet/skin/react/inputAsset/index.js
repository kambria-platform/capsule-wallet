import React, { Component } from 'react';
import MnemonicAsset from './mnemonic';
import KeystoreAsset from './keystore';
import PrivateKeyAsset from './privateKey';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const MENU = [
  { key: 'mnemonic', label: 'Seed', icon: 'seed', status: 'negative', css: '' },
  { key: 'keystore', label: 'Keystore', icon: 'keystore', status: 'negative', css: '' },
  { key: 'private-key', label: 'Private Key', icon: 'privatekey', status: 'negative', css: '' },
  { key: 'back', label: 'Back', icon: 'arrow-left', status: 'standard', css: 'ml-auto' },
];


class InputAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subType: 'mnemonic'
    }

    this.data = this.props.data;

    this.onSelect = this.onSelect.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.menu = this.menu.bind(this);
    this.asset = this.asset.bind(this);
  }

  onSelect(key) {
    if (key === 'back') return window.capsuleWallet.back();
    return this.setState({ subType: key });
  }

  onReceive(data) {
    this.props.done(null, data);
  }

  menu() {
    return MENU.map(item => {
      return (
        <div key={item.key}
          className={
            "col col-md-2 wallet-nav"
            + " " + item.status
            + (item.key === this.state.subType ? ' selected' : '')
            + " " + (item.css ? item.css : "")
          }
          onClick={() => { this.onSelect(item.key) }}>
          <div className="d-flex h-100 justify-content-center align-items-center">
            <i className={item.icon} />
            <p>{item.label}</p>
          </div>
        </div>
      );
    });
  }

  asset() {
    if (this.state.subType === 'mnemonic') return <MnemonicAsset done={this.onReceive} />
    if (this.state.subType === 'keystore') return <KeystoreAsset done={this.onReceive} />
    if (this.state.subType === 'private-key') return <PrivateKeyAsset done={this.onReceive} />
  }

  render() {
    return (
      <div className="row align-items-center wallet-body animated zoomIn">
        <div className="col">
          <div className="box-form">
            <div className="row wallet-tab">
              {this.menu()}
            </div>
            <div className="wallet-form">
              {this.asset()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InputAsset;