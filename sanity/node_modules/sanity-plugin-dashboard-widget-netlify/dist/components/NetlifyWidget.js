"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NetlifyWidget;

var _react = _interopRequireDefault(require("react"));

var _SiteList = _interopRequireDefault(require("./SiteList"));

var _dashboard = require("@sanity/dashboard");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _ui = require("@sanity/ui");

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ContentCard = (0, _styledComponents.default)(_ui.Card)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  min-height: 66px;\n"])));

function NetlifyWidget(props) {
  var netlifySitesUrl = 'https://app.netlify.com/account/sites';
  var title = props.title,
      description = props.description,
      isLoading = props.isLoading,
      sites = props.sites,
      onDeploy = props.onDeploy;

  var footer = /*#__PURE__*/_react.default.createElement(_ui.Flex, {
    direction: "column",
    align: "stretch"
  }, /*#__PURE__*/_react.default.createElement(_ui.Button, {
    as: "a",
    href: isLoading ? undefined : netlifySitesUrl,
    disabled: isLoading,
    paddingX: 2,
    paddingY: 4,
    mode: "bleed",
    tone: "primary",
    text: "Manage sites at Netlify",
    loading: isLoading,
    target: "_blank"
  }));

  return /*#__PURE__*/_react.default.createElement(_dashboard.DashboardWidget, {
    header: title,
    footer: footer
  }, /*#__PURE__*/_react.default.createElement(ContentCard, {
    paddingY: 1
  }, description && /*#__PURE__*/_react.default.createElement(_ui.Box, {
    paddingY: 3,
    paddingX: 3
  }, /*#__PURE__*/_react.default.createElement(_ui.Text, {
    as: "p",
    size: 1,
    muted: true
  }, /*#__PURE__*/_react.default.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: description
    }
  }))), /*#__PURE__*/_react.default.createElement(_SiteList.default, {
    isLoading: isLoading,
    onDeploy: onDeploy,
    sites: sites
  })));
}
//# sourceMappingURL=NetlifyWidget.js.map