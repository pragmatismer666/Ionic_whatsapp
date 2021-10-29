import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestinfoPage } from './requestinfo.page';

const routes: Routes = [
  {
    path: '',
    component: RequestinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestinfoPageRoutingModule {}
