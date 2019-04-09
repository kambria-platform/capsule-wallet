import React, { Component } from 'react';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);

const DEFAULT_STATE = {
  privateKey: ''
}


class PrivateKeyAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ privateKey: e.target.value });
  }

  handleSubmit() {
    this.returnData2Parent();
    // Clear history
    this.setState(DEFAULT_STATE);
  }

  returnData2Parent() {
    return this.props.done({
      subType: 'private-key',
      asset: {
        privateKey: this.state.privateKey
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
            <p>Enter private key</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input type="text" className="input" placeholder="Private Key" value={this.state.privateKey} onChange={this.handleChange}></input>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-8 col-lg-9 d-flex align-items-end">
            <p className="warning text-bottom"></p>
          </div>
          <div className="col-4 col-lg-3 d-flex">
            <button className="primary-btn" onClick={this.handleSubmit}>OK</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PrivateKeyAsset;
