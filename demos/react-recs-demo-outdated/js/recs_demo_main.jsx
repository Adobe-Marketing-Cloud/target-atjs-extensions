const Router = ReactRouter.Router
const Route = ReactRouter.Route
const IndexRedirect = ReactRouter.IndexRedirect
const Link = ReactRouter.Link
const hashHistory = ReactRouter.hashHistory
const withRouter = ReactRouter.withRouter

const Mbox = adobe.target.ext.react.createMboxComponent()

const Header = React.createClass({
  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation"
           style={{'background-color': this.props.recsSettings.headerBackgroundColor}}>
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand1" to="/list">
              <img src={this.props.recsSettings.shopLogoUrl}
                   alt={this.props.recsSettings.shopName} height="50" />
            </Link>
          </div>
        </div>
      </nav>
    )
  }
})

function getCurrentLocation(pathname) {
  return pathname.substr(pathname.lastIndexOf('/') + 1).trim();
}

const CategoryInput = React.createClass({
  getInitialState() {
    return {
      currLoc: ''
    }
  },
  updateInput(currentPath) {
    var currentLocation = getCurrentLocation(currentPath);
    if (this.state.currLoc !== currentLocation) {
      this.setState({currLoc: currentLocation});
    }
  },
  render() {
    return(
      <input type="text" className="form-control" size="60"
             value={$.inArray(this.state.currLoc, this.props.categories) >= 0 ? this.state.currLoc : ''}
             readonly="readonly"/>
    )
  }
})

const SessionList = withRouter(React.createClass({
  componentDidMount() {
      console.log('SessionList mounted');
      this.refs.categoryInput.updateInput(this.props.location.pathname);
    },

  componentDidUpdate() {
    console.log('SessionList updated');
    this.refs.categoryInput.updateInput(this.props.location.pathname);
    var currentLocation = getCurrentLocation(this.props.location.pathname);
    if (currentLocation === 'list' && this.props.recsSettings.categories[0]) {
      this.props.router.push(`/category/${this.props.recsSettings.categories[0]}`);
    }
  },

  render() {
    var categories = this.props.recsSettings.categories.map(category => {
      return (
        <Link to={`/category/${category}`} className="list-group-item">
          {category}
        </Link>
      );
    });
    return (
     <div className="row">
       <div className="col-md-3">
         <div className="list-group">
           {categories}
         </div>
         <hr/>
         <Mbox data-mbox="recsDemoLeftBar">
           <img src={`img/${this.props.recsSettings.clientCode}/left_default.jpg`}/>
         </Mbox>
       </div>
       <div className="col-md-9">
         <form className="form-inline">
           <CategoryInput ref="categoryInput" categories={this.props.recsSettings.categories}/>
         </form>
         <hr/>
         <div className="row">
           <Mbox data-mbox="recsDemoHero">
             <img src={`img/${this.props.recsSettings.clientCode}/list_default.jpeg`}/>
           </Mbox>
         </div>
         <hr/>
         <div className="row">
           {this.props.children}
         </div>
       </div>
     </div>
    )
  }
}))

const SessionCategory = React.createClass({
  getInitialState() {
    return {
      products: []
    }
  },

  fetchCategory(component) {
    if (component.state.currentCategory !== component.props.params.category) {
      $.getJSON(`json/${component.props.params.category}${Math.floor(Math.random() * 3) + 1}`, function (data) {
        component.setState({
          currentCategory: component.props.params.category,
          products: data
        })
      });
    }
  },

  componentDidMount() {
    console.log('SessionCategory mounted');
    this.fetchCategory(this);
  },

  componentWillReceiveProps(newProps) {
    console.log('SessionCategory componentWillReceiveProps');
    if (this.state.currentCategory !== newProps.params.category) {
      this.setState({products: []});
    }
  },

  componentDidUpdate() {
    console.log('SessionCategory updated');
    this.fetchCategory(this);
  },

  render() {
    console.log('Rendering products: ', this.state.products.length)
    var productsList = this.state.products.map(product => {
      var productValue = product.value > 0 ? <h4 className="pull-right">{product.value}</h4> : <span/>;
      var productMessage = product.message.length > 0 ? <p>{product.message}</p> : <span/>;
      return (
        <div className="col-sm-4 col-lg-4 col-md-4">
          <div className="thumbnail">
            <img src={product.thumbnailUrl} width="120" height="120" />
            <div className="caption">
              {productValue}
              <h5>
                <Link to={`/product/${product.id}`}>{product.name}</Link>
              </h5>
              {productMessage}
              <div className="text-muted">{product.brand}</div>
            </div>
            <div className="ratings">
              <p className="pull-right">{product.reviewCount} reviews</p>
              <p>
                <span className="glyphicon glyphicon-star"></span>
                <span className="glyphicon glyphicon-star"></span>
                <span className="glyphicon glyphicon-star"></span>
                <span className="glyphicon glyphicon-star"></span>
                <span className="glyphicon glyphicon-star"></span>
              </p>
            </div>
          </div>
        </div>
      );
    })
    return (
     <div>
       {productsList}
     </div>
)
  }
})

const SessionProduct = React.createClass({
  getInitialState() {
    return {
      product: {
        categories: []
      }
    }
  },

  componentDidMount() {
    console.log('SessionProduct mounted');
    const component = this;
    $.getJSON(`json/${component.props.params.productId}`, function (data) {
      component.setState({
        product: data
      })
    });
  },

  render() {
    var categories = this.state.product.categories.map(category => {
      return (
        <span>
          <Link to={`/category/${category}`}>{category}</Link>
        </span>
      )
    });
    var productValue = (this.state.product.value && this.state.product.value > 0) ?
      <h4 className="text-danger">{this.state.product.value} - {this.state.product.custom_usedOrNew}</h4> : <span/>;
   return (
     <div className="row" style={{'padding-bottom': '5em'}}>
       <div className="col-lg-12">
         <div className="media">
           <div className="media-left">
             <img src={this.state.product.thumbnailUrl} style={{width: '300px'}} />
           </div>
           <div className="media-body">
             <h4>{this.state.product.title}</h4>
             <p>{this.state.product.message}</p>
             {productValue}
             <div className="text-muted">Brand: {this.state.product.brand}</div>
             <div className="text-muted">Category:
               {categories}
             </div>
           </div>
         </div>
       </div>
     </div>
   )
  }
})

const App = React.createClass({
  getInitialState() {
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
    }
  },

  componentDidMount() {
    console.log('App mounted');
    const component = this;
    $.getJSON('json/settings', function(data) {
      component.setState({recsSettings: data})
    });
  },

  componentDidUpdate() {
    console.log('App updated');
    var currentLocation = getCurrentLocation(this.props.location.pathname);
    if (this.state.currLoc !== currentLocation) {
      this.setState({currLoc: currentLocation});
    }
  },

  render() {
    var mboxAttrs = {
      "data-mbox": "similarity-box-1",
      "data-entity.id": this.state.currLoc
    };
    return (
      <div>
        <Header recsSettings={this.state.recsSettings} />
        <div className="container">
          {this.props.children && React.cloneElement(this.props.children, {
            recsSettings: this.state.recsSettings
          })}
        </div>
        <Mbox style={{'margin-top': '10px', width: '100%'}}
              data-mbox="similarity-box-1"
              {...mboxAttrs}>
          Default content
        </Mbox>
      </div>
    )
  }
})

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/list" />
      <Route path="/list" component={SessionList}>
        <Route path="/category/:category" component={SessionCategory}/>
      </Route>
      <Route path="/product/:productId" component={SessionProduct}/>
    </Route>
  </Router>,
  document.getElementById('app')
)
