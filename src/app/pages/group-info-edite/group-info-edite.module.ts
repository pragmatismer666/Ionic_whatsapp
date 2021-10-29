import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupInfoEditePageRoutingModule } from './group-info-edite-routing.module';

import { GroupInfoEditePage } from './group-info-edite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    GroupInfoEditePageRoutingModule
  ],
  declarations: [GroupInfoEditePage]
})
export class GroupInfoEditePageModule {}
