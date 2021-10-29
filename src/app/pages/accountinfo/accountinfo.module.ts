import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountinfoPageRoutingModule } from './accountinfo-routing.module';

import { AccountinfoPage } from './accountinfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountinfoPageRoutingModule
  ],
  declarations: [AccountinfoPage]
})
export class AccountinfoPageModule {}
