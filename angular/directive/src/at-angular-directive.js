/**
 * Copyright 2016 Adobe Systems, Inc. http://www.adobe.com
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
