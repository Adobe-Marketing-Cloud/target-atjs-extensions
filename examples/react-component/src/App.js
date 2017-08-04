import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import createTargetComponent from '@adobe/target-react-component';
const Target = createTargetComponent(React);

class App extends Component {
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
          <Target className="row" data-mbox="simpleDirective">
            <h4>
              Unfortunately, we have no offer for the moment.
            </h4>
          </Target>
        </div>
      </div>
    );
  }
}

export default App;
