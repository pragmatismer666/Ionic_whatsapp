/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { LoadingService } from './../../services/loading.service';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PopoverController, NavParams, ToastController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit, AfterViewInit {

  tabs: any;

  constructor(
    // private events: Events,
    private navParams: NavParams,
    private popoverController: PopoverController,
    private router: Router,
    private toast: ToastController,
    private alertController: AlertController,
    public loading: LoadingService
  ) {

  }
  ngAfterViewInit(): void {
    this.tabs = this.navParams.get("tabs")
    // console.log(this.tabs)
  }

  ngOnInit() {
    // Get the Data from the popover page
    // this.tabs = this.navParams.get("tabs")
    // console.log(this.tabs)
  }

  // close popOver funtion
  eventFromPopover() {
    this.popoverController.dismiss();
  }

  settings() {
    // close popOver methdoe
    this.eventFromPopover();
    // router page to setting 
    this.router.navigateByUrl('/settings')
  }
  newGroup() {
    // close popOver methdoe
    this.eventFromPopover();
    //router page to new Group page
    this.router.navigateByUrl('/newgroup')
  }

  newBroadCast() {
    // close popOver methdoe
    this.eventFromPopover();
    //router page to new Broadecast
    this.router.navigateByUrl('/newbroadcast')
  }

  //pop a notification
  async statusPrivacy() {
    // close popOver methdoe
    this.eventFromPopover();
    // this is toast notification to the user 
    const toast = await this.toast.create({
      message: 'Oops, This feature is not availabe on this version.',
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  // clear the call log page  from the database
  async clearCallLog() {
    this.eventFromPopover();
    const alert = await this.alertController.create({
      message: 'Do you want to clear your entire call log?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            //loading show
            this.loading.show();
            // databse from the entire call log s
            firebase.database().ref('accounts').child(firebase.auth().currentUser.uid).child("call").remove().then(() => {
              //loading hide
              this.loading.hide();
            })
          }
        },
        {
          text: 'CANCEL',
          handler: () => { }
        }
      ]
    });
    await alert.present();
  }




}
