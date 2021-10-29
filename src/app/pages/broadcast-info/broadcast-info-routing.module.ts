import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BroadcastInfoPage } from './broadcast-info.page';

const routes: Routes = [
  {
    path: '',
    component: BroadcastInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BroadcastInfoPageRoutingModule {}
