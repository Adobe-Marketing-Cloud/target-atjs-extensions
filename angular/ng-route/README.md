# at-angular-ng-route
> Angular ngRoute Adobe Target **at.js** extension  
> This adds a Target getOffer() resolve to all ngRoute routes and applies the resolved offer once a view is loaded.

## Overview

This extension applies a Target getOffer() promise resolve to all of your app's ngRoute routes. Thus, when a route is selected, the requested Target offers are fetched via **at.js** API.  
Once the view corresponding to the current route is fully loaded, the offer is applied to the elements matching the configured Target selector (provided in options parameter).  
The extension should be used in Angular apps utilizing the ngRoute routing module (`angular-route(.min).js`).  
  
**Note:** The extension requires [`at-angular-common extension`](../common/)(`target-angular.common` Angular module). If you're not already loading it separately in your app, just use the `at-angular-ng-route+common.js` version, which has it bundled.

## Usage

```javascript
adobe.target.ext.angular.initRoutes(app, options);
```

where `options` object contains custom **at.js** options.  

## License

Apache-2.0 © [Adobe Systems, Inc.](http://www.adobe.com)
