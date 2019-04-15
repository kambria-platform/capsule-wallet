import React from 'react';
import PropTypes from 'prop-types';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

let modalsShowing = 0;

function modalWillShow() {
  if (modalsShowing === 0 && document) {
    document.body.classList.add(cx("modal-open"));
  }

  modalsShowing += 1;
}

function modalWillHide() {
  modalsShowing -= 1;

  if (modalsShowing === 0 && document) {
    document.body.classList.remove(cx("modal-open"));
  }
}

class Modal extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClickBackdrop: PropTypes.func,
    visible: PropTypes.bool.isRequired,
    wrapperProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
    dialogClassName: PropTypes.string
  };

  static defaultProps = {
    onClickBackdrop: null,
    wrapperProps: null,
    className: null,
    dialogClassName: null
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      modalIndex: 0,
    };
  }

  componentWillMount = () => {
    if (this.props.visible) {
      modalWillShow();
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        modalWillShow();
      } else {
        modalWillHide();
      }

      this.setState({ visible: this.props.visible });
    }
  }

  componentWillUnmount = () => {
    if (this.props.visible) {
      modalWillHide();
    }
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  }

  renderBackdrop = () => {
    if (this.state.visible || this.state.transitioning) {
      return (
        <div
          className={cx('modal-backdrop', { show: this.state.visible })}
          onClick={this.props.onClickBackdrop}
          role="presentation"
          style={{ zIndex: 1040 + this.state.modalIndex }}
        />
      );
    }

    return null;
  }

  render = () => {
    const {
      wrapperProps,
      className,
      dialogClassName,
      visible,
      onClickBackdrop,
      children,
      ...other
    } = this.props;

    return (
      <div {...wrapperProps} >
        <div
          className={cx('modal', { show: this.state.visible }, className)}
          style={{
            display: ((this.state.visible || this.state.transitioning) ? 'block' : 'none'),
            zIndex: 1040 + this.state.modalIndex + 1,
          }}
          role="dialog"
          aria-hidden={!this.state.visible}
          tabIndex="-1"
          onClick={onClickBackdrop}
          {...other}
        >
          <div className={cx('modal-dialog', dialogClassName)} role="document" onClick={this.stopPropagation}>
            <div className={cx("modal-content")}> {children} </div>
          </div>
        </div>
        {this.renderBackdrop()}
      </div>
    );
  }
}

export default Modal;
