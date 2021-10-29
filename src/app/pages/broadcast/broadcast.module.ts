import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BroadcastPageRoutingModule } from './broadcast-routing.module';

import { BroadcastPage } from './broadcast.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    BroadcastPageRoutingModule,
  ],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [BroadcastPage]
})
export class BroadcastPageModule {}
