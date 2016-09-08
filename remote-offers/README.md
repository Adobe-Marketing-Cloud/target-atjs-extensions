# at-remote-offers
> Remote Offers Adobe Target **at.js** extension  
> This extension fetches and applies HTML offers hosted on remote hosts of the same domain.

## Overview

This extension is used to deliver one or multiple HTML offers hosted on a remote host of same domain. It provides a "flicker-free" implementation that loads and injects remote HTML code, hosted on the same domain.  
The extension is especially useful for AEM applications, where multiple HTML components can be retrieved onto the page with only one `getRemoteOffers()` call.

## Usage

```javascript
adobe.target.ext.getRemoteOffers(params);
```

where `params` is an array of parameter objects, referring to each remote offer.  

## Params

> The following parameter object attributes can be provided:

Key | Type | Mandatory | Description
--- | ---- | --------- | -----------
`url` | String | Yes | Remote offer URL (must be on the same domain)
`selector` | String | Yes | CSS selector matching the elements used as remote offer containers
`success` | Function | No | Optional success callback, will be called once a remote offer has been successfully applied
`error` | Function | No | Optional error callback, to be called in case the remote offer could not be fetched
`method` | String | No | Method for handling remote offer injection into DOM. Possible values: `append` (default) or `replace`

## Notes

* In case an offer was successfully fetched, but the DOM element matching the offer selector is not yet present in the DOM at that time, the extension will attempt to apply the offer later, once any elements are added to the DOM. This is accomplished by the use of a MutationObserver.

## Example

```javascript
adobe.target.ext.getRemoteOffers([
	{
		url: '/promo1.html',
		selector: '#one',
		success: function () {
			console.log('Offer one delivered');
		},
		error: function () {
			console.log('Unable to fetch offer one');
		},
		method: 'replace'
	},
	{
		url: '/base/test/promo2.html',
		selector: '.two p'
	}
]);
```

## License

Apache-2.0 © [Adobe Systems, Inc.](http://www.adobe.com)
