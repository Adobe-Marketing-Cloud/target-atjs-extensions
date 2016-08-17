var SampleComponent = React.createClass({
  render: function () {
    return React.createElement(
      "div",
      { className: "valign-wrapper" },
      React.createElement(
        "div",
        { className: "card-content white-text" },
        React.createElement(
          "span",
          { className: "card-title" },
          "profile 1"
        ),
        React.createElement(
          "div",
          { className: "card-panel grey lighten-5 z-depth-1 row valign-wrapper" },
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
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'",
              React.createElement("br", null),
              "Aenean commodo ligula eget dolor. Aenean massa.",
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

var Mbox = adobe.target.ext.react.createMboxComponent();

var App = React.createClass({
  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(SampleComponent, null),
      React.createElement(
        Mbox,
        { className: "row", "data-mbox": "simpleDirective" },
        React.createElement(
          "h4",
          null,
          "Unfortunately, we have no offer for the moment."
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));