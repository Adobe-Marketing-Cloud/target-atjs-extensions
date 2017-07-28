# target-ng-module

## Installation

To install this library, run:

```bash
$ npm install @adobe/target-ng-module --save
```

## Consuming Target library module

Install the library and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import the library
import { TargetModule } from '@adobe/target-ng-module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify Target library as an import
    TargetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once the library is imported, you can use Target **mbox** directive in your Angular application:

```xml
<!-- You can now use Target mbox directive in app.component.html -->
<h1>
  {{title}}
</h1>
<div [mbox]="{mbox: 'sampleMbox'}">
  Default content
</div>
```

## Options

> The following Target options can be set on the **mbox** directive:

Key | Type | Mandatory | Description
--- | ---- | --------- | -----------
`mbox` | String | Yes | mbox name. It is mandatory if you want to track clicks. If not provided, an error will be logged and tracking event won't be attached.
`params` | Object | No | mbox parameters - an object of key-value pairs.
`timeout` | Number | No | timeout in milliseconds. If not specified, default adobe.target will be used.

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

To publish built package, login to NPM and then publish with:
```bash
$ npm publish dist
```

## License

Apache-2.0 © [Adobe Systems Inc.](mailto:anischev@adobe.com)
