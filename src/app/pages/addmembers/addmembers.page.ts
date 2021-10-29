/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { NavController } from '@ionic/angular';
import { LoadingService } from './../../services/loading.service';
import { DataService } from './../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-addmembers',
  templateUrl: './addmembers.page.html',
  styleUrls: ['./addmembers.page.scss'],
})
export class AddmembersPage implements OnInit {

  ID
  members;
  user: any;
  broadcast;
  public toAdd: any;

  memberslist = []
  membersUpdate = []

  accounts: any;
  userId: any;



  constructor(
    private actRoute: ActivatedRoute,
    public dataService: DataService,
    public loading: LoadingService,
    public angularDb: AngularFireDatabase,
    private navCtrl: NavController
  ) {
    this.ID = this.actRoute.snapshot.paramMap.get('Id');
    // console.log("broadcastId", this.ID);

  }

  ngOnInit() {
    this.members
    this.toAdd = [];
    //get the member length
    this.dataService.members(this.ID).valueChanges().subscribe((length) => {
      this.members = length.length;
    });

    // list image base image type
    this.dataService.groups(this.ID).valueChanges().subscribe((broadcast) => {
      this.broadcast = broadcast;
      if (broadcast.members) {
        broadcast.members.forEach((memberId) => {
          this.dataService.getUser(memberId).valueChanges().subscribe((member) => {
            // console.log('members', member)
            this.addOrUpdateMember(member)
          });
        });
      }
    });
    //Get User's to add
    this.dataService.getUsers().valueChanges().subscribe((accounts) => {
      this.accounts = accounts;
      // this.addOrUpdateAccount(accounts)
    });
    //let get the user details
    this.dataService.getCurrentUser(firebase.auth().currentUser.uid).valueChanges().subscribe((user) => {
      this.user = user;
      this.userId = user.userId;
    })
  }

  // Add or update member information for real-time sync.
  addOrUpdateMember(member) {
    if (!this.memberslist) {
      this.memberslist = [member];
    } else {
      var index = -1;
      for (var i = 0; i < this.memberslist.length; i++) {
        if (this.memberslist[i].userId == member.userId) {
          index = i;
        }
      }
      if (index > -1) {
        this.memberslist[index] = member;
      } else {
        this.memberslist.push(member);
      }
    }
  }

  // Add or update member information for real-time sync.
  addOrUpdateAccount(member) {
    if (!this.accounts) {
      this.accounts = [member];
    } else {
      var index = -1;
      for (var i = 0; i < this.accounts.length; i++) {
        if (this.accounts[i].userId == member.userId) {
          index = i;
        }
      }
      if (index > -1) {
        this.accounts[index] = member;
      } else {
        this.accounts.push(member);
      }
    }
  }


  // Check if user is a member of the group or not.
  isMember(account) {
    if (this.memberslist) {
      for (var i = 0; i < this.memberslist.length; i++) {
        if (this.memberslist[i].userId == account.userId) {
          return true;
        }
      }
    }
    return false;
  }

  //Add friend to member of groups
  addToGroup(account) {
    this.memberslist.push(account)
    this.membersUpdate.push(account);
  }

  // Remove friend from members of group.
  removeFromGroup(account) {
    var index = -1;
    for (var i = 0; i < this.memberslist.length; i++) {
      if (this.memberslist[i].userId == account.userId) {
        index = i;
      }
    }
    if (index > -1) {
      this.memberslist.splice(index, 1);
    }

    // Remove friend from membersUpdate of group.
    //second step;
    var index = -1;
    for (var i = 0; i < this.membersUpdate.length; i++) {
      if (this.membersUpdate[i].userId == account.userId) {
        index = i;
      }
    }
    if (index > -1) {
      this.membersUpdate.splice(index, 1);
    }
  }

  // update the member added to the platform
  update() {
    //loading show
    this.loading.show()
    this.membersUpdate.forEach((user) => {
      //push the member to the platform
      this.broadcast.members.push(user.userId);
      // system message notify to the user
      this.broadcast.messages.push({
        date: new Date().toString(),
        userId: firebase.auth().currentUser.uid,
        type: 'system',
        message: this.user.nikeName + 'has added ' + this.getNames(),
        icon: 'contacts'
      });
    })
    // Update group data on the database.
    this.dataService.groups(this.ID).update({
      members: this.broadcast.members,
      messages: this.broadcast.messages
    }).then(() => {
      //loading hide 
      this.loading.hide();
      // Back.
      this.navCtrl.pop()
    });
  }


  // Get names of the members to be added to the group.
  getNames() {
    var names = '';
    this.membersUpdate.forEach((userData) => {
      names += userData.nikeName + ', ';
    });
    return names.substring(0, names.length - 2);
  }

}
