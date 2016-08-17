var SampleComponent = React.createClass({
  render: function () {
    return (
      <div className="valign-wrapper">
        <div className="card-content white-text">
          <span className="card-title">profile 1</span>
            <div className="card-panel grey lighten-5 z-depth-1 row valign-wrapper">
              <div className="col s3">
                <img src="https://placeholdit.imgix.net/~text?txtsize=23&txt=avatar1&w=100&h=100" alt=""
                     className="circle " />
              </div>
              <div className="col s9">
                <span className="black-text">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'<br/>
                  Aenean commodo ligula eget dolor. Aenean massa.
                  <div className="offer">
                    <h2>Welcome</h2>
                  </div>
                </span>
              </div>
            </div>
        </div>
      </div>
    );
  }
});

var Mbox = adobe.target.ext.react.createMboxComponent();

var App = React.createClass({
  render: function () {
    return (
      <div>
        <SampleComponent />
        <Mbox className="row" data-mbox="simpleDirective">
          <h4>
            Unfortunately, we have no offer for the moment.
          </h4>
        </Mbox>
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
