/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { LoadingService } from './../../services/loading.service';
import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-newbroadcast',
  templateUrl: './newbroadcast.page.html',
  styleUrls: ['./newbroadcast.page.scss'],
})
export class NewbroadcastPage implements OnInit {

  accounts: any;
  account: any;
  broadcast = <any>{};


  broadcastMembers = [];

  userId



  constructor(
    public dataService: DataService,
    private toastController: ToastController,
    public loading: LoadingService,
    public angularDb: AngularFireDatabase,
    private navCtrl: NavController

  ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    this.dataService.getUsers().valueChanges().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  //Add friend to member of groups
  addToGroup(account) {
    this.broadcastMembers.push(account)
  }
  // Remove friend from members of group.
  removeFromGroup(account) {
    var index = -1;
    for (var i = 0; i < this.broadcastMembers.length; i++) {
      if (this.broadcastMembers[i].userId == account.userId) {
        index = i;
      }
    }
    if (index > -1) {
      this.broadcastMembers.splice(index, 1);
    }
  }


  async presentToast() {
    this.newBroadcast()
  }

  // Check if friend is already added to the group or not.
  inGroup(friend) {
    for (var i = 0; i < this.broadcastMembers.length; i++) {
      if (this.broadcastMembers[i].userId == friend.userId) {
        return true;
      }
    }
    return false;
  }

  newBroadcast() {
    var promise = new Promise((resolve) => {
      this.loading.show();
      var messages = []
      let lengthMemeber = this.broadcastMembers.length;
      //add system message that group is created
      messages.push({
        date: new Date().toString(),
        userId: firebase.auth().currentUser.uid,
        type: 'system',
        message: 'You created a broadcast list with ' + lengthMemeber + ' recipients.',
      });
      // Add members of the group
      var members = [];
      for (let i = 0; i < this.broadcastMembers.length; i++) {
        //let push the group member to member with only userId
        members.push(this.broadcastMembers[i].userId);
      }
      //Add group information and date

      this.broadcast.date = new Date().toString()
      this.broadcast.messages = messages;
      this.broadcast.members = members;
      this.broadcast.img = "assets/broadcast.png";
      this.broadcast.name = "Broadcast";
      this.broadcast.admin = [firebase.auth().currentUser.uid];

      // Lets add to firebase database
      this.angularDb.list('/groups/').push(this.broadcast).then((success) => {
        var groupId = success.key;
        //update the key
        success.update({
          key: groupId
        });
        var convasation = {
          key: groupId,
          me: "you",
          type: 'text',
          view: 'broadcast',
          date: new Date().toString(),
        }
        //add group referenceuser to user;
        this.angularDb.database.ref('conversations').child(firebase.auth().currentUser.uid).push(convasation).then(() => {
          // resolve(true);
        }).then(() => {
          this.loading.hide();
          this.navCtrl.pop();
        })
      })
    })
    return promise;
  }

}
