/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-changenumber',
  templateUrl: './changenumber.page.html',
  styleUrls: ['./changenumber.page.scss'],
})
export class ChangenumberPage implements OnInit {

  constructor(
    private toast : ToastController
  ) { }

  ngOnInit() {
  }

   //pop a notification
   async toastShow() {
    const toast = await this.toast.create({
      message: 'Oops, This feature is not availabe on this version.',
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

}
