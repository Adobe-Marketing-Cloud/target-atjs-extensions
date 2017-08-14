import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import View1 from './View1';
import View2 from './View2';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/view1" />
      <Route path="/view1" component={View1}/>
      <Route path="/view2" component={View2}/>
    </Route>
  </Router>,
  document.getElementById('root'));
registerServiceWorker();
