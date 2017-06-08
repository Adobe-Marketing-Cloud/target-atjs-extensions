/* global adobe React */

var createMboxComponent = require('../dist/at-react-component').default;
var Utils = React.addons.TestUtils;
var Mbox = createMboxComponent(React);
var component;
var element;

describe('Mbox component', function () {
  beforeEach(function () {
    spyOn(adobe.target, 'getOffer').and.callThrough();
    spyOn(adobe.target, 'applyOffer').and.callThrough();
  });

  it('should call getOffer and applyOffer', function () {
    element = React.createElement(Mbox, {'data-mbox': 'myMbox'});
    expect(function () {
      component = Utils.renderIntoDocument(element);
    }).not.toThrow();
    expect(adobe.target.getOffer).toHaveBeenCalled();
    expect(adobe.target.applyOffer).toHaveBeenCalled();
  });
});
