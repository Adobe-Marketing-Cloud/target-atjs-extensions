# at-react-component
> React Component Adobe Target **at.js** extension  
> This extension returns a React component, to be used as container for content delivered by **at.js**

## Overview

The extension returns a React component, that acts as a container for offers delivered by **at.js**.  
Initially, it renders a hidden `<div>` element, which is later made visible once the offer content is successfully fetched by `adobe.target.getOffer()` and applied by `adobe.target.applyOffer()`.  
The returned React component is to be composed into React apps, e.g.: `<Mbox />`

## Usage

```javascript
var Mbox = adobe.target.ext.react.createMboxComponent(opts);
```

where `options` object contains custom **at.js** options.  

## Options

> The following options can be provided in the `options` object:

Key | Type | Mandatory | Description
--- | ---- | --------- | -----------
`mbox` | String | Yes | mbox name. It is mandatory if you want to track clicks. If not provided, an error will be logged and tracking event won't be attached.
`params` | Object | No | mbox parameters - an object of key-value pairs, that has the following structure:<br>`{`<br>`"param1": "value1",`<br>`"param2": "value2"`<br>`}`
`timeout` | Number | No | timeout in milliseconds. If not specified, default adobe.target will be used. Default timeout is the one set via mbox.js settings. This value can be configured using mbox.js settings in Target Classic Admin UI Advanced Mode or in Bullseye UI.

## Notes

Besides being passed as a parameter to `createMboxComponent`, options can also be specified as component attributes, in your React app's `render` function, for example: `<Mbox mbox="myMbox" />`

## License

Apache-2.0 © [Adobe Systems, Inc.](http://www.adobe.com)
