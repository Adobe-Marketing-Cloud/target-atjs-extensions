"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRedirect = ReactRouter.IndexRedirect;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;
var withRouter = ReactRouter.withRouter;

var Mbox = adobe.target.ext.react.createMboxComponent();

var Header = React.createClass({
  displayName: "Header",
  render: function render() {
    return React.createElement(
      "nav",
      { className: "navbar navbar-inverse navbar-fixed-top", role: "navigation",
        style: { 'background-color': this.props.recsSettings.headerBackgroundColor } },
      React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "div",
          { className: "navbar-header" },
          React.createElement(
            "button",
            { type: "button", className: "navbar-toggle", "data-toggle": "collapse", "data-target": "#bs-example-navbar-collapse-1" },
            React.createElement(
              "span",
              { className: "sr-only" },
              "Toggle navigation"
            ),
            React.createElement("span", { className: "icon-bar" }),
            React.createElement("span", { className: "icon-bar" }),
            React.createElement("span", { className: "icon-bar" })
          ),
          React.createElement(
            Link,
            { className: "navbar-brand1", to: "/list" },
            React.createElement("img", { src: this.props.recsSettings.shopLogoUrl,
              alt: this.props.recsSettings.shopName, height: "50" })
          )
        )
      )
    );
  }
});

function getCurrentLocation(pathname) {
  return pathname.substr(pathname.lastIndexOf('/') + 1).trim();
}

var CategoryInput = React.createClass({
  displayName: "CategoryInput",
  getInitialState: function getInitialState() {
    return {
      currLoc: ''
    };
  },
  updateInput: function updateInput(currentPath) {
    var currentLocation = getCurrentLocation(currentPath);
    if (this.state.currLoc !== currentLocation) {
      this.setState({ currLoc: currentLocation });
    }
  },
  render: function render() {
    return React.createElement("input", { type: "text", className: "form-control", size: "60",
      value: $.inArray(this.state.currLoc, this.props.categories) >= 0 ? this.state.currLoc : '',
      readonly: "readonly" });
  }
});

var SessionList = withRouter(React.createClass({
  displayName: "SessionList",
  componentDidMount: function componentDidMount() {
    console.log('SessionList mounted');
    this.refs.categoryInput.updateInput(this.props.location.pathname);
  },
  componentDidUpdate: function componentDidUpdate() {
    console.log('SessionList updated');
    this.refs.categoryInput.updateInput(this.props.location.pathname);
    var currentLocation = getCurrentLocation(this.props.location.pathname);
    if (currentLocation === 'list' && this.props.recsSettings.categories[0]) {
      this.props.router.push("/category/" + this.props.recsSettings.categories[0]);
    }
  },
  render: function render() {
    var categories = this.props.recsSettings.categories.map(function (category) {
      return React.createElement(
        Link,
        { to: "/category/" + category, className: "list-group-item" },
        category
      );
    });
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-md-3" },
        React.createElement(
          "div",
          { className: "list-group" },
          categories
        ),
        React.createElement("hr", null),
        React.createElement(
          Mbox,
          { "data-mbox": "recsDemoLeftBar" },
          React.createElement("img", { src: "/img/" + this.props.recsSettings.clientCode + "/left_default.jpg" })
        )
      ),
      React.createElement(
        "div",
        { className: "col-md-9" },
        React.createElement(
          "form",
          { className: "form-inline" },
          React.createElement(CategoryInput, { ref: "categoryInput", categories: this.props.recsSettings.categories })
        ),
        React.createElement("hr", null),
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            Mbox,
            { "data-mbox": "recsDemoHero" },
            React.createElement("img", { src: "/img/" + this.props.recsSettings.clientCode + "/list_default.jpeg" })
          )
        ),
        React.createElement("hr", null),
        React.createElement(
          "div",
          { className: "row" },
          this.props.children
        )
      )
    );
  }
}));

var SessionCategory = React.createClass({
  displayName: "SessionCategory",
  getInitialState: function getInitialState() {
    return {
      products: []
    };
  },
  fetchCategory: function fetchCategory(component) {
    if (component.state.currentCategory !== component.props.params.category) {
      $.getJSON('/api/category', { category: component.props.params.category }, function (data) {
        component.setState({
          currentCategory: component.props.params.category,
          products: data
        });
      });
    }
  },
  componentDidMount: function componentDidMount() {
    console.log('SessionCategory mounted');
    this.fetchCategory(this);
  },
  componentWillReceiveProps: function componentWillReceiveProps(newProps) {
    console.log('SessionCategory componentWillReceiveProps');
    if (this.state.currentCategory !== newProps.params.category) {
      this.setState({ products: [] });
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    console.log('SessionCategory updated');
    this.fetchCategory(this);
  },
  render: function render() {
    console.log('Rendering products: ', this.state.products.length);
    var productsList = this.state.products.map(function (product) {
      var productValue = product.value > 0 ? React.createElement(
        "h4",
        { className: "pull-right" },
        product.value
      ) : React.createElement("span", null);
      var productMessage = product.message.length > 0 ? React.createElement(
        "p",
        null,
        product.message
      ) : React.createElement("span", null);
      return React.createElement(
        "div",
        { className: "col-sm-4 col-lg-4 col-md-4" },
        React.createElement(
          "div",
          { className: "thumbnail" },
          React.createElement("img", { src: product.thumbnailUrl, width: "120", height: "120" }),
          React.createElement(
            "div",
            { className: "caption" },
            productValue,
            React.createElement(
              "h5",
              null,
              React.createElement(
                Link,
                { to: "/product/" + product.id },
                product.name
              )
            ),
            productMessage,
            React.createElement(
              "div",
              { className: "text-muted" },
              product.brand
            )
          ),
          React.createElement(
            "div",
            { className: "ratings" },
            React.createElement(
              "p",
              { className: "pull-right" },
              product.reviewCount,
              " reviews"
            ),
            React.createElement(
              "p",
              null,
              React.createElement("span", { className: "glyphicon glyphicon-star" }),
              React.createElement("span", { className: "glyphicon glyphicon-star" }),
              React.createElement("span", { className: "glyphicon glyphicon-star" }),
              React.createElement("span", { className: "glyphicon glyphicon-star" }),
              React.createElement("span", { className: "glyphicon glyphicon-star" })
            )
          )
        )
      );
    });
    return React.createElement(
      "div",
      null,
      productsList
    );
  }
});

var SessionProduct = React.createClass({
  displayName: "SessionProduct",
  getInitialState: function getInitialState() {
    return {
      product: {
        categories: []
      }
    };
  },
  componentDidMount: function componentDidMount() {
    console.log('SessionProduct mounted');
    var component = this;
    $.getJSON('/api/product', { productId: component.props.params.productId }, function (data) {
      component.setState({
        product: data
      });
    });
  },
  render: function render() {
    var categories = this.state.product.categories.map(function (category) {
      return React.createElement(
        "span",
        null,
        React.createElement(
          Link,
          { to: "/category/" + category },
          category
        )
      );
    });
    var productValue = this.state.product.value && this.state.product.value > 0 ? React.createElement(
      "h4",
      { className: "text-danger" },
      this.state.product.value,
      " - ",
      this.state.product.custom_usedOrNew
    ) : React.createElement("span", null);
    return React.createElement(
      "div",
      { className: "row", style: { 'padding-bottom': '5em' } },
      React.createElement(
        "div",
        { className: "col-lg-12" },
        React.createElement(
          "div",
          { className: "media" },
          React.createElement(
            "div",
            { className: "media-left" },
            React.createElement("img", { src: this.state.product.thumbnailUrl, style: { width: '300px' } })
          ),
          React.createElement(
            "div",
            { className: "media-body" },
            React.createElement(
              "h4",
              null,
              this.state.product.title
            ),
            React.createElement(
              "p",
              null,
              this.state.product.message
            ),
            productValue,
            React.createElement(
              "div",
              { className: "text-muted" },
              "Brand: ",
              this.state.product.brand
            ),
            React.createElement(
              "div",
              { className: "text-muted" },
              "Category:",
              categories
            )
          )
        )
      )
    );
  }
});

var App = React.createClass({
  displayName: "App",
  getInitialState: function getInitialState() {
    var currentLocation = getCurrentLocation(this.props.location.pathname);
    return {
      recsSettings: {
        headerBackgroundColor: 'white',
        shopLogoUrl: '',
        shopName: '',
        categories: [],
        clientCode: 'sonynetqa'
      },
      currLoc: currentLocation
    };
  },
  componentDidMount: function componentDidMount() {
    console.log('App mounted');
    var component = this;
    $.getJSON('/api/settings', function (data) {
      component.setState({ recsSettings: data });
    });
  },
  componentDidUpdate: function componentDidUpdate() {
    console.log('App updated');
    var currentLocation = getCurrentLocation(this.props.location.pathname);
    if (this.state.currLoc !== currentLocation) {
      this.setState({ currLoc: currentLocation });
    }
  },
  render: function render() {
    var mboxAttrs = {
      "data-mbox": "similarity-box-1",
      "data-entity.id": this.state.currLoc
    };
    return React.createElement(
      "div",
      null,
      React.createElement(Header, { recsSettings: this.state.recsSettings }),
      React.createElement(
        "div",
        { className: "container" },
        this.props.children && React.cloneElement(this.props.children, {
          recsSettings: this.state.recsSettings
        })
      ),
      React.createElement(
        Mbox,
        _extends({ style: { 'margin-top': '10px', width: '100%' },
          "data-mbox": "similarity-box-1"
        }, mboxAttrs),
        "Default content"
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
    React.createElement(IndexRedirect, { to: "/list" }),
    React.createElement(
      Route,
      { path: "/list", component: SessionList },
      React.createElement(Route, { path: "/category/:category", component: SessionCategory })
    ),
    React.createElement(Route, { path: "/product/:productId", component: SessionProduct })
  )
), document.getElementById('app'));