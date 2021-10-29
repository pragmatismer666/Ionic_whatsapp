/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { AlertService } from 'src/app/services/alert.service';
import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { take } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-groupopt',
  templateUrl: './groupopt.component.html',
  styleUrls: ['./groupopt.component.scss'],
})
export class GroupoptComponent implements OnInit {

  groupId: any;
  group = <any>{};
  user;

  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private router: Router,
    private toastController: ToastController,
    public dataService: DataService,
    private loading: LoadingService,
    // public userService: UserService,
    private alertCtrl: AlertController,
    private alertController: AlertController,
    public afDB: AngularFireDatabase,
    public alertService: AlertService
  ) {
    this.groupId = this.navParams.get("groupId")
    // this.currentUserId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    // fetch the database from firebase
    this.dataService.groups(this.groupId).valueChanges().subscribe((group) => {
      this.group = group;
    });
    //let get the user details
    this.dataService.getCurrentUser(firebase.auth().currentUser.uid).valueChanges().subscribe((user) => {
      this.user = user;
    })
  }

  groupInfo() {
    // router pages
    this.router.navigate(['/group-info', { 'groupId': this.groupId }]);
    // close popOver Methode 
    this.eventFromPopover();
  }

  // close popOver Function 
  eventFromPopover() {
    this.popoverController.dismiss();
  }

  // report case to user will be able erase the data from firebase
  async report() {
    this.popoverController.dismiss();
    const alert = await this.alertCtrl.create({
      header: 'Report this group to WhatsApp?',
      message: "Exit group and delete this group's messages",
      buttons: [
        {
          text: "CANCEL",
          handler: () => {

          }
        },
        {
          text: "REPORT",
          handler: () => {
            // loading show
            this.loading.show();
            // Remove member from group.
            this.group.members.splice(this.group.members.indexOf(this.user.userId), 1);
            this.dataService.groups(this.groupId).update({
              members: this.group.members,
            }).then(() => {
              // Add system message.
              firebase.database().ref('groups').child(this.groupId).child('messages').push({
                date: new Date().toString(),
                sender: firebase.auth().currentUser.uid,
                type: 'system',
                message: this.user.nikeName + ' has send report on this group, also left.',
                icon: 'megaphone'
              }).then((sucess) => {
                let key = sucess.key
                for (let i = 0; i < this.group.members.length; i++) {
                  firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                    key: key
                  }).then(() => {
                    this.deleteConversation();
                  })
                }
                // Remove group from user's group list.
                this.dataService.accountsGroups(this.user.userId).valueChanges().pipe(take(1)).subscribe((groups) => {
                  groups.splice(groups.indexOf(this.groupId), 1);
                  this.router.navigateByUrl('/home')
                })
              }).catch((error) => {
                // if something goes wrong catch handle this methode
                this.loading.hide();
                this.alertService.showErrorMessage('group/error-leave-group');
              })
            })
          }
        }
      ]
    })
    alert.present();
  }

  //handel the leave the gr\oups
  async exit() {
    this.popoverController.dismiss();
    const alert = await this.alertController.create({
      header: 'Confirm Leave',
      message: 'Are you sure you want to leave this group?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { }
        },
        {
          text: 'Leave',
          handler: () => {
            this.loading.show();
            // Remove member from group.
            this.group.members.splice(this.group.members.indexOf(this.user.userId), 1);
            this.dataService.groups(this.groupId).update({
              members: this.group.members,
            }).then(() => {
              // Add system message.
              firebase.database().ref('groups').child(this.groupId).child('messages').push({
                date: new Date().toString(),
                sender: firebase.auth().currentUser.uid,
                type: 'system',
                message: this.user.nikeName + ' has left this group.',
                icon: 'exit-outline'
              }).then((sucess) => {
                let key = sucess.key
                for (let i = 0; i < this.group.members.length; i++) {
                  firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                    key: key
                  }).then(() => {
                    this.deleteConversation();
                  })
                }
                // Remove group from user's group list.
                this.dataService.accountsGroups(this.user.userId).valueChanges().pipe(take(1)).subscribe((groups) => {
                  groups.splice(groups.indexOf(this.groupId), 1);
                  this.router.navigateByUrl('/home')
                })
              }).catch((error) => {
                this.loading.hide();
                this.alertService.showErrorMessage('group/error-leave-group');
              })
            })
          }
        }
      ]
    })
    alert.present()
  }

  // this will delete the conversation content;
  async deleteConversation() {
    await this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('key').equalTo(this.groupId).once('value', snap => {
      var res = snap.val();
      if (res != null) {
        let store = Object.keys(res)
        this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove();
      }
    })
  }
}
