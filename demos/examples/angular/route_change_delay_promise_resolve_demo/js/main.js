/**
 * AngularJS Tutorial 1
 * @author Nick Kaye <nick.c.kaye@gmail.com>
 */

/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute'
]);

// TARGET INTEGRATION Step 1: Register adobeTargetOfferService with Angular Module
app.factory('adobeTargetOfferService', ['$q', function($q) {
  var service = {
    data : null,
    getOffer : function(){
      var defer = $q.defer();
      adobe.target.getOffer({  
        mbox: 'target-global-mbox',  
        params: {"param1": "val1","param2":"val2"},
        success: function(response) {   
            if(console&&console.info)console.info('in adobeTargetOfferService SUCCESS')
            service.data = response;
            console.info(service.data)
            defer.resolve(response);
          },  
        error: function(status,error) {    
            if(console&&console.info)console.info('in adobeTargetOfferService ERROR')
            defer.reject(error);
          }
      });
      return defer.promise;
    }
  };
  return service;
}]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    // TARGET INTEGRATION Step 2: Add adobeTargetOfferService to Route Resolver
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"               ,resolve:{offerData: function(adobeTargetOfferService){return adobeTargetOfferService.getOffer();}}  })
    // Pages
    .when("/services", {templateUrl: "partials/services.html", controller: "PageCtrl"   ,resolve:{offerData: function(adobeTargetOfferService){return adobeTargetOfferService.getOffer();}}  })
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"         ,resolve:{offerData: function(adobeTargetOfferService){return adobeTargetOfferService.getOffer();}}  })
    .when("/faq", {templateUrl: "partials/faq.html", controller: "PageCtrl"             ,resolve:{offerData: function(adobeTargetOfferService){return adobeTargetOfferService.getOffer();}}  })
    .when("/pricing", {templateUrl: "partials/pricing.html", controller: "PageCtrl"     ,resolve:{offerData: function(adobeTargetOfferService){return adobeTargetOfferService.getOffer();}}  })
    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"     ,resolve:{offerData: function(adobeTargetOfferService){return adobeTargetOfferService.getOffer();}}  })
    // Blog
    .when("/blog", {templateUrl: "partials/blog.html", controller: "BlogCtrl"})
    .when("/blog/post", {templateUrl: "partials/blog_item.html", controller: "BlogCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);



/**
 * Controls all other Pages
 */
// TARGET INTEGRATION Step 3: Pass mboxData to Controller
app.controller('PageCtrl', ['$scope', 'offerData', function ( $scope, offerData ) {



  // TARGET INTEGRATION Step 4: let routeChangeSuccess to display mbox data
  $scope.$on('$routeChangeSuccess', function(next, current) { 
    if(console&&console.info)console.info('in routeChangeSuccess with data '+offerData);
    if (typeof offerData==='object' && offerData.length>0){ 
      angular.element(document.body).append(offerData[0].content);
    }
  });





  // Activates the Carousel
  $('.carousel').carousel({
    interval: 5000
  });

  // Activates Tooltips for Social Links
  $('.tooltip-social').tooltip({
    selector: "a[data-toggle=tooltip]"
  })
}]);

/**
 * Controls the Blog
 */
app.controller('BlogCtrl', function (/* $scope, $location, $http */) {
  console.log("Blog Controller reporting for duty.");
});