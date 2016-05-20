$(function() {
  function showError(message) {
    console.log(message);
  }

  function fetchViewOffer(viewId) {
    var $offerPlaceHolder = $('#' + viewId).find('.offer');

    $offerPlaceHolder.addClass('mboxDefault');
    switchView(viewId);

    adobe.target.getOffer({
      mbox: viewId,
      error: function() {
        showError('Something went wrong.');
      },
      success: function(offers) {
        var offer = offers[0];
        if (offer.type === 'html') {
          $offerPlaceHolder.
            html(offer.content).
            removeClass('mboxDefault');
        }
      }
    })
  }

  function startHashChangeEventListener() {
    if (!"onhashchange"  in window) {
      showError('Your browser does not support hash change event!');
      return;
    }

    window.onhashchange = function() {
      var viewId = getViewIdFromHash();
      fetchViewOffer(viewId);
    };
  }

  function getViewIdFromHash() {
    return window.location.hash.substr(1).replace('/', '');
  }

  function getDefaultView() {
    var profileRegExp = /view\d/;
    var defaultViewId = 'view1';
    var viewIdFromHash = getViewIdFromHash();

    if (profileRegExp.test(viewIdFromHash)) {
      return viewIdFromHash;
    }

    return defaultViewId;
  }

  function switchView(viewId) {
    $('.card-content').addClass('hide').filter('#' + viewId).removeClass('hide');
  }

  fetchViewOffer(getDefaultView());
  startHashChangeEventListener();
});
