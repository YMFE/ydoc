import React, { PropTypes } from 'react';
const PersonalItem = (props) => {
    const className = ['item'];
    className.push(props.extraClass);
    return (
      <li className={className.join(' ')} style={props.style || null}>
        <img className="img" src={props.img} alt={props.text} />
        <div className="text">{props.text}</div>
      </li>
)};
PersonalItem.propTypes = {
    img: PropTypes.string,
    text: PropTypes.string,
    extraClass: PropTypes.string,
    style: PropTypes.Object
};
export default PersonalItem;
