import React, { Component } from 'react';

export default class View2 extends Component {
  getDefaultProps() {
    return {
      message: 'Donec sodales sagittis magna. Sed consequat, leo eget' +
      'bibendum sodales, augue velit cursus nunc.'
    }
  }

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
}