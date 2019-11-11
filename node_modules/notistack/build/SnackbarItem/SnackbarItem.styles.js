'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('../utils/constants');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styles = function styles(theme) {
    return _extends({}, _constants.allClasses.mui, {
        base: {
            fontSize: '0.875rem',
            lineHeight: '1.46429em',
            fontWeight: theme.typography.fontWeightRegular,
            fontFamily: theme.typography.fontFamily,
            borderRadius: theme.shape.borderRadius
        },
        lessPadding: {
            paddingLeft: 8 * 2.5
        },
        variantSuccess: {
            backgroundColor: '#43a047' // green
        },
        variantError: {
            backgroundColor: '#d32f2f' // dark red
        },
        variantInfo: {
            backgroundColor: '#2979ff' // nice blue
        },
        variantWarning: {
            backgroundColor: '#ffa000' // amber
        },
        message: {
            display: 'flex',
            alignItems: 'center'
        },
        wrappedRoot: {
            position: 'relative',
            transform: 'translateX(0)',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        collapseContainer: _defineProperty({}, theme.breakpoints.down('xs'), {
            paddingLeft: typeof theme.spacing === 'function' ? theme.spacing(1) : theme.spacing.unit,
            paddingRight: typeof theme.spacing === 'function' ? theme.spacing(1) : theme.spacing.unit
        }),
        collapseWrapper: {
            transition: theme.transitions.create(['margin-bottom'], { easing: 'ease' }),
            marginTop: _constants.SNACKBAR_INDENTS.snackbar.default,
            marginBottom: _constants.SNACKBAR_INDENTS.snackbar.default
        },
        collapseWrapperDense: {
            marginTop: _constants.SNACKBAR_INDENTS.snackbar.dense,
            marginBottom: _constants.SNACKBAR_INDENTS.snackbar.dense
        }
    });
};

exports.default = styles;