import React, { Component } from 'react';

export default class View1 extends Component {
  getDefaultProps() {
    return {
      message: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
      'Aenean commodo ligula eget dolor. Aenean massa.'
    }
  }

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
}
