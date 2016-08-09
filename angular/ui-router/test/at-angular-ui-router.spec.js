/* global adobe angular app module inject */
var $rootScope;
var $state;
var element;
var offerService;
var routeService;
var options;

adobe.target.ext.angular.initStates(app, {mbox: 'myMbox', selector: 'h3'});

describe('ui-router tests', function () {
  beforeEach(module('myApp'));

  beforeEach(module(function ($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(module('test/home.html', 'test/blog.html'));

  beforeEach(inject(['$rootScope', '$compile', '$state', 'offerService', 'routeService', 'options',
    function (_$rootScope_, $compile, _$state_, _offerService_, _routeService_, _options_) {
      spyOn(adobe.target, 'getOffer').and.callThrough();
      spyOn(adobe.target, 'applyOffer');

      $rootScope = _$rootScope_;
      $state = _$state_;
      offerService = _offerService_;
      routeService = _routeService_;
      options = _options_;

      element = $compile('<div ui-view></div>')($rootScope);
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

  it('should get and apply offer on state change to "home"', function () {
    expect($state.current.name).toBe('');
    $state.go('home');
    $rootScope.$digest();
    expect($state.current.name).toBe('home');
    expect($state.current.templateUrl).toBe('test/home.html');
    expect($state.$current.locals.globals.offerData.offer).toBeDefined();
    expect($state.$current.locals.globals.offerData.offer).toEqual('<p>Sample Offer</p>');
    expectTargetCalls();
  });

  it('should get and apply offer on state change to "blog"', function () {
    expect($state.current.name).toBe('');
    $state.go('blog');
    $rootScope.$digest();
    expect($state.current.name).toBe('blog');
    expect($state.current.templateUrl).toBe('test/blog.html');
    expect($state.$current.locals.globals.offerData.offer).toBeDefined();
    expect($state.$current.locals.globals.offerData.offer).toEqual('<p>Sample Offer</p>');
    expectTargetCalls();
  });
});
