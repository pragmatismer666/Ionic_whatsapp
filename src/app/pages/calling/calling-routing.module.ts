import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallingPage } from './calling.page';

const routes: Routes = [
  {
    path: '',
    component: CallingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallingPageRoutingModule {}
