
/* global adobe, React */
(function (React, at) {
  'use strict';

  at.registerExtension({
    name: 'react.createMboxComponent',
    modules: ['settings', 'logger'],
    register: function (settings, logger) {
      return function (opts) {
        return React.createClass({
          getDefaultProps: function () {
            return {
              mbox: opts.mbox || settings.globalMboxName,
              params: opts.params || null,
              timeout: opts.timeout || settings.timeout
            }
          },

          render: function () {
            return <div ref={ref => {
              this.mboxDiv = ref;
            }} {...this.props}>{this.props.children}</div>;
          },

          componentDidMount: function () {
            logger.log('MboxComponentDidMount');

            var component = this;
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
              }
            });
          },

          componentDidUpdate: function () {
            logger.log('MboxComponentDidUpdate');

            adobe.target.applyOffer({
              mbox: this.props.mbox,
              offer: this.state.offerData,
              element: this.mboxDiv
            });
          }
        });
      };
    }
  });
})(React, adobe.target);
