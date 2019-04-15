import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);


class Author extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={cx("row", "wallet-copyright")}>
        <div className={cx("col")}>
          <div className={cx("d-flex", "h-100", "justify-content-start", "align-items-center")}>
            <p className={cx("white")}>A product powered by</p><i className={cx("kambria")} />
          </div>
        </div>
        <div className={cx("col")}>
          <div className={cx("d-flex", "h-100", "justify-content-end", "align-items-center")}>
            <i className={cx("github")} />
            <a className={cx("white")} href="https://github.com/sontuphan/capsule-wallet" target="_blank" rel="noopener noreferrer" >View on Github</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Author;