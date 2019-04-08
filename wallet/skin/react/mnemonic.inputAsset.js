import React, { Component } from 'react';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

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
      subType: 'mnemonic',
      asset: {
        mnemonic: this.state.mnemonic,
        password: this.state.password
      }
    });
  }

  render() {
    return (
      <div className="wallet-form">
        <div className="row mb-3">
          <div className="col d-flex">
            <i className="warning" />
            <p className="warning">This is not recommend way to access your wallet.</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col d-flex">
            <p>Enter seed</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input type="text" className="input" placeholder="Seed" value={this.state.mnemonic} onChange={this.handleChangeMnemonic}></input>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col d-flex">
            <p>Enter password (Optional)</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input type="password" className="input" placeholder="Password"  value={this.state.password} onChange={this.handleChangePassword}></input>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-8 col-lg-9 d-flex align-items-end">
            <p className="warning text-bottom">Error Here Error Here Error Here</p>
          </div>
          <div className="col-4 col-lg-3 d-flex">
            <button className="primary-btn" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      </div>
    );
  }
}

export default MnemonicAsset;