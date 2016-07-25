/* global adobe angular module inject */

var app = angular.module('myApp', []);
var $compile;
var $rootScope;
var element;
var offerService;
var options;
var setOptionsAndLoadView;

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

    element = $compile('<h1 mbox>Hello test!</h1>')($rootScope);
  }]));

  it('should call getOffer and applyOffer', function () {
    $rootScope.$digest();
    expect(offerService.getOfferPromise).toHaveBeenCalled();
    expect(offerService.applyOfferPromise).toHaveBeenCalled();
    expect(adobe.target.getOffer).toHaveBeenCalled();
    expect(adobe.target.applyOffer).toHaveBeenCalled();
  });

  it('should hide element before getOffer and reveal it after applyOffer', function () {
    expect(element.hasClass('mboxDefault')).toBe(true);
    $rootScope.$digest();
    expect(element.hasClass('mboxDefault')).toBe(false);
  });
});

describe('Automatic element conversion to mbox directive', function () {
  beforeEach(module('myApp'));

  beforeEach(inject(['$compile', '$rootScope', 'options',
    function (_$compile_, _$rootScope_, _options_) {
      spyOn(adobe.target, 'getOffer').and.callThrough();
      spyOn(adobe.target, 'applyOffer');

      $compile = _$compile_;
      $rootScope = _$rootScope_;
      options = _options_;

      element = $compile('<h1>Hello test!</h1>')($rootScope);
      var rootElement = angular.element(document.querySelectorAll('body'));
      rootElement.append(element);

      setOptionsAndLoadView = function (appendToSelector) {
        options.selector = 'h1';
        if (appendToSelector) {
          options.appendToSelector = true;
        }
        $rootScope.$broadcast('$viewContentLoaded');
      };
    }]));

  it('should replace matched selector with mbox directive', function () {
    setOptionsAndLoadView(false);
    $rootScope.$digest();
    expect(element[0].attributes.mbox).toBeDefined();
    expect(element[0].attributes['data-mboxname'].value).toEqual('myMbox');
    expect(adobe.target.getOffer).toHaveBeenCalled();
    expect(adobe.target.applyOffer).toHaveBeenCalled();
    element.remove();
  });

  it('should append mbox directive to matched selector', function () {
    setOptionsAndLoadView(true);
    element = element[0].lastChild;
    expect(element.tagName).toEqual('DIV');
    expect(element.attributes.mbox).toBeDefined();
    expect(element.attributes['data-mboxname'].value).toEqual('myMbox');
    $rootScope.$digest();
    expect(adobe.target.getOffer).toHaveBeenCalled();
    expect(adobe.target.applyOffer).toHaveBeenCalled();
  });
});
