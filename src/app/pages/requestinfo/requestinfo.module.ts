import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestinfoPageRoutingModule } from './requestinfo-routing.module';

import { RequestinfoPage } from './requestinfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestinfoPageRoutingModule
  ],
  declarations: [RequestinfoPage]
})
export class RequestinfoPageModule {}
