/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Injectable } from '@angular/core';
import { LoadingService } from './loading.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertService } from './alert.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private loading: LoadingService,
    private afAuth: AngularFireAuth,
    public angulaeDb: AngularFireDatabase,
    public alertService: AlertService,
    private alert: AlertController,
    private router: Router,
  ) { }

  // this help us to create the user database to firebase
  async loginPhoneNumber(phoneNUmber) {
    await firebase.database().ref("accounts/" + firebase.auth().currentUser.uid)
      .once('value').then((accounts) => {
        // this action when the user not created account,
        // it measn if not
        if (!accounts.val()) {
          let userId = firebase.auth().currentUser.uid
          // Set the image url link defualt
          let img = "assets/profile.png";
          // Set default description.
          let description = "Hello! I am a new Communicaters user.";
          let tempData = {
            img: img,
            username: phoneNUmber,
            phoneNumber: phoneNUmber,
            description: description,
            nikeName:'',
            userId: userId,
            status: '',
            dateCreated: new Date().toString(),
          }
          this.angulaeDb.object("accounts/" + firebase.auth().currentUser.uid).set(tempData).then(() => {
            this.loading.hide();
            this.router.navigateByUrl('/verify')
          }).then(() => {
            this.angulaeDb.object("accounts/" + firebase.auth().currentUser.uid).update({
              status: "Online"
            })
          })
        } else {
          this.router.navigateByUrl('/verify').then(() => {
            this.loading.hide();
            this.angulaeDb.object("accounts/" + firebase.auth().currentUser.uid).update({
              status: "Online"
            })
          })
        }
      })

  }

  



}
