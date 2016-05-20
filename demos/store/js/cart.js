'use strict';

(function($, angular) {

  angular
    .module('cart', [])
    .service('store', ['$window', function($window) {
      return {
        get: function(key) {
          if ($window.localStorage[key]) {
            return JSON.parse($window.localStorage[key]);
          }

          return false;
        },

        set: function(key, value) {
          if (value === undefined) {
            $window.localStorage.removeItem(key);
          } else {
            $window.localStorage[key] = angular.toJson(value);
          }

          return $window.localStorage[key];
        }
      }
    }])
    .factory('cart', ['store', function(store) {

      var cartData = store.get('cart') || [];

      return {
        addProduct: function(id, name, price) {
          var existingItem = false;

          for (var i = 0; i < cartData.length; i++) {
            if (cartData[i].id == id) {
              cartData[i].count++;
              existingItem = true;
              break;
            }
          }

          if (!existingItem) {
            cartData.push({ count: 1, id: id, price: price, name: name });
            store.set('cart', cartData);
          }
        },

        removeProduct: function(id) {
          for (var i = 0; i < cartData.length; i++) {
            if (cartData[i].id == id) {
              cartData.splice(i, 1);
              break;
            }
          }

          store.set('cart', cartData);
        },

        getProducts: function() {
          return cartData;
        },

        isCartEmpty: function() {
          return cartData.length == 0;
        }
      }
    }])
    .directive('cartSummary', function(cart) {
      return {
        restrict: 'E',
        templateUrl: document.location.pathname + 'template/cartsummary.html',
        controller: function($scope) {

          var cartData = cart.getProducts();

          $scope.total = function() {
            var t = 0;

            for (var i = 0; i < cartData.length; i++) {
              t += (cartData[i].price * cartData[i].count);
            }

            return t;
          };

          $scope.itemCount = function() {
            var t = 0;

            for (var i = 0; i < cartData.length; i++) {
              t += cartData[i].count;
            }

            return t;
          }
        }
      }
    });

})(jQuery, angular);