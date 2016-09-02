"use strict";

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRedirect = ReactRouter.IndexRedirect;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;

var Header = React.createClass({
  displayName: "Header",
  render: function render() {
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "nav",
        { className: "teal darken-1" },
        React.createElement(
          "div",
          { className: "nav-wrapper" },
          React.createElement(
            "div",
            { className: " -pad-left1" },
            React.createElement(
              "a",
              { href: "../../" },
              React.createElement("i", { className: "fa fa-home left" })
            ),
            React.createElement(
              "a",
              { className: "brand-logo" },
              "React Component Example"
            ),
            React.createElement(
              "a",
              { href: "#", "data-activates": "mobile-demo", className: "button-collapse" },
              React.createElement("i", { className: "mdi-navigation-menu" })
            ),
            React.createElement(
              "ul",
              { id: "nav-mobile", className: "right hide-on-med-and-down" },
              React.createElement(
                "li",
                null,
                React.createElement(
                  Link,
                  { to: "/view1" },
                  "View 1"
                )
              ),
              React.createElement(
                "li",
                null,
                React.createElement(
                  Link,
                  { to: "/view2" },
                  "View 2"
                )
              )
            ),
            React.createElement(
              "ul",
              { className: "side-nav", id: "mobile-demo" },
              React.createElement(
                "li",
                null,
                React.createElement(
                  Link,
                  { to: "/view1" },
                  "View 1"
                )
              ),
              React.createElement(
                "li",
                null,
                React.createElement(
                  Link,
                  { to: "/view2" },
                  "View 2"
                )
              )
            )
          )
        )
      )
    );
  }
});

var View1Component = React.createClass({
  displayName: "View1Component",
  getDefaultProps: function getDefaultProps() {
    return {
      message: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' + 'Aenean commodo ligula eget dolor. Aenean massa.'
    };
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "card-content white-text" },
      React.createElement(
        "span",
        { className: "card-title" },
        "profile 1"
      ),
      React.createElement(
        "div",
        { className: "card-panel grey lighten-5 z-depth-1" },
        React.createElement(
          "div",
          { className: "row valign-wrapper" },
          React.createElement(
            "div",
            { className: "col s3" },
            React.createElement("img", { src: "https://placeholdit.imgix.net/~text?txtsize=23&txt=avatar1&w=100&h=100", alt: "",
              className: "circle " })
          ),
          React.createElement(
            "div",
            { className: "col s9" },
            React.createElement(
              "span",
              { className: "black-text" },
              this.props.message,
              React.createElement(
                "div",
                { className: "offer" },
                React.createElement(
                  "h2",
                  null,
                  "Welcome"
                )
              )
            )
          )
        )
      )
    );
  }
});

var View2Component = React.createClass({
  displayName: "View2Component",
  getDefaultProps: function getDefaultProps() {
    return {
      message: 'Donec sodales sagittis magna. Sed consequat, leo eget' + 'bibendum sodales, augue velit cursus nunc.'
    };
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "card-content white-text" },
      React.createElement(
        "span",
        { className: "card-title" },
        "profile 2"
      ),
      React.createElement(
        "div",
        { className: "card-panel grey lighten-5 z-depth-1" },
        React.createElement(
          "div",
          { className: "row valign-wrapper" },
          React.createElement(
            "div",
            { className: "col s3" },
            React.createElement("img", { src: "https://placeholdit.imgix.net/~text?txtsize=23&txt=avatar1&w=100&h=100", alt: "",
              className: "circle " })
          ),
          React.createElement(
            "div",
            { className: "col s9" },
            React.createElement(
              "span",
              { className: "black-text" },
              this.props.message,
              React.createElement(
                "div",
                { style: { 'border-top': '1px solid lightblue', padding: '10px' } },
                React.createElement(
                  "div",
                  { className: "offer" },
                  "We're glad you are here."
                )
              )
            )
          )
        )
      )
    );
  }
});

var Mbox = adobe.target.ext.react.createMboxComponent();

var App = React.createClass({
  displayName: "App",
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Header, null),
      React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "blockquote",
          null,
          "In the example below, an Mbox React component's content is being replaced with a fetched Target offer"
        ),
        React.createElement(
          "blockquote",
          null,
          "Note: choose View1 or View2 from the top right corner."
        ),
        React.createElement(
          "ul",
          { className: "collapsible", "data-collapsible": "accordion" },
          React.createElement(
            "li",
            null,
            React.createElement(
              "div",
              { className: "collapsible-header" },
              React.createElement("i", { className: "fa fa-align-justify" }),
              "Description"
            ),
            React.createElement(
              "div",
              { className: "collapsible-body" },
              React.createElement(
                "p",
                null,
                "The Mbox React component can be used like this inside your React app's render() function:",
                React.createElement(
                  "pre",
                  null,
                  "<",
                  React.createElement(
                    "b",
                    null,
                    "Mbox"
                  ),
                  " ",
                  React.createElement(
                    "b",
                    null,
                    "data-mbox=\""
                  ),
                  "simpleDirective",
                  React.createElement(
                    "b",
                    null,
                    "\""
                  ),
                  "> Default content. </",
                  React.createElement(
                    "b",
                    null,
                    "Mbox"
                  ),
                  ">"
                ),
                "Additional Target params can also be passed as data attributes:",
                React.createElement(
                  "pre",
                  null,
                  "<",
                  React.createElement(
                    "b",
                    null,
                    "Mbox"
                  ),
                  " ",
                  React.createElement(
                    "b",
                    null,
                    "data-mbox=\""
                  ),
                  "simpleDirective",
                  React.createElement(
                    "b",
                    null,
                    "\" data-param1=\""
                  ),
                  "value1",
                  React.createElement(
                    "b",
                    null,
                    "\" data-param2=\""
                  ),
                  "value2",
                  React.createElement(
                    "b",
                    null,
                    "\" \"data-timeout=\""
                  ),
                  "7000",
                  React.createElement(
                    "b",
                    null,
                    "\""
                  ),
                  "> Default content. </",
                  React.createElement(
                    "b",
                    null,
                    "Mbox"
                  ),
                  ">"
                )
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "valign-wrapper" },
          this.props.children
        ),
        React.createElement(
          Mbox,
          { className: "row", "data-mbox": "simpleDirective" },
          React.createElement(
            "h4",
            null,
            "Unfortunately, we have no offer for the moment."
          )
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(
  Router,
  { history: hashHistory },
  React.createElement(
    Route,
    { path: "/", component: App },
    React.createElement(IndexRedirect, { to: "/view1" }),
    React.createElement(Route, { path: "/view1", component: View1Component }),
    React.createElement(Route, { path: "/view2", component: View2Component })
  )
), document.getElementById('app'));