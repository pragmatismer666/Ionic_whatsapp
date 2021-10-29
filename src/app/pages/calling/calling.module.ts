import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallingPageRoutingModule } from './calling-routing.module';

import { CallingPage } from './calling.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    CallingPageRoutingModule
  ],
  declarations: [CallingPage]
})
export class CallingPageModule {}
