import { Directive, Input, ElementRef } from '@angular/core';
import classnames from 'classnames';
import { TargetService } from './target.service';

interface Opts {
  mbox?: string,
  timeout?: number,
  params?: { [key: string]: string; },
  selector?: any
}

@Directive({
  selector: '[mbox]',
  providers: [TargetService]
})
export class TargetDirective {
  constructor(
    private elementRef: ElementRef,
    private targetService: TargetService
  ) { }

  addMboxClass (element) {
    element.className = classnames(element.className, {
      mboxDefault: element.className.indexOf('mboxDefault') === -1
    });
  }

  removeMboxClass (element) {
    element.className = element.className.replace(/\bmboxDefault\b/, '');
  }

  @Input() set mbox(mboxOpts: Opts) {
    const el = this.elementRef.nativeElement;
    mboxOpts.selector = el;
    this.addMboxClass(el);
    this.targetService.getOffer(mboxOpts)
      .then(this.targetService.applyOffer)
      .then(() => this.removeMboxClass(el))
      .catch((e) => {
        console.error(e);
        this.removeMboxClass(el);
      });
  }
}
