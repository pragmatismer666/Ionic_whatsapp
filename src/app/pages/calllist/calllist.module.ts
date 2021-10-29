import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalllistPageRoutingModule } from './calllist-routing.module';

import { CalllistPage } from './calllist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalllistPageRoutingModule
  ],
  declarations: [CalllistPage]
})
export class CalllistPageModule {}
