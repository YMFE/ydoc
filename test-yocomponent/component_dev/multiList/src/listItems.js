import React, { PropTypes } from 'react';

export const PlanItem = ({ item, defaultValue = null, listValue }) => {
    const checked = listValue === item.value
        || listValue instanceof Array
            && (!!~listValue.indexOf(item.value)
                || listValue.length === 0 && defaultValue === item.value)
        || (listValue == null) && defaultValue === item.value;
    return <p className={checked ? 'checked' : null}>{item.name}</p>;
};

PlanItem.propTypes = {
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
