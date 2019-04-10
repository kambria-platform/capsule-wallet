import React, { Component } from 'react';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);


class Footer extends Component {
  constructor(props) {
    super(props);
  }

  support() {
    window.capsuleWallet.support();
  }

  term() {
    window.capsuleWallet.term();
  }

  render() {
    return (
      <div className="row wallet-footer">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-5" style={{ "height": "50px" }}>
          <div className="row">
            <div className="col text-center">
              <button className="circle-btn"><i className="prevent-fish" /></button>
            </div>
            <div className="col text-center">
              <button className="circle-btn" onClick={this.term}><i className="term-privacy" /></button>
            </div>
            <div className="col text-center">
              <button className="circle-btn" onClick={this.support}><i className="support" /></button>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-8 col-lg-9 mt-5">
          <div className="row">
            <div className="col text-right">
              <button onClick={this.props.skip} className="line-btn">
                <span className="full-text">
                  <p>Skip the website with limited function</p>
                  <i className="arrow-right" />
                </span>
                <span className="short-text">
                  <p>Skip</p>
                  <i className="arrow-right" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;