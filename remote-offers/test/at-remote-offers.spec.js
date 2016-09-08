/* global adobe */
describe('remote-offers', function () {
  beforeAll(function () {
    spyOn(adobe.target, 'applyOffer').and.callThrough();

    var fixture = '<div id="fixture"><p id="one">Default content 1</p>' +
    '<p id="two">Default content 2</p></div>';

    document.body.insertAdjacentHTML('afterbegin', fixture);

    adobe.target.ext.remoteoffers([{
      url: '/base/test/promo1.html',
      selector: '#one',
      success: function () {
        console.log('One success');
      },
      error: function () {
        console.log('One error');
      },
      method: 'replace'
    }, {
      url: '/base/test/promo2.html',
      selector: '#two',
      success: function () {
        console.log('Two success');
      },
      error: function () {
        console.log('Two error');
      },
      method: 'append'
    }]);
  });

  it('should apply remote offers', function (done) {
    setTimeout(function () {
      expect(adobe.target.applyOffer).toHaveBeenCalled();
      expect(document.getElementById('one').innerHTML.trim()).toBe('<h1>Promo 1</h1>');
      expect(document.getElementById('two').children.length).toBe(1);
      expect(document.getElementById('two').children[0].innerHTML.trim()).toBe('<h2>Promo 2</h2>');
      done();
    }, 2000);
  }, 3000);

  afterAll(function () {
    document.body.removeChild(document.getElementById('fixture'));
  });
});
