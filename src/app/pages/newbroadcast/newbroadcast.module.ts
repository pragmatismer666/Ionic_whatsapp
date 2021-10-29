import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewbroadcastPageRoutingModule } from './newbroadcast-routing.module';

import { NewbroadcastPage } from './newbroadcast.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NewbroadcastPageRoutingModule
  ],
  declarations: [NewbroadcastPage]
})
export class NewbroadcastPageModule {}
