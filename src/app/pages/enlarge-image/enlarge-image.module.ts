import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnlargeImagePageRoutingModule } from './enlarge-image-routing.module';

import { EnlargeImagePage } from './enlarge-image.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnlargeImagePageRoutingModule
  ],
  declarations: [EnlargeImagePage]
})
export class EnlargeImagePageModule {}
