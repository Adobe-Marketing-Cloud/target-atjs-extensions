'use strict';

(function($, angular) {
  /**
   * Mango store main module
   * @type {module}
   */
  var mangoStore = angular.module('mangoStore', ['ngRoute', 'cart']);

  /**
   * Router config
   */
  mangoStore.config(['$routeProvider', function($routeProvider) {
    var prefix = document.location.pathname;

    $routeProvider
      .when('/', { templateUrl: prefix + 'template/home.html' })
      .when('/products', { templateUrl: prefix + 'template/products.html' })
      .when('/cart', { templateUrl: prefix + 'template/cart.html' });
  }]);

  /**
   * Navigation bar states controller
   */
  mangoStore.controller('nav', ['$scope', '$location', function($scope, $location) {
    $scope.isActive = function(location) {
      return (location === $location.path());
    };
  }]);

  /**
   * Products page items
   */
  mangoStore.controller('productsCtrl', ['$scope', 'cart', function($scope, cart) {
    $scope.products = [
      { id: 1, path: 'img/rasberries.jpg', name: 'Rasberries', price: '3.86', amount: '12oz' },
      { id: 2, path: 'img/blueberries.jpg', name: 'Blueberries', price: '2.98', amount: '3.5oz' },
      { id: 3, path: 'img/oranges.jpg', name: 'Oranges', price: '3.98', amount: '4lb' },
      { id: 4, path: 'img/avocadomango.jpg', name: 'Avocado / Mango', price: '3.88', amount: '6oz' },
      { id: 5, path: 'img/bananas.jpg', name: 'Bananas', price: '2.89', amount: '4lb' },
      { id: 6, path: 'img/pears.jpg', name: 'Pears', price: '3.79', amount: '4lb' }
    ];

    $scope.addProductToCart = function(product) {
      cart.addProduct(product.id, product.name, product.price);
    };
  }]);

  /**
   * Cart
   */
  mangoStore.controller('cartSummary', ['$scope', 'cart', function($scope, cart) {
    $scope.cartData = cart.getProducts();
    $scope.isCartEmpty = cart.isCartEmpty();

    $scope.total = function() {
      var t = 0;

      for (var i = 0; i < $scope.cartData.length; i++) {
        t += ($scope.cartData[i].price * $scope.cartData[i].count);
      }

      return t;
    };

    $scope.remove = function(id) {
      cart.removeProduct(id);
    }
  }]);

  /**
   * Home page slider items
   */
  mangoStore.controller('homeSliderCtrl', ['$scope', function($scope) {
    $scope.items = [
      { id: 1, path: 'img/market-1.jpg', description: 'Fruits & more' },
      { id: 2, path: 'img/market-4.jpg', description: 'Oranges' },
      { id: 3, path: 'img/market-3.jpg', description: 'Strawberries' }
    ];
  }]);

  /**
   * Home page slider
   */
  mangoStore.directive('slider', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.$watch(function() {
          element.slider({ indicators: false, interval: 3000 });
        });       
      }
    };  
  });

  /**
   * MBOX directive
   * Text
   */
  mangoStore.directive('mbox', function($document) {
    return {
      restrict: 'AE',
      link: {
        pre: function preLink(scope, element, attributes, controller) {
          element.css('visibility', 'hidden');
        },
        post: function postLink(scope, element, attributes, controller) {
          adobe.target.getOffer({
            mbox: attributes.mboxname,
            success: function(response) {
              element.click(function(){
                adobe.target.reportEvent({
                  type: 'click',
                  mbox: attributes.mboxname,
                  params: {
                    clickToken: response[0].clickToken
                  },
                  success: function() {
                    console.log('click event reported');
                  },
                  error: function() {
                    console.log('could not report click event');
                  }
                }); 
              });
              element.html(response[0]['content']);
              element.css('visibility', 'visible');
            },
            error: function(status, response) {              
              element.css('visibility', 'visible');
            }
          });
        }
      }
    };
  });

})(jQuery, angular);