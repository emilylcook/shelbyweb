'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _SnackbarContext = require('./SnackbarContext');

var _SnackbarContext2 = _interopRequireDefault(_SnackbarContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var _useContext = (0, _react.useContext)(_SnackbarContext2.default),
        enqueueSnackbar = _useContext.enqueueSnackbar,
        closeSnackbar = _useContext.closeSnackbar;

    return {
        enqueueSnackbar: enqueueSnackbar,
        closeSnackbar: closeSnackbar
    };
};