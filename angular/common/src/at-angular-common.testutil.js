'use strict';

var adobe = {
  target: {
    ext: {},
    registerExtension: function (params) {
      var exposedModules = {
        settings: {
          defaultContentHiddenStyle: 'visibility:hidden;',
          defaultContentVisibleStyle: 'visibility:visible;',
          bodyHiddenStyle: 'body{display:none}',
          bodyHidingEnabled: true,
          globalMboxAutoCreate: false,
          timeout: 5000,
          pollingAfterDomReadyTimeout: 2000
        },
        logger: console
      };

      var args = [];
      params.modules.forEach(function (elem) {
        args.push(exposedModules[elem]);
      });

      adobe.target.ext[params.name] = params.register.apply(null, args);
    },
    getOffer: function (opts) {
      var offer = '<p>Sample Offer</p>';
      opts.success(offer);
    },
    applyOffer: function (opts) {
    }
  }
};
