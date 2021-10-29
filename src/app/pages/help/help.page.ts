/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  constructor(
    private router: Router,
    private toast: ToastController
  ) { }

  ngOnInit() {
  }

  appInfo(){
    this.router.navigateByUrl('/accountinfo')
  }

  // send mail to the developer
  mail(){
    window.open(
      `mailto:abubakarpagas@gmail.com?Subject=Help`,
      "_system"
    )
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
