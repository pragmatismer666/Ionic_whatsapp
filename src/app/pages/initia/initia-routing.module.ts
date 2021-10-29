import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitiaPage } from './initia.page';

const routes: Routes = [
  {
    path: '',
    component: InitiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitiaPageRoutingModule {}
