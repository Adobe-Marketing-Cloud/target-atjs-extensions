/* global adobe testOfferContent */

describe('greeter', function () {
  var offer;
  it('should sanitize HTML offers', function () {
    testOfferContent = '<b style=\\"color: red;\\" onclick=\\"alert(1)\\">hello</b><img src=\\"http://asdf\\"><a href=\\"javascript:alert(0)\\"><script src=\\"http://dfd\\"><\/script>';
    adobe.target.ext.getSecureOffer({
      mbox: 'htmlTest',
      success: function (response) {
        offer = response;
        console.log('Content: ', response);
      }
    });
    expect(offer.content).toEqual('<b style="color: red">hello</b><img src="http://asdf"><a></a>');
  });
});
