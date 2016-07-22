/* global adobe angular module inject */

var app = angular.module('myApp', []);
var $compile;
var $rootScope;
var offerService;
var options;

adobe.target.ext.angular.initDirective(app, {mbox: 'myMbox'});

describe('mbox directive tests', function () {
  beforeEach(module('myApp'));

  beforeEach(inject(['$compile', '$rootScope', 'offerService', function (_$compile_, _$rootScope_, _offerService_) {
    spyOn(adobe.target, 'getOffer').and.callThrough();
    spyOn(adobe.target, 'applyOffer');

    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    offerService = _offerService_;

    spyOn(offerService, 'getOfferPromise').and.callThrough();
    spyOn(offerService, 'applyOfferPromise').and.callThrough();
  }]));

  it('should call getOffer and applyOffer', function () {
    var element = $compile('<h1 mbox>Hello test!</h1>')($rootScope);
    $rootScope.$digest();
    expect(offerService.getOfferPromise).toHaveBeenCalled();
    expect(offerService.applyOfferPromise).toHaveBeenCalled();
    expect(adobe.target.getOffer).toHaveBeenCalled();
    expect(adobe.target.applyOffer).toHaveBeenCalled();
  });

  it('should hide element before getOffer and reveal it after applyOffer', function () {
    var element = $compile('<h1 mbox>Hello test!</h1>')($rootScope);

    expect(element.hasClass('mboxDefault')).toBe(true);
    $rootScope.$digest();
    expect(element.hasClass('mboxDefault')).toBe(false);
  });
});

describe('Automatic element conversion to mbox directive', function () {
  beforeEach(module('myApp'));

  beforeEach(inject(['$compile', '$rootScope', 'options',
    function (_$compile_, _$rootScope_, _options_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      options = _options_;

      spyOn(adobe.target, 'getOffer').and.callThrough();
      spyOn(adobe.target, 'applyOffer');
    }]));

  it('should replace matched selector with mbox directive', function () {
    options.selector = 'h1';
    var rootElement = angular.element(document.querySelectorAll('body'));
    var element = $compile('<h1>Hello test!</h1>')($rootScope);

    rootElement.append(element);
    $rootScope.$broadcast('$viewContentLoaded');
    expect(element[0].attributes.mbox).toBeDefined();
    expect(element[0].attributes['data-mboxname'].value).toEqual('myMbox');
    $rootScope.$digest();
    expect(adobe.target.getOffer).toHaveBeenCalled();
    expect(adobe.target.applyOffer).toHaveBeenCalled();
  });
});
