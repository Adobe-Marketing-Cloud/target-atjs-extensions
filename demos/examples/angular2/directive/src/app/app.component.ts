import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  atOpts = {
    mbox: 'simpleDirective'
  };
  demoCode = `export class AppComponent {
                ...
                targetOpts = {
                  mbox: 'simpleDirective'
                };
                ...
              }`;
}
