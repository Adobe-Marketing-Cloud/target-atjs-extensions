/* global adobe React */

var Utils = React.addons.TestUtils;
var Mbox = adobe.target.ext.react.createMboxComponent({mbox: 'myMbox'});
var component;
var element;

describe('Mbox component', function () {
  it('can render without errors', function () {
    element = React.createElement(Mbox, {mbox: 'myMbox'});
    expect(function () {
      component = Utils.renderIntoDocument(element);
    }).not.toThrow();
  });
});
