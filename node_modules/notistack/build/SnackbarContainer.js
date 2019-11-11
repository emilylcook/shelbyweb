'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styles = require('@material-ui/core/styles');

var _constants = require('./utils/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styles = function styles(theme) {
    return {
        root: _defineProperty({
            boxSizing: 'border-box',
            display: 'flex',
            maxHeight: '100%',
            maxWidth: '100%',
            position: 'fixed',
            flexDirection: 'column',
            zIndex: theme.zIndex.snackbar,
            height: 'auto',
            width: 'auto',
            minWidth: 288,
            transition: theme.transitions.create(['top', 'right', 'bottom', 'left'], { easing: 'ease' })
        }, theme.breakpoints.down('xs'), {
            left: '0 !important',
            right: '0 !important',
            width: '100%'
        }),
        reverseColumns: { flexDirection: 'column-reverse' },

        top: { top: _constants.SNACKBAR_INDENTS.view.default - _constants.SNACKBAR_INDENTS.snackbar.default },
        topDense: { top: _constants.SNACKBAR_INDENTS.view.dense - _constants.SNACKBAR_INDENTS.snackbar.dense },

        bottom: { bottom: _constants.SNACKBAR_INDENTS.view.default - _constants.SNACKBAR_INDENTS.snackbar.default },
        bottomDense: { bottom: _constants.SNACKBAR_INDENTS.view.dense - _constants.SNACKBAR_INDENTS.snackbar.dense },

        left: { left: _constants.SNACKBAR_INDENTS.view.default },
        leftDense: { left: _constants.SNACKBAR_INDENTS.view.dense },

        right: { right: _constants.SNACKBAR_INDENTS.view.default },
        rightDense: { right: _constants.SNACKBAR_INDENTS.view.dense },

        center: _defineProperty({}, theme.breakpoints.up('md'), {
            left: '50%',
            transform: 'translateX(-50%)'
        })
    };
};

var SnackbarContainer = _react2.default.memo(function (props) {
    var classes = props.classes,
        className = props.className,
        anchorOrigin = props.anchorOrigin,
        dense = props.dense,
        other = _objectWithoutProperties(props, ['classes', 'className', 'anchorOrigin', 'dense']);

    var combinedClassname = (0, _classnames2.default)(classes.root, classes[anchorOrigin.vertical], classes[anchorOrigin.horizontal], classes['' + anchorOrigin.vertical + (dense ? 'Dense' : '')], classes['' + anchorOrigin.horizontal + (dense ? 'Dense' : '')], _defineProperty({}, classes.reverseColumns, anchorOrigin.vertical === 'bottom'), className);

    return _react2.default.createElement('div', _extends({ className: combinedClassname }, other));
});

process.env.NODE_ENV !== "production" ? SnackbarContainer.propTypes = {
    classes: _propTypes2.default.object.isRequired,
    className: _propTypes2.default.string,
    dense: _propTypes2.default.bool.isRequired,
    anchorOrigin: _propTypes2.default.shape({
        horizontal: _propTypes2.default.oneOf(['left', 'center', 'right']).isRequired,
        vertical: _propTypes2.default.oneOf(['top', 'bottom']).isRequired
    })
} : void 0;

exports.default = (0, _styles.withStyles)(styles)(SnackbarContainer);