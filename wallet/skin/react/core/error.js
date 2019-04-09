import React, { Component } from 'react';

// Setup CSS Module
// import classNames from 'classnames/bind';
// import style from 'Style/index.scss';
// var cx = classNames.bind(style);


class ErrorForm extends Component {

  render() {
    return (
      <div className="row align-items-center wallet-body animated zoomIn">
        <div className="col">
          <div className="box-form p-5">

            <div className="row mb-3">
              <div className="col d-flex">
                <i className="warning" />
                <h2 className="warning mb-0">An error has occurred</h2>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-md-6 d-flex align-items-end text-left mb-3">
                <p className="lengthy">Details: {this.props.error}</p>
              </div>
              <div className="col-12 col-md-6 d-flex align-items-end mb-3">
                <button className="primary-btn" onClick={this.props.done}>OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorForm;