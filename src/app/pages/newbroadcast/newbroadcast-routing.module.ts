import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewbroadcastPage } from './newbroadcast.page';

const routes: Routes = [
  {
    path: '',
    component: NewbroadcastPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewbroadcastPageRoutingModule {}
