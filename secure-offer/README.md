# at-secure-offer
> An Adobe Target **at.js** extension that sanitizes fetched Target offers

## Overview

This extension makes use of [Google Caja JsHtmlSanitizer](https://github.com/google/caja/wiki/JsHtmlSanitizer) to sanitize offers fetched via **at.js** `getOffer()` calls.

## Syntax

```javascript
adobe.target.ext.getSecureOffer(options);
```

## Options

> The `options` parameter specification is the same as for **at.js** `getOffer()`.

Key | Type | Mandatory | Description
--- | ---- | --------- | -----------
`mbox` | String | Yes | mbox name. It is mandatory if you want to track clicks. If not provided, an error will be logged and tracking event won't be attached.
`params` | Object | No | mbox parameters - an object of key-value pairs, that has the following structure:<br>`{`<br>`"param1": "value1",`<br>`"param2": "value2"`<br>`}`
`timeout` | Number | No | timeout in milliseconds. If not specified, default adobe.target will be used. Default timeout is the one set via mbox.js settings. This value can be configured using mbox.js settings in Target Classic Admin UI Advanced Mode or in Bullseye UI.
`success` | Function | Yes | Callback to be executed when a response is received from the server. The success callback function will receive a single parameter that represents an array of offer objects.
`error` | Function | Yes | Callback to be executed when an error occurs.

## License

Apache-2.0 © [Adobe Systems, Inc.](http://www.adobe.com)
