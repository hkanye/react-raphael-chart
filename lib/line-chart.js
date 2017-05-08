'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var _require = require('react-raphael'),
    Raphael = _require.Raphael,
    Paper = _require.Paper,
    Set = _require.Set,
    Text = _require.Text,
    Rect = _require.Rect,
    Path = _require.Path,
    Circle = _require.Circle;

var Axis = require('./base/Axis');
var Utils = require('./utils');

var LineSerise = function (_React$Component) {
	_inherits(LineSerise, _React$Component);

	function LineSerise() {
		_classCallCheck(this, LineSerise);

		return _possibleConstructorReturn(this, (LineSerise.__proto__ || Object.getPrototypeOf(LineSerise)).apply(this, arguments));
	}

	_createClass(LineSerise, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			var repeat = this.props.repeat;
			var lastSerise = this.props.serise;
			var nextSerise = nextProps.serise;

			if (!lastSerise || !lastSerise.data || !nextSerise || !nextSerise.data) return false;
			if (!repeat) {
				if (lastSerise.data.length == nextSerise.data.length) {
					var similarSum = 0;
					for (var i = 0; i < lastSerise.data.length; i++) {
						var lastPoint = lastSerise.data[i];
						var nextPoint = nextSerise.data[i];
						if (lastPoint.x == nextPoint.x && lastPoint.y == nextPoint.y) {
							similarSum = similarSum + 1;
						}
					}
				}
				if (lastSerise.data.length == similarSum) return false;
			}
			return true;
		}
	}, {
		key: 'getDefaultPath',
		value: function getDefaultPath() {
			var _props = this.props,
			    width = _props.width,
			    height = _props.height,
			    xAxis = _props.xAxis,
			    yAxis = _props.yAxis;

			return ["M", yAxis.width - 15, height - xAxis.height + 15, "L", width - 15, height - xAxis.height + 15];
		}
	}, {
		key: 'getLinePath',
		value: function getLinePath() {
			var data = this.getDrawPoints();
			var path = [];
			if (data.length >= 1) {
				path.push(["M", data[0]._x, data[0]._y]);
				for (var i = 1; i < data.length; i++) {
					path.push(["L", data[i]._x, data[i]._y]);
				}
			} else {
				path.push(["M", data[0]._x || 0, data[0]._y || 0]);
			}
			return path;
		}
	}, {
		key: 'getCurvePath',
		value: function getCurvePath(first) {
			var data = this.getDrawPoints();
			var path = [];
			if (data.length == 2) {
				return ["M", first.x, first.y, "L", data[1]._x, data[1]._y, "Z"];
			}
			var controls = Utils.getControlPoint(data);
			var pathData = ["M" + first.x + "," + first.y + "C" + first.x + "," + first.y + " " + controls[0].x + "," + controls[0].y + " " + data[1]._x + "," + data[1]._y];
			for (var i = 1; i < data.length - 1; i++) {
				if (i == data.length - 2) {
					pathData.push("C" + controls[controls.length - 1].x + "," + controls[controls.length - 1].y + " " + data[i + 1]._x + "," + data[i + 1]._y + " " + data[i + 1]._x + "," + data[i + 1]._y);
				} else {
					var control1 = controls[i * 2 - 1],
					    control2 = controls[i * 2];
					pathData.push("C" + control1.x + "," + control1.y + " " + control2.x + "," + control2.y + " " + data[i + 1]._x + "," + data[i + 1]._y);
				}
			}
			return pathData;
		}
	}, {
		key: 'getDrawPoints',
		value: function getDrawPoints() {
			var _props2 = this.props,
			    width = _props2.width,
			    height = _props2.height,
			    serise = _props2.serise,
			    xAxis = _props2.xAxis,
			    yAxis = _props2.yAxis;

			var data = Utils.getLineData({ width: width, height: height, xAxis: xAxis, yAxis: yAxis }, serise);
			return data.Values;
		}
	}, {
		key: 'render',
		value: function render() {
			var _props3 = this.props,
			    serise = _props3.serise,
			    animate = _props3.animate;


			if (serise.data.length == 0) {
				return React.createElement(Set, null);
			}

			var data = this.getDrawPoints();
			var first = {
				x: data[0] ? data[0]._x : 0,
				y: data[0] ? data[0]._y : 0
			};

			if (data.length == 1) {
				return React.createElement(Circle, { r: '4', x: first.x, y: first.y, attr: { "fill": serise.color, "stroke": serise.color, "stroke-width": serise.thickness } });
			}

			var defaultPath = this.getDefaultPath();
			var path = !!serise.curve ? this.getLinePath() : this.getCurvePath(first);
			var animation = Raphael.animation({ "path": path }, 500, "<>");
			if (animate) {
				defaultPath = path;
				animation = null;
			}
			return React.createElement(
				Set,
				null,
				React.createElement(Path, { d: defaultPath, attr: { "stroke": serise.color, "stroke-width": serise.thickness }, animate: animation })
			);
		}
	}]);

	return LineSerise;
}(React.Component);

LineSerise.propTypes = {
	serise: React.PropTypes.shape({
		color: React.PropTypes.string,
		thickness: React.PropTypes.number,
		curve: React.PropTypes.bool,
		data: React.PropTypes.array
	}),
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	xAxis: React.PropTypes.object,
	yAxis: React.PropTypes.object
};

var LineChart = function (_React$Component2) {
	_inherits(LineChart, _React$Component2);

	function LineChart(props) {
		_classCallCheck(this, LineChart);

		return _possibleConstructorReturn(this, (LineChart.__proto__ || Object.getPrototypeOf(LineChart)).call(this, props));
	}

	_createClass(LineChart, [{
		key: 'getSerisePointsByIndex',
		value: function getSerisePointsByIndex(index) {
			var points = [];
			var _props4 = this.props,
			    serises = _props4.serises,
			    width = _props4.width,
			    height = _props4.height,
			    xAxis = _props4.xAxis,
			    yAxis = _props4.yAxis;

			var serise = serises[index];
			var data = Utils.getLineData({ width: width, height: height, xAxis: xAxis, yAxis: yAxis }, serise);
			return data.Values;
		}
	}, {
		key: 'getSeriseAllPoints',
		value: function getSeriseAllPoints() {
			var serises = this.props.serises;

			var points = [];
			for (var i = 0; i < serises.length; i++) {
				points = points.concat(this.getSerisePointsByIndex(i));
			}
			return points;
		}
	}, {
		key: 'render',
		value: function render() {
			var _props5 = this.props,
			    width = _props5.width,
			    height = _props5.height,
			    serises = _props5.serises,
			    xAxis = _props5.xAxis,
			    yAxis = _props5.yAxis,
			    grid = _props5.grid,
			    children = _props5.children,
			    others = _objectWithoutProperties(_props5, ['width', 'height', 'serises', 'xAxis', 'yAxis', 'grid', 'children']);

			return React.createElement(
				Paper,
				_extends({ width: width, height: height }, others),
				React.createElement(Axis, { type: 'line', width: width, height: height, xAxis: xAxis, yAxis: yAxis, grid: grid }),
				serises.map(function (ele, pos) {
					return React.createElement(LineSerise, { key: pos, ref: "serise" + pos, width: width, height: height, serise: ele, xAxis: xAxis, yAxis: yAxis });
				}),
				children
			);
		}
	}]);

	return LineChart;
}(React.Component);

LineChart.propTypes = {
	width: React.PropTypes.number,
	height: React.PropTypes.number,
	serises: React.PropTypes.arrayOf(React.PropTypes.object),
	xAxis: React.PropTypes.shape({
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		interval: React.PropTypes.number,
		formatter: React.PropTypes.func,
		width: React.PropTypes.number
	}),
	yAxis: React.PropTypes.shape({
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		interval: React.PropTypes.number,
		formatter: React.PropTypes.func,
		width: React.PropTypes.number
	}),
	grid: React.PropTypes.shape({
		color: React.PropTypes.string,
		thickness: React.PropTypes.number,
		showYGrid: React.PropTypes.bool,
		showXGrid: React.PropTypes.bool
	}),
	animate: React.PropTypes.bool,
	repeat: React.PropTypes.bool
};
LineChart.defaultProps = {
	width: 600,
	height: 400,
	serises: [],
	xAxis: {
		min: 0,
		max: 10,
		interval: 1,
		formatter: null,
		height: 60
	},
	yAxis: {
		min: 0,
		max: 100,
		interval: 10,
		formatter: null,
		width: 60
	},
	grid: {
		color: "#ccc",
		thickness: 1,
		showYGrid: false,
		showXGrid: true
	},
	animate: true,
	repeat: false
};

module.exports = LineChart;