import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Header extends Component {
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
}
