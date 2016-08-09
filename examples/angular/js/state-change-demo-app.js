var sampleApp = angular.module('sampleApp', ['ui.router']);

sampleApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/view1');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('view1', {
            url: '/view1',
            templateUrl: 'partials/view1.html'
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('view2', {
            url: '/view2',
            templateUrl: 'partials/view2.html',
            resolve: {}   
        });
        
});