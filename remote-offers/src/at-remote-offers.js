/*!
 * adobe.target.ext.remoteoffers.js v0.3.0
 *
 * Copyright 1996-2016. Adobe Systems Incorporated. All rights reserved.
 *
 * Example:
    adobe.target.ext.remoteoffers(
    [
        {
            'url': '/promotion1.html',          //remote offer url (required, must be same domain)
            'selector': '.menu a',              //CSS selector of element to deliver offer to
            'success': function(){},      //successful callback
            'error':   function(){},      //error handler
            'method': 'replace'                 //method to handle offer injection into DOM: 'append' (default) or 'replace'
        },
        {
            'url': '/promotion2.html',
            'selector': '#banner'
        }
    ]
    );
 */
 /* global adobe */
(function (window, document, at) {
  'use strict';
  var nanoajax = require('nanoajax');

  function makeVisible(elements) {
    elements.forEach(function (el) {
      el.style.visibility = 'visible';
    });
  }

  function onMutation(mutations, observer, getobjs, callback) {
    if (getobjs().length) {
      callback();
      // TODO -  remove css style from head
      observer.disconnect();
    }
  }

  function onReady(getobjs, callback, logger) {
    var timeout = 30000;
    var observerConfig = {
      childList: true,
      subtree: true
    };
    var observer = new window.MutationObserver(function (mutations) {
      return onMutation(mutations, observer, getobjs, callback);
    });

    observer.observe(document.documentElement, observerConfig);
    window.setTimeout(function () {
      logger.error('Timed out');
      observer.disconnect();
      makeVisible(getobjs());
    }, timeout);
  }

  // injecting CSS to hide containers
  function addCssToHead(css) {
    var head = document.getElementsByTagName('head')[0];
    if (head) {
      var style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      head.insertBefore(style, head.firstChild);
    }
  }

  function getOffer(path, selector, success, error, method, logger) {
    logger.log('getOffer');
    var prehide = selector + '{visibility:hidden}';
    addCssToHead(prehide);

    nanoajax.ajax({url: path}, function (code, responseText) {
      if (code === 200 && responseText) {
        onReady(
          function () {
            return document.querySelectorAll(selector);
          },
          function () {
            at.applyOffer({
              offer: [{
                type: 'actions',
                content: [{
                  selector: selector,
                  content: responseText,
                  action: (method ? method : 'append') + 'Content'
                }]
              }]
            });
            logger.log('Offer applied to ' + selector);
            if (typeof success === 'function') {
              logger.log('Success handler');
              success();
            }
          },
          logger);
      } else {
        logger.error('Error loading content for ' + path + ', status: ' + code);
        makeVisible(document.querySelectorAll(selector));
        if (typeof error === 'function') {
          logger.error('Error handler');
          error();
        }
      }
    });
  }

  function fetchOffers(data, logger) {
    data
      .filter(function (el) {
        if (!el.url || !el.selector) {
          logger.error('Missing URL or selector');
          return false;
        }
        return true;
      })
      .forEach(function (el) {
        getOffer(el.url, el.selector, el.success, el.error, el.method, logger);
      });
  }

  adobe.target.registerExtension({
    name: 'remoteoffers',
    modules: ['logger'],
    register: function (logger) {
      return function (data) {
        fetchOffers(data, logger);
      };
    }
  });
})(window, document, adobe.target);
