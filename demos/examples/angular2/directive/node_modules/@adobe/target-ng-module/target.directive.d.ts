import { ElementRef } from '@angular/core';
import { TargetService, Opts } from './target.service';
export declare class TargetDirective {
    private elementRef;
    private targetService;
    constructor(elementRef: ElementRef, targetService: TargetService);
    addMboxClass(element: any): void;
    removeMboxClass(element: any): void;
    mbox: Opts;
}
