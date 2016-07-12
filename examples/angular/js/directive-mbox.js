
angular.module('adobe.target.directives', []).directive('mbox', function() {
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
            adobe.target.applyOffer({
              element: element[0],
              offer: response
            });
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
