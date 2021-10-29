import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsettingPageRoutingModule } from './chatsetting-routing.module';

import { ChatsettingPage } from './chatsetting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsettingPageRoutingModule
  ],
  declarations: [ChatsettingPage]
})
export class ChatsettingPageModule {}
