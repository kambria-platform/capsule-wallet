import React, { Component } from 'react';
import MnemonicAsset from './mnemonic.inputAsset';
import KeystoreAsset from './keystore.inputAsset';
import PrivateKeyAsset from './privateKey.inputAsset';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const MENU = [
  { key: 'mnemonic', label: 'Seed', icon: 'seed', status: 'negative' },
  { key: 'keystore', label: 'Keystore', icon: 'keystore', status: 'negative' },
  { key: 'private-key', label: 'Private Key', icon: 'privatekey', status: 'negative' },
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
    this.setState({ subType: key });
  }

  onReceive(data) {
    this.props.done(null, data);
  }

  menu() {
    return MENU.map(item => {
      return (
        <div key={item.key}
          className={"col col-md-2 wallet-nav " + item.status + (item.key === this.state.subType ? ' selected' : '')}
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
      <div className="row align-items-center wallet-body">
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