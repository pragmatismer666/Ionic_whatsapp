import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitiaPageRoutingModule } from './initia-routing.module';

import { InitiaPage } from './initia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitiaPageRoutingModule
  ],
  declarations: [InitiaPage]
})
export class InitiaPageModule {}
