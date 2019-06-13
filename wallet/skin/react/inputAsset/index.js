import React, { Component } from 'react';
import MnemonicAsset from './mnemonic';
import KeystoreAsset from './keystore';
import PrivateKeyAsset from './privateKey';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from '../../static/style/index.module.css';
var cx = classNames.bind(style);

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
      model: 'mnemonic'
    }

    this.onSelect = this.onSelect.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.menu = this.menu.bind(this);
    this.asset = this.asset.bind(this);
  }

  onSelect(key) {
    if (key === 'back') return window.capsuleWallet.back();
    return this.setState({ model: key });
  }

  onReceive(data) {
    this.props.done(null, data);
  }

  menu() {
    return MENU.map(item => {
      return (
        <div key={item.key}
          className={cx("col", "col-md-2", "wallet-nav", item.status, { "selected": item.key === this.state.model }, item.css)}
          onClick={() => { this.onSelect(item.key) }}>
          <div className={cx("d-flex", "h-100", "justify-content-center", "align-items-center")}>
            <i className={cx(item.icon)} />
            <p>{item.label}</p>
          </div>
        </div>
      );
    });
  }

  asset() {
    if (this.state.model === 'mnemonic') return <MnemonicAsset done={this.onReceive} />
    if (this.state.model === 'keystore') return <KeystoreAsset done={this.onReceive} />
    if (this.state.model === 'private-key') return <PrivateKeyAsset done={this.onReceive} />
  }

  render() {
    return (
      <div className={cx("row", "align-items-center", "wallet-body", "animated", "zoomIn")}>
        <div className={cx("col")}>
          <div className={cx("box-form")}>
            <div className={cx("row", "wallet-tab")}>
              {this.menu()}
            </div>
            {this.asset()}
          </div>
        </div>
      </div>
    );
  }
}

export default InputAsset;