import React, { PropTypes } from 'react';

export const ParentValue = ({
    item,
    listValue,
    effectValue,
    level
}) => {
    const classList = [];
    if (effectValue != null && effectValue[level] === item.value) classList.push('effect');
    if (listValue === item.value) classList.push('spread');
    return <p className={classList.join(' ')}>{item.name}</p>;
};

ParentValue.propTypes = {
    item: PropTypes.Object,
    multiValue: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
        PropTypes.number,
        PropTypes.null
    ]),
    defaultValue: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
        PropTypes.number,
        PropTypes.null
    ]),
    listValue: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
        PropTypes.number,
        PropTypes.null
    ]),
    effectValue: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
        PropTypes.number,
        PropTypes.null
    ]),
    level: PropTypes.number
};

export const CheckBoxItem = (props) => (
  <p>
    <label>
      <input
        type="checkBox"
        checked={
          props.listValue instanceof Array &&
          !!~props.listValue.indexOf(props.item.value)
        }
        value={props.item.value}
      />
      {props.item.name}
    </label>
  </p>
);

CheckBoxItem.propTypes = {
    listValue: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
        PropTypes.number,
        PropTypes.null
    ]),
    item: PropTypes.Object
};
