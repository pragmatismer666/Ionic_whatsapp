import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderScrollDirective } from './header-scroll.directive';


@NgModule({
  declarations: [HeaderScrollDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderScrollDirective
  ]
})
export class HeaderDeclerationModule { }
