/* global adobe, React */
'use strict';
import {appendMboxClass} from './at-react-util';
import {getDefaultProps, onComponentMounted, onComponentWillReceiveProps} from './at-react-main';

function onRender(React, component, queryParams) {
  component.targetState = {
    editMode: (queryParams.indexOf('mboxEdit') !== -1)
  };

  return <div
    ref={ref => {
      component.targetDiv = ref;
    }}
    {...component.props}
    className={appendMboxClass(component)}>{component.props.children}
  </div>;
}

export default function createTargetComponent(React, opts) {
  const at = adobe.target;
  const logger = console;
  const queryParams = location.search;

  return React.createClass({
    getDefaultProps: function () {
      return getDefaultProps(opts);
    },

    render: function () {
      return onRender(React, this, queryParams);
    },

    componentDidMount: function () {
      return onComponentMounted(this, at, logger);
    },

    shouldComponentUpdate: function () {
      return false;
    },

    componentWillReceiveProps: function (newProps) {
      return onComponentWillReceiveProps(this, at, logger, newProps);
    }
  });
}
