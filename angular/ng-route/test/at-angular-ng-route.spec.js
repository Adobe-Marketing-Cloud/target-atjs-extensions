/* global adobe angular app module inject */
var $rootScope;
var $route;
var $location;
var element;
var offerService;

adobe.target.ext.angular.initRoutes(app, {mbox: 'myMbox', selector: 'h3'});

describe('ng-route tests', function () {
  beforeEach(module('myApp'));

  beforeEach(module('test/home.html', 'test/blog.html'));

  beforeEach(inject(['$rootScope', '$compile', '$route', '$location', 'offerService',
    function (_$rootScope_, $compile, _$route_, _$location_, _offerService_) {
      spyOn(adobe.target, 'getOffer').and.callThrough();
      spyOn(adobe.target, 'applyOffer');

      $rootScope = _$rootScope_;
      $route = _$route_;
      $location = _$location_;
      offerService = _offerService_;

      element = $compile('<div ng-view></div>')($rootScope);
      var rootElement = angular.element(document.querySelectorAll('body'));
      rootElement.append(element);

      spyOn(offerService, 'getOfferPromise').and.callThrough();
      spyOn(offerService, 'applyOfferPromise').and.callThrough();
    }])
  );

  afterEach(function () {
    element.remove();
  });

  function expectTargetCalls() {
    expect(offerService.getOfferPromise).toHaveBeenCalled();
    expect(offerService.applyOfferPromise).toHaveBeenCalled();
    expect(adobe.target.getOffer).toHaveBeenCalled();
    expect(adobe.target.applyOffer).toHaveBeenCalled();
  }

  it('should get and apply offer on route change to /', function () {
    expect($route.current).toBeUndefined();
    $location.path('/');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('test/home.html');
    expect($route.current.locals.offerData.offer).toBeDefined();
    expect($route.current.locals.offerData.offer).toEqual('<p>Sample Offer</p>');
    expectTargetCalls();
  });

  it('should get and apply offer on route change to /blog', function () {
    expect($route.current).toBeUndefined();
    $location.path('/blog');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('test/blog.html');
    expect($route.current.locals.offerData.offer).toBeDefined();
    expect($route.current.locals.offerData.offer).toEqual('<p>Sample Offer</p>');
    expectTargetCalls();
  });
});
