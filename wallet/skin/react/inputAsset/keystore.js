import React, { Component } from 'react';
var { Isoxys } = require('capsule-core-js');

// Setup CSS Module
import classNames from 'classnames/bind';
import style from '../../static/style/index.module.css';
var cx = classNames.bind(style);

const DEFAULT_STATE = {
  filename: '',
  keystore: null,
  password: '',
  error: null,
  loading: false
}


class KeystoreAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.done = props.done;
  }

  handleChangeFile = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      this.setState({ filename: file.name, keystore: JSON.parse(reader.result), error: null });
    }
  }

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value, error: null });
  }

  handleSubmit = () => {
    this.checkKeystore(ok => {
      if (!ok) return this.setState({ error: 'Cannot decrypt your keystore!' });

      this.returnData2Parent();
    });
  }

  checkKeystore = (callback) => {
    this.setState({ loading: true }, () => {
      // Fetch the first address to know whether good file
      let isoxys = new Isoxys(window.capsuleWallet.networkId, 'softwallet', true);
      isoxys.getAccountByKeystore(this.state.keystore, this.state.password, (er, re) => {
        this.setState({ loading: false });
        if (er || re.lenght <= 0) return callback(false);
        return callback(true);
      });
    });
  }

  returnData2Parent = () => {
    this.done({
      model: 'keystore',
      asset: {
        keystore: this.state.keystore,
        password: this.state.password
      }
    });
  }

  componentWillUnmount() {
    // Clear history
    this.setState({ ...DEFAULT_STATE });
  }

  render() {
    return (
      <div className={cx("wallet-form")}>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col", "d-flex")}>
            <i className={cx("warning")} />
            <p className={cx("warning")}>This is not recommend way to access your wallet.</p>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col", "d-flex")}>
            <p>Upload keystore</p>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col-6", "col-md-8", "col-lg-9")}>
            <input id="keystore-file" type="file" accept="application/json" onChange={this.handleChangeFile} style={{ "display": "none" }} />
            <input type="text" className={cx("input")} value={this.state.filename} disabled></input>
          </div>
          <div className={cx("col-6", "col-md-4", "col-lg-3")}>
            <button className={cx("primary-btn")} onClick={() => { document.getElementById('keystore-file').click(); }}>Browse</button>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col", "d-flex")}>
            <p>Enter password</p>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col")}>
            <input type="password" className={cx("input")} placeholder="Password" value={this.state.password} onChange={this.handleChangePassword}></input>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col-6", "col-md-8", "col-lg-9", "d-flex", "align-items-end")}>
            <p className={cx("warning", "text-bottom")}>{this.state.error}</p>
          </div>
          <div className={cx("col-6", "col-md-4", "col-lg-3", "d-flex")}>
            <button className={cx("primary-btn")} onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      </div>
    );
  }
}

export default KeystoreAsset;