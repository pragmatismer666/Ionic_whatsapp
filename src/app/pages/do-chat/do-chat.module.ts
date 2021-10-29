import { PipesModule } from './../../pipes/pipes.module';
import { TimeFormatPipe } from './../../pipes/time-format/time-format';
import { MomentPipe } from './../../pipes/moment/moment';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoChatPageRoutingModule } from './do-chat-routing.module';

import { DoChatPage } from './do-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    DoChatPageRoutingModule
  ],
  declarations: [DoChatPage]
})
export class DoChatPageModule {}
