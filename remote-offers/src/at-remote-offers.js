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
(function(window, document, at){
  'use strict';

  var onReady = function(getobjs,callback,error, logger){
    var interval = 400, timeout = 30000;
    var checker = setInterval(function () {
      var objs = getobjs();
      if(timeout <= 0) {
        clearInterval(checker);
        if(typeof error==='function') error();
        return;
      }
      var isMissing=false;
      for(var i=0; i<objs.length; i++)
        if(!objs[i])
          isMissing=true;
      if(isMissing===false){
        clearInterval(checker);
        logger.log('el is ready');
        if(typeof callback==='function') callback();
        return;
      }
      timeout -= interval;
    }, interval);
  };

  var makeAjaxCall = function(url,callback,error) {
      log('XHR to '+url);
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 ) {
              if(xmlhttp.status == 200)
                  callback(xmlhttp.responseText);
              else error(xmlhttp.status);
          }
      }
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
  };
  //injecting CSS to hide containers
  var addCssToHead = function(css) {
      var head = document.getElementsByTagName("head")[0];
      if (head) {
          var style = document.createElement("style");
          style.setAttribute("type", "text/css");
          if (style.styleSheet) {
              style.styleSheet.cssText = css;
          } else {
              style.appendChild(document.createTextNode(css));
          }
          head.insertBefore(style, head.firstChild);
      }
  };

  var getOffer = function(path, selector, success, error, method, logger) {
      logger.log('getOffer');
      var prehide = selector + '{visibility:hidden}';
      addCssToHead(prehide);
      makeAjaxCall(path, function(result){
          logger.log('Call success, will applyOffer ' + path + ' to ' + selector);
          onReady(function(){ return [document.querySelector(selector)] },
                  function(){
                      var element = document.querySelector(selector);
                      if(typeof method === 'string' && method === 'replace'){
                          var newNode = document.createElement('div');
                          element.parentNode.replaceChild(newNode, element);
                          element = newNode;
                          logger.log('method:'+method);
                      }
                      at.applyOffer({
                        'element': element,
                        'offer': [{
                          'type': 'html',
                          'content': result
                        }]
                      });
                      logger.log('Offer applied to '+selector);
                      if(typeof success==='function'){ logger.log('Success handler'); success(); }
                  },
                  logger);
      }, function(status){
          logger.error("Error loading content for '" + path + "', status: '" + status);
          var element = document.querySelector(selector);
          if(element) element.style.visibility = 'visible';
          if(typeof error==='function') { logger.error('Error handler'); error(); }
      });

  };

  function fetchOffers(data, logger) {
    data.filter(function (el) {
        if (!el.url || !el.selector) {
          logger.error('Missing URL or selector');
          return false;
        }
        return true;
      })
      .forEach(function(el) {
        getOffer(el.url, el.selector, el.success, el.error, el.method, logger);
      });
  }

  adobe.target.registerExtension({
    name:'remoteoffers',
    modules: ['logger'],
    register: function (logger) {
      return function (data) {
        fetchOffers(data, logger);
      };
    }
  });
})(window, document, adobe.target);
