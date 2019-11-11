'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCollapseClasses = exports.getSnackbarClasses = exports.getTransitionDirection = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _constants = require('../utils/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DIRECTION = {
    right: 'left',
    left: 'right',
    bottom: 'up',
    top: 'down'
};

var getTransitionDirection = exports.getTransitionDirection = function getTransitionDirection(anchorOrigin) {
    if (anchorOrigin.horizontal !== 'center') {
        return DIRECTION[anchorOrigin.horizontal];
    }
    return DIRECTION[anchorOrigin.vertical];
};

/**
 * Filter classes object and return keys that are allowed in material-ui snackbar classes prop
 */
var getSnackbarClasses = exports.getSnackbarClasses = function getSnackbarClasses(classes) {
    var snackbarMuiClasses = Object.keys(classes).filter(function (key) {
        return _constants.allClasses.mui[key] !== undefined;
    }).reduce(function (obj, key) {
        return _extends({}, obj, _defineProperty({}, key, classes[key]));
    }, {});

    return _extends({}, snackbarMuiClasses, {
        root: (0, _classnames2.default)(snackbarMuiClasses.root, classes.wrappedRoot)
    });
};

var getCollapseClasses = exports.getCollapseClasses = function getCollapseClasses(classes, dense) {
    return {
        container: classes.collapseContainer,
        wrapper: (0, _classnames2.default)(classes.collapseWrapper, _defineProperty({}, classes.collapseWrapperDense, dense))
    };
};