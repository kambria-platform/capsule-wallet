import React from 'react';
import PropTypes from 'prop-types';

// Setup CSS Module
import classNames from 'classnames/bind';
import style from 'Style/index.scss';
var cx = classNames.bind(style);

export const Button = (props) => {
  let className = cx("btn"), customStyle = {}, onClickFunc = null;
  switch (props.type) {
    case 'primary':
      className = cx(className, "btn-primary");
      break;
    case 'secondary':
      className = cx(className, "btn-secondary");
      break;
    case 'primary-gray':
      className = cx(className, "btn-primary-gray");
      break;
    case 'gray':
      className = cx(className, "btn-gray");
      break;
    case 'fb':
      className = cx(className, "btn-fb");
      break;
    case 'gg':
      className = cx(className, "btn-gg");
      break;
    default:
      break;
  }

  switch (props.size) {
    case 'lg':
      className = cx(className, "btn-lg");
      break;
    case 'sm':
      className = cx(className, "btn-sm");
      break;
    default:
      break;
  }

  if (props.className) {
    className = className.concat(props.className);
  }

  customStyle = props.customStyle ? props.customStyle : {};
  onClickFunc = props.onClick ? props.onClick : null;
  if (props.bgColor) customStyle.backgroundColor = props.bgColor;
  if (props.textColor) customStyle.color = props.textColor;

  return props.disabled ?
    <button className={className} style={customStyle} onClick={onClickFunc} disabled>
      {props.children}
    </button> :
    <button className={className} style={customStyle} onClick={onClickFunc}>
      {props.children}
    </button>;
};

// export const IconButton = (props) =>
//   props.disabled ?
//     <button className={cx("btn", `btn-${props.type}`, `btn-${props.size}`)} style={{ color: props.color, backgroundColor: props.bgColor }} disabled>
//       <FontAwesomeIcon icon={props.icon} /> {props.children}
//     </button> :
//     <button className={cx("btn", `btn-${props.type}`, `btn-${props.size}`)} style={{ color: props.color, backgroundColor: props.bgColor }} onClick={props.onButtonClick}>
//       <FontAwesomeIcon icon={props.icon} /> {props.children}
//     </button>;

// export const ModalButton = (props) =>
//   props.disabled ?
//     <button className={cx("btn", `btn-${props.type}`, `btn-${props.size}`)} style={{ color: props.color, backgroundColor: props.bgColor }} data-toggle="modal" data-target="props.modalTarget" disabled>
//       {props.children}
//     </button> :
//     <button className={cx("btn", `btn-${props.type}`, `btn-${props.size}`)} style={{ color: props.color, backgroundColor: props.bgColor }} data-toggle="modal" data-target="props.modalTarget">
//       {props.children}
//     </button>;

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  modalTarget: PropTypes.string,
  customStyle: PropTypes.object,
  textColor: PropTypes.string,
  onClickFunc: PropTypes.func,
  disabled: PropTypes.bool,
  bgColor: PropTypes.string
};
