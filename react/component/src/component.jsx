/* global adobe, React */
import {appendMboxClass} from './util';
import {getDefaultProps, onComponentMounted, onComponentWillReceiveProps} from './main';

function onRender(React, component) {
  component.targetState = {
    editMode: (component.queryParams.indexOf('mboxEdit') !== -1)
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
  class TargetComponent extends React.Component {
    constructor(props) {
      super(props);
      this.at = adobe.target;
      this.logger = console;
      this.queryParams = location.search;
    }

    render() {
      return onRender(React, this);
    }

    componentDidMount() {
      return onComponentMounted(this, this.at, this.logger);
    }

    shouldComponentUpdate() {
      return false;
    }

    componentWillReceiveProps(newProps) {
      return onComponentWillReceiveProps(this, this.at, this.logger, newProps);
    }

  }

  TargetComponent.defaultProps = getDefaultProps(opts);

  return TargetComponent;
}
