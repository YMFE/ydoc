/**
 * Created by Ellery1 on 16/8/17.
 */
export default function deepClone(obj) {
    return Object.keys(obj).reduce((ret, key)=> {
        const val = obj[key];
        const type = typeof val;

        if (type === 'string'
            || type === 'number'
            || type === 'bool'
            || type === 'undefined') {
            ret[key] = val;
        }
        else if (type === 'object') {
            if (val === null) {
                ret[key] = val;
            }
            else {
                ret[key] = deepClone(val);
            }
        }

        return ret;
    }, {});
}
