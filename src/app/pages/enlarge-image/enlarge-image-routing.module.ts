import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnlargeImagePage } from './enlarge-image.page';

const routes: Routes = [
  {
    path: '',
    component: EnlargeImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnlargeImagePageRoutingModule {}
