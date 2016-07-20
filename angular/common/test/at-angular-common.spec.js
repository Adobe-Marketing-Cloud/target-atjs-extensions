/* global adobe angular module inject */

describe('angular-common', function () {
  beforeEach(function () {
    spyOn(adobe.target, 'getOffer').and.callThrough();
    spyOn(adobe.target, 'applyOffer');

    adobe.target.ext.angular.setupCommon({mbox: 'myMbox'});
  });

  var qDeferred;

  beforeEach(module('target-angular.common', function ($provide) {
    qDeferred = jasmine.createSpyObj('deferred', ['resolve', 'reject', 'promise']);
    var Q = function (resolver) {
      resolver(qDeferred.resolve, qDeferred.reject);
      return qDeferred.promise;
    };
    Q.defer = jasmine.createSpy('defer').and.returnValue(qDeferred);
    $provide.value('$q', Q);
  }));

  it('should create common module', function () {
    var commonModule = angular.module('target-angular.common');

    expect(commonModule).toBeDefined();
    expect(commonModule.name).toEqual('target-angular.common');
  });

  it('getOfferPromise should return getOffer promise', inject(function (offerService, $q) {
    var promise = offerService.getOfferPromise({});

    expect($q.defer).toHaveBeenCalled();
    expect(adobe.target.getOffer).toHaveBeenCalled();
    expect(qDeferred.resolve).toHaveBeenCalled();
    expect(promise).toEqual(qDeferred.promise);
  }));

  it('applyOfferPromise should return applyOffer promise', inject(function (offerService, $q) {
    var promise = offerService.applyOfferPromise({});

    expect($q.defer).not.toHaveBeenCalled();
    expect(adobe.target.applyOffer).toHaveBeenCalled();
    expect(qDeferred.resolve).toHaveBeenCalled();
    expect(promise).toEqual(qDeferred.promise);
  }));
});
