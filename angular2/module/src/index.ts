import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetDirective } from './target.directive';
import { TargetService } from './target.service';

export * from './target.directive';
export * from './target.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TargetDirective
  ],
  exports: [
    TargetDirective
  ]
})
export class TargetModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TargetModule,
      providers: [TargetService]
    };
  }
}
