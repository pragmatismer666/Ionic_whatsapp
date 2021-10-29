/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { UserService } from './../../services/user.service';
import { LoadingService } from './../../services/loading.service';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { CallNumber } from '@ionic-native/call-number/ngx';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  userId: any;
  nikeName: any;
  phoneNumber: any;
  image: any;
  description: any;
  dateDec: any;
  isBlock;
  currentUserId


  constructor(
    private actRoute: ActivatedRoute,
    public dataService: DataService,
    private alertCtrl: AlertController,
    private loading: LoadingService,
    public afDB: AngularFireDatabase,
    public userService: UserService,
    private toastController: ToastController,
    private navCtrl: NavController,
    private callNumber: CallNumber,
    private toast: ToastController,
    private router: Router
  ) {
    // get the userId has been pass
    this.userId = this.actRoute.snapshot.paramMap.get('userId')
    // pass the current user have been using
    this.currentUserId = firebase.auth().currentUser.uid;
  }

  //Initialize the App after loaded
  ngOnInit() {
    // fetch the data info
    this.dataService.getCurrentUser(this.userId).valueChanges().subscribe((user) => {
      this.nikeName = user.nikeName;
      this.phoneNumber = user.phoneNumber;
      this.image = user.img;
      this.description = user.description;
      this.dateDec = user.dateDec;
      this.dataService.userBock(firebase.auth().currentUser.uid).valueChanges().subscribe((blocks) => {
        this.isBlock = _.findKey(blocks, block => {
          return block = firebase.auth().currentUser.uid;
        })
        // if has been blocked pass the true condition 
        if (this.isBlock) {
          this.isBlock = true;
        } else {
          // if not pass false condition
          this.isBlock = false;
        }
      })
    })
  }

  //Report the user to the owner of the app..
  // and else Block the user clear the caht messages
  async report() {
    const alert = await this.alertCtrl.create({
      header: 'Report this contact to WhatsApp from Pagas',
      message: "Block contact and delete this chat's messages",
      buttons: [
        {
          text: "CANCEL",
          handler: () => { }
        },
        {
          text: "REPORT",
          handler: () => {
            this.loading.show()
            this.deleteChat().then(() => {
              this.presentToast()
              this.loading.hide();
              if (!this.isBlock) {
                this.block();
              }
            })
          }
        }
      ]
    })
    alert.present();
  }

  // Block Function
  async block() {
    // if not bloked will be present this methode
    if (!this.isBlock) {
      const alert = await this.alertCtrl.create({
        message: "Block" + this.nikeName + "Blocked contacts will no longer be able to call you or send messages.",
        buttons: [
          {
            text: "CANCEL",
            handler: () => { }
          },
          {
            text: "BLOCK",
            handler: () => {
              this.blockUser()
            }
          }
        ]
      })
      alert.present();
    }
  }
  // present the toast notification
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Report sent and' + this.nikeName + 'has been blocked',
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  // unBlock the User
  unBlock() {
    //loading Show
    this.loading.show()
    this.userService.unblock(this.currentUserId, this.userId).then(() => {
      //loading hide
      this.loading.hide();
    })
  }

  // Block the User
  blockUser() {
    // loading show
    this.loading.show()
    this.userService.block(this.currentUserId, this.userId).then(() => {
      //loading hide
      this.loading.hide();
    })
  }

  //Delete the chat conversation
  async deleteChat() {
    // loading show
    this.loading.show();
    await this.afDB.database.ref('messages').child(firebase.auth().currentUser.uid).child(this.userId).remove().then(() => {
      // and also the conversation
      this.deleteConversation();
      //loading hide
      this.loading.hide();
    })
  }
  // this will delete the conversation content;
  async deleteConversation() {
    await this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(this.userId).once('value', snap => {
      var res = snap.val();
      if (res != null) {
        let store = Object.keys(res)
        this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove();
      }
    })
  }

  //pop back
  back() {
    this.navCtrl.pop()
  }

  // make dial call
  calls() {
    this.callNumber.callNumber(`${this.phoneNumber}`, true).then(() => {
      this.afDB.list('/accounts/' + firebase.auth().currentUser.uid + '/call/').push({
        date: new Date().toString(),
        userId: this.userId,
        type: 'calling',
        icon: 'call',
        call: 'call'
      }).then(() => {
        this.afDB.list('/accounts/' + this.userId + '/call/').push({
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'calling',
          icon: 'call',
          call: 'misscall'
        })
      })
      // if something goes wrong toast will handle the case
    }).catch(err => this.something());
  }

  //toast notification
  async something() {
    const toast = await this.toast.create({
      message: 'Something going wrong.',
      duration: 2000
    });
    toast.present();
  }


  // make video calls
  videoCall() {
    this.router.navigate(["/calling", { 'image': this.image, 'name': this.nikeName, 'userId': this.userId }])
  }


}
