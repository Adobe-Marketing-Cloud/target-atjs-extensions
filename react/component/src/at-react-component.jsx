
/* global adobe, React */
(function (React, at) {
  'use strict';

  function getDefaultProps(opts, settings) {
    return {
      mbox: opts.mbox || settings.globalMboxName,
      params: opts.params || null,
      timeout: opts.timeout || settings.timeout
    };
  }

  function appendMboxClass(className) {
    return (className ? className + ' ' : '') + 'mboxDefault';
  }

  function removeMboxClass(className) {
    return className.replace(/\bmboxDefault\b/, '');
  }

  function onRender(component) {
    return <div ref={ref => {
      component.mboxDiv = ref;
    }} {...component.props} className={appendMboxClass(component.props.className)}>{component.props.children}</div>;
  }

  function onComponentMounted(component, logger) {
    logger.log('MboxComponentDidMount');

    at.getOffer({
      mbox: component.props.mbox,
      params: component.props.params,
      timeout: component.props.timeout,
      success: function (response) {
        component.setState({
          offerData: response
        });
      },
      error: function (status, error) {
        logger.log('getOffer error: ', error, status);
        component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
      }
    });
  }

  function onComponentUpdated(component, logger) {
    logger.log('MboxComponentDidUpdate');

    adobe.target.applyOffer({
      mbox: component.props.mbox,
      offer: component.state.offerData,
      element: component.mboxDiv
    });
    component.mboxDiv.className = removeMboxClass(component.mboxDiv.className);
  }

  at.registerExtension({
    name: 'react.createMboxComponent',
    modules: ['settings', 'logger'],
    register: function (settings, logger) {
      return function (opts) {
        return React.createClass({
          getDefaultProps: function () {
            return getDefaultProps(opts, settings);
          },

          render: function () {
            return onRender(this);
          },

          componentDidMount: function () {
            return onComponentMounted(this, logger);
          },

          componentDidUpdate: function () {
            return onComponentUpdated(this, logger);
          }
        });
      };
    }
  });
})(React, adobe.target);
