'use strict';

var adobe = {
  target: {
    ext: {},
    registerExtension: function (params) {
      var exposedModules = {
        logger: console
      };

      var args = [];
      params.modules.forEach(function (elem) {
        args.push(exposedModules[elem]);
      });

      adobe.target.ext[params.name] = params.register.apply(null, args);
    }
  }
};
