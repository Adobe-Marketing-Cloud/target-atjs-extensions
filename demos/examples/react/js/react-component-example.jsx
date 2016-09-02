const Router = ReactRouter.Router
const Route = ReactRouter.Route
const IndexRedirect = ReactRouter.IndexRedirect
const Link = ReactRouter.Link
const hashHistory = ReactRouter.hashHistory

const Header = React.createClass({
  render() {
    return (
      <div className="container">
        <nav className="teal darken-1">
          <div className="nav-wrapper">
            <div className=" -pad-left1">
              <a href="../../"><i className="fa fa-home left"></i></a>
              <a className="brand-logo">React Component Example</a>
              <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to="/view1">View 1</Link></li>
                <li><Link to="/view2">View 2</Link></li>
              </ul>
              <ul className="side-nav" id="mobile-demo">
                <li><Link to="/view1">View 1</Link></li>
                <li><Link to="/view2">View 2</Link></li>
              </ul>
            </div>
          </div>
        </nav>
    </div>
    )
  }
})

const View1Component = React.createClass({
  getDefaultProps() {
    return {
      message: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
        'Aenean commodo ligula eget dolor. Aenean massa.'
    }
  },

  render() {
    return (
      <div className="card-content white-text">
        <span className="card-title">profile 1</span>
          <div className="card-panel grey lighten-5 z-depth-1">
            <div className="row valign-wrapper">
              <div className="col s3">
                <img src="https://placeholdit.imgix.net/~text?txtsize=23&txt=avatar1&w=100&h=100" alt=""
                     className="circle " />
              </div>
              <div className="col s9">
                <span className="black-text">
                  {this.props.message}
                  <div className="offer">
                    <h2>Welcome</h2>
                  </div>
                </span>
              </div>
            </div>
          </div>
      </div>
    )
  }
})

const View2Component = React.createClass({
  getDefaultProps() {
    return {
      message: 'Donec sodales sagittis magna. Sed consequat, leo eget' +
        'bibendum sodales, augue velit cursus nunc.'
    }
  },

  render() {
    return (
      <div className="card-content white-text">
        <span className="card-title">profile 2</span>
          <div className="card-panel grey lighten-5 z-depth-1">
            <div className="row valign-wrapper">
              <div className="col s3">
                <img src="https://placeholdit.imgix.net/~text?txtsize=23&txt=avatar1&w=100&h=100" alt=""
                     className="circle " />
              </div>
              <div className="col s9">
                <span className="black-text">
                  {this.props.message}
                  <div style={{'border-top': '1px solid lightblue', padding: '10px'}}>
                    <div className="offer">
                      We're glad you are here.
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
      </div>
    )
  }
})

const Mbox = adobe.target.ext.react.createMboxComponent()

const App = React.createClass({
  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <blockquote>In the example below, an Mbox React component's content is being replaced with a fetched Target offer</blockquote>
          <blockquote>
            Note: choose View1 or View2 from the top right corner.
          </blockquote>
          <ul className="collapsible" data-collapsible="accordion">
            <li>
              <div className="collapsible-header"><i className="fa fa-align-justify"></i>Description</div>
              <div className="collapsible-body">
                <p>
                  The Mbox React component can be used like this inside your React app's render() function:
                <pre>
                  &lt;<b>Mbox</b> <b>data-mbox="</b>simpleDirective<b>"</b>&gt;
                    Default content.
                  &lt;/<b>Mbox</b>&gt;
                </pre>
                  Additional Target params can also be passed as data attributes:
                <pre>
                  &lt;<b>Mbox</b> <b>data-mbox="</b>simpleDirective<b>" data-param1="</b>value1<b>" data-param2="</b>value2<b>" "data-timeout="</b>7000<b>"</b>&gt;
                    Default content.
                  &lt;/<b>Mbox</b>&gt;
                </pre>
                </p>
              </div>
            </li>
          </ul>
          <div className="valign-wrapper">
            { this.props.children }
          </div>
          <Mbox className="row" data-mbox="simpleDirective">
            <h4>
              Unfortunately, we have no offer for the moment.
            </h4>
          </Mbox>
        </div>
      </div>
    )
  }
})

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/view1" />
      <Route path="/view1" component={View1Component}/>
      <Route path="/view2" component={View2Component}/>
    </Route>
  </Router>,
  document.getElementById('app')
)
