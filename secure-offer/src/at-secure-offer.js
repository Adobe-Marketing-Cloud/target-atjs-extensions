
/* global adobe */
'use strict';

adobe.target.registerExtension({
  name: 'myGreetingExtension',
  modules: ['logger'],
  register: function (logger) {
    return function (name) {
      var message = 'Hello, ' + name + '!';
      logger.log(message);
      return message;
    };
  }
});

adobe.target.ext.myGreetingExtension('Geronimo');
