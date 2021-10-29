import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BroadcastInfoPageRoutingModule } from './broadcast-info-routing.module';

import { BroadcastInfoPage } from './broadcast-info.page';
import { IonicHeaderParallaxModule } from 'ionic-header-parallax';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    IonicHeaderParallaxModule,
    BroadcastInfoPageRoutingModule
  ],
  declarations: [BroadcastInfoPage]
})
export class BroadcastInfoPageModule {}
