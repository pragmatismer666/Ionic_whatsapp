/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private toast: ToastController,
    private router: Router,
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

  // router page 
  security() {
    this.router.navigateByUrl("/security")
  }

  // router page 
  changeNumber() {
    this.router.navigateByUrl('/changenumber')
  }

  // router page 
  reqestInfo() {
    this.router.navigateByUrl('/requestinfo')
  }

  // router page 
  deleteAccount() {
    this.router.navigateByUrl('/delete-account')

  }

}
