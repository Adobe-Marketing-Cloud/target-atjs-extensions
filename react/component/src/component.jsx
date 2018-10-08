/* global adobe, React */
import {getDefaultProps, onRender, onComponentMounted, onComponentWillReceiveProps} from './main';

export default function createTargetComponent(React, opts) {
  class TargetComponent extends React.Component {
    constructor(props) {
      super(props);
      this.logger = console;
      this.queryParams = location.search;
    }

    render() {
      return onRender(React, this);
    }

    componentDidMount() {
      return onComponentMounted(this, this.logger);
    }

    shouldComponentUpdate() {
      return false;
    }

    componentWillReceiveProps(newProps) {
      return onComponentWillReceiveProps(this, this.logger, newProps);
    }

  }

  TargetComponent.defaultProps = getDefaultProps(opts);

  return TargetComponent;
}
