# target-react-component
> React Component Adobe Target **at.js** extension  
> This extension returns a React component, to be used as container for content delivered by **at.js**

## Overview

The extension returns a React component, that acts as a container for offers delivered by **at.js**.  
Initially, it renders a hidden `<div>` element, which is later made visible once the offer content is successfully fetched by `adobe.target.getOffer()` and applied by `adobe.target.applyOffer()`.  
The returned React component is to be composed into React apps, e.g.: `<Target />`  
The component is available as a UMD module, to be included into Webpack/Browserify builds.

## Installation

Install with `npm i @adobe/target-react-component`

## Usage

```javascript (ES6)
import createTargetComponent from '@adobe/target-react-component';
const Target = createTargetComponent(React);

...

<Target data-mbox="testMbox">
  Default mbox content
</Target>
```  

## Options

> The following options can be set on the component as `data-` attributes:

Key | Type | Mandatory | Description
--- | ---- | --------- | -----------
`mbox` | String | Yes | mbox name. It is mandatory if you want to track clicks. If not provided, an error will be logged and tracking event won't be attached.
`params` | Object | No | mbox parameters - an object of key-value pairs, that has the following structure:<br>`{`<br>`"param1": "value1",`<br>`"param2": "value2"`<br>`}`
`timeout` | Number | No | timeout in milliseconds. If not specified, default adobe.target will be used. Default timeout is the one set in the at.js settings. This value can be configured using in the Target UI the on Setup->Implementation->at.js Settings page.

## Notes

* **at.js** must be included in the page before the React app using React components
* Server-side rendering is not yet supported, the extension is intended to be used solely on the client-side
* `params` attributes can be set as follows: `<Target data-mbox="myMbox" data-param1="value1" data-param2="value2" data-timeout="3000"/>`

## License

Apache-2.0 [Adobe Systems, Inc.](http://www.adobe.com)
