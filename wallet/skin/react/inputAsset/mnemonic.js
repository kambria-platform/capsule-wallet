import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from '../../static/style/index.module.css';
var cx = classNames.bind(style);

const DEFAULT_STATE = {
  mnemonic: '',
  password: ''
}


class MnemonicAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.handleChangeMnemonic = this.handleChangeMnemonic.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.returnData2Parent = this.returnData2Parent.bind(this);
  }

  handleChangeMnemonic(e) {
    this.setState({ mnemonic: e.target.value });
  }

  handleChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit() {
    this.returnData2Parent();
    // Clear history
    this.setState(DEFAULT_STATE);
  }

  returnData2Parent() {
    return this.props.done({
      model: 'mnemonic',
      asset: {
        mnemonic: this.state.mnemonic,
        password: this.state.password
      }
    });
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
            <p>Enter seed</p>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col")}>
            <input type="text" className={cx("input")} placeholder="Seed" value={this.state.mnemonic} onChange={this.handleChangeMnemonic}></input>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col", "d-flex")}>
            <p>Enter password (Optional)</p>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col")}>
            <input type="password" className={cx("input")} placeholder="Password" value={this.state.password} onChange={this.handleChangePassword}></input>
          </div>
        </div>
        <div className={cx("row", "mb-3")}>
          <div className={cx("col-6", "col-md-8", "col-lg-9", "d-flex", "align-items-end")}>
            <p className={cx("warning", "text-bottom")}></p>
          </div>
          <div className={cx("col-6", "col-md-4", "col-lg-3", "d-flex")}>
            <button className={cx("primary-btn")} onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      </div>
    );
  }
}

export default MnemonicAsset;