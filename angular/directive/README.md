# at-angular-directive
> Angular Directive Adobe Target **at.js** extension  
> This provides the `mbox` Angular directive, and also allows for its automatic applying/appending to elements matched by a given CSS selector.

## Overview

This extension adds a `mbox` **directive** provider to your Angular module, which fetches and applies Target offers via **at.js** API, based on provided options.  
Additionally, in case a CSS selector is provided in `selector` options property, `mbox` directive will be automatically set in matched elements' attributes (unless `appendToSelector: true` property is also set, in which case it will instead be appended as a separate `<div>` after each element).  
DOM elements matching the directive will remain hidden, until the offers are applied (or an error occures when fetching/applying them).  
  
**Note:** The extension requires [`at-angular-common extension`](../common/)(`target.angular.common` Angular module). If you're not already loading it separately in your app, just use the `at-angular-directive+common.js` version, which has it bundled.

## Usage

```javascript
adobe.target.ext.angular.initDirective(app, options);
```

where `options` object contains custom **at.js** options.  

## Options

> The following options can be provided in the `options` object:

Key | Type | Mandatory | Description
--- | ---- | --------- | -----------
`mbox` | String | Yes | mbox name. It is mandatory if you want to track clicks. If not provided, an error will be logged and tracking event won't be attached.
`params` | Object | No | mbox parameters - an object of key-value pairs, that has the following structure:<br>`{`<br>`"param1": "value1",`<br>`"param2": "value2"`<br>`}`
`timeout` | Number | No | timeout in milliseconds. If not specified, default adobe.target will be used. Default timeout is the one set via mbox.js settings. This value can be configured using mbox.js settings in Target Classic Admin UI Advanced Mode or in Bullseye UI.
`selector` | String | No | If provided, the extension will attempt to set `mbox` directive in the attributes of elements matched by the selector
`appendToSelector` | Boolean | No | Used together with `selector` option. If true, appends `mbox` directive as a separate `<div>` after each matched element, instead of setting it in element attributes

## Notes and known issues

* **Note:** in case a `selector` is provided with `appendToSelector: false`, the extension will overwrite the `id` attribute of the matched elements;
* In some Angular apps using partial views, the auto-setting of `mbox` directives based on a provided selector may not function.  
This may happen due to the DOM elements to be matched by the selector being unavailable at the moment of `$viewContentLoaded` hook execution.  
A proper (flicker-less) fix for this may be provided in a future version.

## License

Apache-2.0 © [Adobe Systems, Inc.](http://www.adobe.com)
