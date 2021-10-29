/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    private loadCtrl: LoadingController
  ) { }

  isLoading = false;
  loading: any;
  // loading system;
  async show(): Promise<void> {
    this.isLoading = true;
    return await this.loadCtrl.create({
      duration: 5000,
      spinner: "circles",
      message: 'Please wait...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present()
        .then(() => {
          if (!this.isLoading) {
            a.dismiss();
          }
        });
    });
  }
// after loading will be hide.
  async hide() {
    this.isLoading = false;
    return await this.loadCtrl.dismiss();
  }

  // i for the loading pro 
  async showPro(): Promise<void> {
    this.isLoading = true;
    return await this.loadCtrl.create({
      spinner: "circles",
      message: 'Please wait...',
      cssClass: 'custom-class custom-loading'
    }).then(a => {
      a.present()
        .then(() => {
          if (!this.isLoading) {
            a.dismiss();
          }
        });
    });
  }
  async hidePro() {
    this.isLoading = false;
    return await this.loadCtrl.dismiss();
  }


}

