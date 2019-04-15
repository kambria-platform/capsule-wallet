import React, { Component } from 'react';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);


class ErrorForm extends Component {

  render() {
    return (
      <div className={cx("row", "align-items-center", "wallet-body", "animated", "zoomIn")}>
        <div className={cx("col")}>
          <div className={cx("box-form", "p-5")}>

            <div className={cx("row", "mb-3")}>
              <div className={cx("col", "d-flex")}>
                <i className={cx("warning")} />
                <h2 className={cx("warning", "mb-0")}>An error has occurred</h2>
              </div>
            </div>

            <div className={cx("row")}>
              <div className={cx("col-12", "col-md-6", "d-flex", "align-items-end", "text-left", "mb-3")}>
                <p className={cx("lengthy")}>Details: {this.props.error}</p>
              </div>
              <div className={cx("col-12", "col-md-6", "d-flex", "align-items-end", "mb-3")}>
                <button className={cx("primary-btn")} onClick={this.props.done}>OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorForm;