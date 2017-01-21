const SUFFIXES = /(-gt)?-(sm|md|lg|print)/g;
const WHITESPACE = /\s+/g;

const FLEX_OPTIONS = ['grow', 'initial', 'auto', 'none', 'noshrink', 'nogrow'];
const LAYOUT_OPTIONS = ['row', 'column'];
const ALIGNMENT_MAIN_AXIS = ['', 'start', 'center', 'end', 'stretch', 'space-around', 'space-between'];
const ALIGNMENT_CROSS_AXIS = ['', 'start', 'center', 'end', 'stretch'];


const PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;

const BREAKPOINTS = ['', 'xs', 'gt-xs', 'sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg', 'xl', 'print'];
const API_WITH_VALUES = ['layout', 'flex', 'flex-order', 'flex-offset', 'layout-align'];
const API_NO_VALUES = ['show', 'hide', 'layout-padding', 'layout-margin'];


/**
 * supplant() method from Crockford's `Remedial Javascript`
 * Equivalent to use of $interpolate; without dependency on
 * interpolation symbols and scope. Note: the '{<token>}' can
 * be property names, property chains, or array indices.
 */
const supplant = (template, values, pattern) => {
    pattern = pattern || /\{([^\{\}]*)\}/g;
    return template.replace(pattern, (a, b) => {
        const p = b.split('.');
        let r = values;
        try {
            for (const s in p) {
                if (p.hasOwnProperty(s)) {
                    r = r[p[s]];
                }
            }
        } catch (e) {
            r = a;
        }
        return (typeof r === 'string' || typeof r === 'number') ? r : a;
    });
};

/**
 * See if the original value has interpolation symbols:
 * e.g.  flex-gt-md="{{triggerPoint}}"
 */
const needsInterpolation = ($interpolate, value) => (value || '').indexOf($interpolate.startSymbol()) > -1;


const getNormalizedAttrValue = (className, attrs, defaultVal) => {
    const normalizedAttr = attrs.$normalize(className);
    return attrs[normalizedAttr] ? attrs[normalizedAttr].replace(WHITESPACE, '-') : defaultVal || null;
};

const findIn = (item, list, replaceWith) => {
    item = replaceWith && item ? item.replace(WHITESPACE, replaceWith) : item;

    let found = false;
    if (item) {
        list.forEach((it) => {
            it = replaceWith ? it.replace(WHITESPACE, replaceWith) : it;
            found = found || (it === item);
        });
    }
    return found;
};

const extractAlignAxis = (attrValue) => {
    const axis = {
        main: 'start',
        cross: 'stretch',
    };

    let values;

    attrValue = (attrValue || '');

    if (attrValue.indexOf('-') === 0 || attrValue.indexOf(' ') === 0) {
        // For missing main-axis values
        attrValue = `none${attrValue}`;
    }

    values = attrValue.toLowerCase().trim().replace(WHITESPACE, '-').split('-');
    if (values.length && (values[0] === 'space')) {
        // for main-axis values of "space-around" or "space-between"
        values = [`${values[0]}-${values[1]}`, values[2]];
    }

    if (values.length > 0) axis.main = values[0] || axis.main;
    if (values.length > 1) axis.cross = values[1] || axis.cross;

    if (ALIGNMENT_MAIN_AXIS.indexOf(axis.main) < 0) axis.main = 'start';
    if (ALIGNMENT_CROSS_AXIS.indexOf(axis.cross) < 0) axis.cross = 'stretch';

    return axis;
};

/**
 * Converts snake_case to camelCase.
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
const directiveNormalize = name => name
    .replace(PREFIX_REGEXP, '')
    .replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => offset ? letter.toUpperCase() : letter);


/**
 * Centralize warnings for known flexbox issues (especially IE-related issues)
 */
const validateAttributeUsage = (className, attr, element, $log) => {
    let message,
        usage,
        url;
    const nodeName = element[0].nodeName.toLowerCase();

    switch (className.replace(SUFFIXES, '')) {
        case 'flex':
            if ((nodeName == 'md-button') || (nodeName == 'fieldset')) {
                // @see https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers
                // Use <div flex> wrapper inside (preferred) or outside

                usage = `<${nodeName} ${className}></${nodeName}>`;
                url = 'https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers';
                message = "Markup '{0}' may not work as expected in IE Browsers. Consult '{1}' for details.";

                $log.warn(supplant(message, [usage, url]));
            }
    }
};

/**
 * For the Layout attribute value, validate or replace with default
 * fallback value
 */
const validateAttributeValue = ($interpolate, className, value, updateFn) => {
    const origValue = value;

    if (!needsInterpolation($interpolate, value)) {
        switch (className.replace(SUFFIXES, '')) {
            case 'layout' :
                if (!findIn(value, LAYOUT_OPTIONS)) {
                    value = LAYOUT_OPTIONS[0];    // 'row';
                }
                break;

            case 'flex' :
                if (!findIn(value, FLEX_OPTIONS)) {
                    if (isNaN(value)) {
                        value = '';
                    }
                }
                break;

            case 'flex-offset' :
            case 'flex-order' :
                if (!value || isNaN(+value)) {
                    value = '0';
                }
                break;

            case 'layout-align' :
                var axis = extractAlignAxis(value);
                value = supplant('{main}-{cross}', axis);
                break;

            case 'layout-padding' :
            case 'layout-margin' :
            case 'layout-fill' :
            case 'layout-wrap' :
            case 'layout-nowrap' :
                value = '';
                break;
        }

        if (value != origValue) {
            (updateFn || angular.noop)(value);
        }
    }

    return value;
};

/**
 * Replace current attribute value with fallback value
 */
const buildUpdateFn = ($interpolate, element, className, attrs) => function updateAttrValue(fallback) {
    if (!needsInterpolation($interpolate, fallback)) {
        // Do not modify the element's attribute value; so
        // uses '<ui-layout layout="/api/sidebar.html" />' will not
        // be affected. Just update the attrs value.
        attrs[attrs.$normalize(className)] = fallback;
    }
};

/**
 * After link-phase, do NOT remove deprecated layout attribute selector.
 * Instead watch the attribute so interpolated data-bindings to layout
 * selectors will continue to be supported.
 *
 * $observe() the className and update with new class (after removing the last one)
 *
 * e.g. `layout="{{layoutDemo.direction}}"` will update...
 *
 * NOTE: The value must match one of the specified styles in the CSS.
 * For example `flex-gt-md="{{size}}`  where `scope.size == 47` will NOT work since
 * only breakpoints for 0, 5, 10, 15... 100, 33, 34, 66, 67 are defined.
 *
 */
const updateClassWithValue = ($interpolate, element, className) => {
    let lastClass;

    return function updateClassFn(newValue) {
        const value = validateAttributeValue($interpolate, className, newValue || '');
        if (angular.isDefined(value)) {
            if (lastClass) element.removeClass(lastClass);
            lastClass = !value ? className : `${className}-${value.replace(WHITESPACE, '-')}`;
            element.addClass(lastClass);
        }
    };
};

/**
 * Creates a directive registration function where a possible dynamic attribute
 * value will be observed/watched.
 * @param {string} className attribute name; eg `layout-gt-md` with value ="row"
 */
const attributeWithObserve = (className) => {
    return ['$interpolate', '$log', function ($interpolate, $log) {
        return {
            restrict: 'A',
            compile(element, attr) {
                // immediately replace static (non-interpolated) invalid values...
                validateAttributeUsage(className, attr, element, $log);

                validateAttributeValue($interpolate, className,
                    getNormalizedAttrValue(className, attr, ''),
                    buildUpdateFn($interpolate, element, className, attr),
                );

                return function (scope, element, attrs){
                    const updateFn = updateClassWithValue($interpolate, element, className, attrs);
                    const unwatch = attrs.$observe(attrs.$normalize(className), updateFn);

                    updateFn(getNormalizedAttrValue(className, attrs, ''));
                    scope.$on('$destroy', () => {
                        unwatch();
                    });
                };
            },
        };
    }];
};

const attributeWithoutValue = (className) => {
    return ['$interpolate', '$log', function ($interpolate, $log) {
        return {
            restrict: 'A',
            compile(element, attr) {
                validateAttributeValue($interpolate, className,
                    getNormalizedAttrValue(className, attr, ''),
                    buildUpdateFn($interpolate, element, className, attr),
                );

                translateToCssClass(null, element);

                // Use for postLink to account for transforms after ng-transclude.
                return translateToCssClass;
            },
        };
    }];

    /**
     * Add as transformed class selector, then
     * remove the deprecated attribute selector
     */
    function translateToCssClass(scope, element) {
        element.addClass(className);
    }
};


const buildCloakInterceptor = className => ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        priority: -10,   // run after normal ng-cloak
        compile(element) {
            // Re-add the cloak
            element.addClass(className);

            return function (scope, element) {
                // Wait while layout injectors configure, then uncloak
                // NOTE: $rAF does not delay enough... and this is a 1x-only event,
                //       $timeout is acceptable.
                $timeout(() => {
                    element.removeClass(className);
                }, 10, false);
            };
        },
    };
}];

const warnAttrNotSupported = (className) => {
    const parts = className.split('-');
    return ['$log', function ($log) {
        $log.warn(`${className}has been deprecated. Please use a \`${parts[0]}-gt-<xxx>\` variant.`);
        return angular.noop;
    }];
};


const module = angular.module('ss');

BREAKPOINTS.forEach((b) => {
    API_WITH_VALUES
        .map(name => b ? `${name}-${b}` : name)
        .forEach(x => module.directive(directiveNormalize(x), attributeWithObserve(x)));

    API_NO_VALUES
        .map(name => b ? `${name}-${b}` : name)
        .forEach(x => module.directive(directiveNormalize(x), attributeWithoutValue(x)));
});

module
    .directive('ngCloak', buildCloakInterceptor('ng-cloak'))

    .directive('layoutWrap', attributeWithoutValue('layout-wrap'))
    .directive('layoutNowrap', attributeWithoutValue('layout-nowrap'))
    .directive('layoutNoWrap', attributeWithoutValue('layout-no-wrap'))
    .directive('layoutFill', attributeWithoutValue('layout-fill'))

    // !! Deprecated attributes: use the `-lt` (aka less-than) notations

    .directive('layoutLtMd', warnAttrNotSupported('layout-lt-md', true))
    .directive('layoutLtLg', warnAttrNotSupported('layout-lt-lg', true))
    .directive('flexLtMd', warnAttrNotSupported('flex-lt-md', true))
    .directive('flexLtLg', warnAttrNotSupported('flex-lt-lg', true))

    .directive('layoutAlignLtMd', warnAttrNotSupported('layout-align-lt-md'))
    .directive('layoutAlignLtLg', warnAttrNotSupported('layout-align-lt-lg'))
    .directive('flexOrderLtMd', warnAttrNotSupported('flex-order-lt-md'))
    .directive('flexOrderLtLg', warnAttrNotSupported('flex-order-lt-lg'))
    .directive('offsetLtMd', warnAttrNotSupported('flex-offset-lt-md'))
    .directive('offsetLtLg', warnAttrNotSupported('flex-offset-lt-lg'))

    .directive('hideLtMd', warnAttrNotSupported('hide-lt-md'))
    .directive('hideLtLg', warnAttrNotSupported('hide-lt-lg'))
    .directive('showLtMd', warnAttrNotSupported('show-lt-md'))
    .directive('showLtLg', warnAttrNotSupported('show-lt-lg'));
