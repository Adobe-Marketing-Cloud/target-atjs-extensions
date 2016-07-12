var sampleApp = angular.module('sampleApp', ['ngRoute', 'adobe.target.directives']);


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

sampleApp.controller('ExecuteAjaxOptionCtrl', ['$scope', '$location', function($scope, $location) {
  var data = {
    executeAjaxJSON: {}
  };
  var path = $location.absUrl();
  var urlPrefix = path.substring(0, path.lastIndexOf('/'));

  function buildUrl(value, text) {
    return {
      value: value,
      text: urlPrefix + '/' + value + ' ' + text
    }
  }

  var index = 0;
  var $output = $('#test1Id');
  var logger = {
    log: function(message) {
      $output.append(index++ + '. ' + message);
      $output.append('\n\n');
    },
    reset: function() {
      index = 0;
      $output.text('');
    }
  };

  $scope.urlExamples = [
    buildUrl('responses/example.json', '(valid)'),
    buildUrl('responses/example.jso', '(invalid)')
  ];

  $scope.data = data;

  $scope.urlSelected = function() {
    return !!data.executeAjaxJSON.url;
  };

  $scope.sendJSONRequest = function() {
    $output = $('#test1Id');
    logger.reset();
    logger.log('executing...');
    adobe.target.executeAjax({
      url: data.executeAjaxJSON.url,
      params: {
        "param": "value"
      },
      success: function(data) {
        logger.log('executeAjax fetched some data:\n' + JSON.stringify(data));
        window.targetPageParamsAll = function() {
          logger.log('targetPageParamsAll is called and it returns:\n' + JSON.stringify(myParser(data)));
          return myParser(data);
        };
        executeGlobalMbox(logger);
      },
      error: function(errorStatus) {
        logger.log('executeAjax error : ' + errorStatus);
        executeGlobalMbox(logger);
      }
    });
  };

  $scope.sendJSONPRequest = function() {
    $output = $('#test2Id');
    logger.reset();
    logger.log('executing...');
    adobe.target.executeAjax({
      url: 'http://isithackday.com/arrpi.php?text=hello&format=json',
      type: 'jsonp',
      params: {
        "param": "value"
      },
      success: function(data) {
        logger.log('executeAjax fetched some data:\n' + JSON.stringify(data));
      },
      error: function(errorStatus) {
        logger.log('executeAjax error : ' + errorStatus);
      }
    });
  };

  $scope.sendScriptRequest = function() {
    $output = $('#test3Id');
    logger.reset();
    logger.log('executing...');
    logger.log('value of (global) zzz [before]: ' + (typeof zzz === 'undefined' ? 'undefined' : 'has value'));
    adobe.target.executeAjax({
      url: 'responses/example.js',
      type: 'script',
      params: {
        "param": "value"
      },
      success: function(data) {
        logger.log('executeAjax fetched some data');
        logger.log('value of (global) zzz [after]: ' + JSON.stringify(zzz));
      },
      error: function(errorStatus) {
        logger.log('executeAjax error : ' + errorStatus);
      }
    });
  }
}]);
