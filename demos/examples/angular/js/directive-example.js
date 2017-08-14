var sampleApp = angular.module('sampleApp', ['ngRoute']);

adobe.target.ext.angular.initDirective(sampleApp);

sampleApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/view1', {
      templateUrl: 'partials/view1.html',
      controller: 'View1Controller'
    }).
    when('/view2', {
      templateUrl: 'partials/view2.html',
      controller: 'View2Controller'
    }).
    otherwise({
      redirectTo: '/view1'
    });
}]);


sampleApp.controller('View1Controller', function($scope) {

  $scope.message = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.' +
    'Aenean commodo ligula eget dolor. Aenean massa.';

});


sampleApp.controller('View2Controller', function($scope) {
  $scope.message = 'Donec sodales sagittis magna. Sed consequat, leo eget' +
    'bibendum sodales, augue velit cursus nunc.';
});


sampleApp.controller('nav', ['$scope', '$location', function($scope, $location) {
  $scope.isActive = function(location) {
    return (location === $location.path());
  };
}]);
