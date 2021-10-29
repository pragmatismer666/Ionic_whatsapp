import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangenumberPageRoutingModule } from './changenumber-routing.module';

import { ChangenumberPage } from './changenumber.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangenumberPageRoutingModule
  ],
  declarations: [ChangenumberPage]
})
export class ChangenumberPageModule {}
