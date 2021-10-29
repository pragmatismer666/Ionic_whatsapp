import { HeaderDeclerationModule } from './../../directives/header-decleration.module';
import { CameraPageModule } from './../camera/camera.module';
import { StatusPageModule } from './../status/status.module';
import { ChatPageModule } from './../chat/chat.module';
import { CallPageModule } from './../call/call.module';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperTabsModule,
    HeaderDeclerationModule,
    HomePageRoutingModule,
    CallPageModule,
    ChatPageModule,
    StatusPageModule,
    CameraPageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
