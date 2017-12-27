var sampleApp = angular.module('sampleApp', ['ui.router']);

sampleApp.config(function($stateProvider, $urlServiceProvider) {
    
    $urlServiceProvider.rules.otherwise('/view1');
    
    $stateProvider
        .state('view1', {
            url: '/view1',
            templateUrl: 'partials/view1.html'
        })
        .state('view2', {
            url: '/view2',
            templateUrl: 'partials/view2.html'
        });

});
