/* global adobe React */

var Utils = React.addons.TestUtils;
var Mbox = adobe.target.ext.react.createMboxComponent({mbox: 'myMbox'});
var component;
var element;

describe('Mbox component', function () {
  beforeEach(function () {
    spyOn(adobe.target, 'getOffer').and.callThrough();
    spyOn(adobe.target, 'applyOffer').and.callThrough();
  });

  it('should call getOffer and applyOffer', function () {
    element = React.createElement(Mbox, {mbox: 'myMbox'});
    expect(function () {
      component = Utils.renderIntoDocument(element);
    }).not.toThrow();
    expect(adobe.target.getOffer).toHaveBeenCalled();
    expect(adobe.target.applyOffer).toHaveBeenCalled();
  });
});
