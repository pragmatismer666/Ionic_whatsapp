import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserpagePageRoutingModule } from './userpage-routing.module';

 
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { UserpagePage } from './userpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    UserpagePageRoutingModule
  ],
  declarations: [UserpagePage]
})
export class UserpagePageModule {}
