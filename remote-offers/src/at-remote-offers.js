/*!
 * adobe.target.ext.remoteoffers.js v0.2.0
 *
 * Copyright 1996-2016. Adobe Systems Incorporated. All rights reserved.
 *
 * Example:
    adobe.target.ext.remoteoffers(
    [
        {
            'url': '/promotion1.html',          //remote offer url (required, must be same domain)
            'selector': '.menu a',              //CSS selector of element to deliver offer to
            'callbackSuccess': function(){},    //successful callback
            'callbackError':   function(){},    //error handler
            'method': 'replace'                 //method to handle offer injection into DOM: 'append' (default) or 'replace'
        },
        {
            'url': '/promotion2.html',
            'selector': '#banner'
        }
    ],
    {debug:true}
    );
 */
!(function(){
    "use strict";

    var log = function(){};

    var onReady = function(getobjs,callback,error){
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
              log('el is ready');
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

    var getOffer = function(path, selector, callbackSuccess, callbackError, method) {
        log('getOffer');
        var prehide = selector + '{visibility:hidden}';
        addCssToHead(prehide);
        makeAjaxCall(path, function(result){
            log('Call success, will applyOffer '+path+' to '+selector);
            onReady(function(){ return [document.querySelector(selector)] },
                    function(){
                        var element = document.querySelector(selector);
                        if(typeof method === 'string' && method === 'replace'){
                            var newNode = document.createElement('div');
                            element.parentNode.replaceChild(newNode, element);
                            element = newNode;
                            log('method:'+method);
                        }
                        adobe.target.applyOffer({
                          'element': element,
                          'offer': [{
                            'type': 'html',
                            'content': result
                          }]
                        });
                        log('Offer applied to '+selector);
                        if(typeof callbackSuccess==='function'){ log('Success handler'); callbackSuccess(); }
                    });
        }, function(status){
            log("Error loading content for '" + path + "', status: '" + status);
            var element = document.querySelector(selector);
            if(element) element.style.visibility = 'visible';
            if(typeof callbackError==='function') { log('Error handler'); callbackError(); }
        });

    };

    var _register = function(dom, logger) {
      var getRemoteOffers = function(data, opts) {
        log = (opts.debug) ? function(s){logger.log('ATX:'+s)} : log;
        for (var i = 0; i < data.length; i++) {
            var el = data[i];
            if(el.url && el.selector)
                getOffer(el.url, el.selector, el.callbackSuccess, el.callbackError, el.method);
            else log('Error:missing URL or selector');
        }
      };
      return getRemoteOffers;
    };

    adobe.target.registerExtension({
        name:'remoteoffers',
        modules: ['dom', 'logger'],
        register: _register
    });
})();
