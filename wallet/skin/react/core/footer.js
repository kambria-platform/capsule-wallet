import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);


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
      <div className={cx("row", "wallet-footer")}>
        <div className={cx("col-12", "col-sm-6", "col-md-4", "col-lg-3 mt-5")} style={{ "height": "50px" }}>
          <div className={cx("row")}>
            <div className={cx("col", "text-center")}>
              <button className={cx("circle-btn")}><i className={cx("prevent-fish")} /></button>
            </div>
            <div className={cx("col", "text-center")}>
              <button className={cx("circle-btn")} onClick={this.term}><i className={cx("term-privacy")} /></button>
            </div>
            <div className={cx("col", "text-center")}>
              <button className={cx("circle-btn")} onClick={this.support}><i className={cx("support")} /></button>
            </div>
          </div>
        </div>
        <div className={cx("col-12", "col-sm-6", "col-md-8", "col-lg-9", "mt-5")}>
          <div className={cx("row")}>
            <div className={cx("col", "text-right")}>
              <button onClick={this.props.skip} className={cx("line-btn")}>
                <span className={cx("full-text")}>
                  <p>Skip the website with limited function</p>
                  <i className={cx("arrow-right")} />
                </span>
                <span className={cx("short-text")}>
                  <p>Skip</p>
                  <i className={cx("arrow-right")} />
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