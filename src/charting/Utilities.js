export const GUID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return `${s4() + s4()}-${s4()}-${s4()}-${
        s4()}-${s4()}${s4()}${s4()}`;
};

function _isObj(val) {
    return typeof val === 'object' && val !== null;
}

function _toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    return Object(val);
}

function _assignKey(to, from, key) {
    const val = from[key];

    if (val === undefined || val === null) {
        return;
    }

    if (Object.prototype.hasOwnProperty.call(to, key)) {
        if (to[key] === undefined || to[key] === null) {
            throw new TypeError(`Cannot convert undefined or null to object (${key})`);
        }
    }

    if (!Object.prototype.hasOwnProperty.call(to, key) || !_isObj(val)) {
        to[key] = val;
    } else {
        to[key] = _assign(Object(to[key]), from[key]);
    }
}

function _assign(to, from) {
    if (to === from) {
        return to;
    }

    from = Object(from);

    for (const key in from) {
        if (Object.prototype.hasOwnProperty.call(from, key)) {
            _assignKey(to, from, key);
        }
    }

    if (Object.getOwnPropertySymbols) {
        const symbols = Object.getOwnPropertySymbols(from);

        for (let i = 0; i < symbols.length; i++) {
            if (Object.prototype.propIsEnumerable.call(from, symbols[i])) {
                _assignKey(to, from, symbols[i]);
            }
        }
    }

    return to;
}

export function DeepAssign(target) {
    target = _toObject(target);

    for (let s = 1; s < arguments.length; s++) {
        _assign(target, arguments[s]);
    }

    return target;
}
