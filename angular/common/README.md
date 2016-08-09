# at-angular-common
> Angular Common Adobe Target at.js extension  
> This is a helper extension, containing utils and wrappers, which aids the development of Angular **at.js** extensions/apps

## Overview

This extension registers the **target.angular.common** Angular module, which wraps **at.js** API as well as exposes several helper providers, to be used in Angular extension/app development.

## Usage

Create the **target.angular.common** Angular module by calling

```javascript
adobe.target.ext.angular.setupCommon(options);
```

where `options` object contains custom **at.js** options.  

Next, just inject the `target.angular.common` Angular module dependency into your Angular extension/app.  
  
**Note**: in case injection at the moment of main app init is tricky, you may find the following function handy:

```javascript
  function addModuleDependencies(module, dependencies) {
    dependencies.forEach(function (dependency) {
      if (module.requires.indexOf(dependency) === -1) {
        module.requires.push(dependency);
      }
    });
  }
```

## Providers

> The `target.angular.common` module exposes the following providers:

Provider  | Description
--------- | -----------
`offerService` | service providing `getOfferPromise()` and `applyOfferPromise()` - promise wrappers for **at.js** `getOffer()` and `applyOffer()`
`settings` | **at.js** settings constant wrapper
`logger` | **at.js** logger constant wrapper
`customOptions` | custom options provided on `setupCommon()` constant wrapper
`options` |  options constant wrapper, providing defaults where customOptions are missing
`routeUtil` | routing helper utils (e.g.: `routeUtil.isRouteAllowed()`)

## License

Apache-2.0 © [Adobe Systems, Inc.](http://www.adobe.com)
