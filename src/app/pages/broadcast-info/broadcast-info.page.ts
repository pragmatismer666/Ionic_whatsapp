/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { LoadingService } from './../../services/loading.service';
import { DataService } from './../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-broadcast-info',
  templateUrl: './broadcast-info.page.html',
  styleUrls: ['./broadcast-info.page.scss'],
})
export class BroadcastInfoPage implements OnInit {

  broadcastId: any;
  members: any;
  broadcast: any;
  public broadcastMembers: any;
  broadcastImage: any;
  user;
  broadcastName: any;
  broadcastDate: any;


  constructor(
    private actRoute: ActivatedRoute,
    public dataService: DataService,
    private router: Router,
    public loading: LoadingService,
    public afDB: AngularFireDatabase,

  ) {
    // get the broadcast ID
    this.broadcastId = this.actRoute.snapshot.paramMap.get('broadcastId');
  }

  ngOnInit() {
    //get the member length
    this.dataService.members(this.broadcastId).valueChanges().subscribe((length) => {
      this.members = length.length;
    })
    // list image base image type
    this.dataService.groups(this.broadcastId).valueChanges().subscribe((broadcast) => {
      //pass the information to the veriable
      this.broadcast = broadcast;
      this.broadcastImage = broadcast.img;
      this.broadcastName = broadcast.name;
      this.broadcastDate = broadcast.dateCreated
      if (broadcast.members) {
        // list member for each and their info
        broadcast.members.forEach((memberId) => {
          this.dataService.getUser(memberId).valueChanges().subscribe((member) => {
            this.addUpdateOrRemoveMember(member);
          });
        });
      }
    });
    //let get the user details
    this.dataService.getCurrentUser(firebase.auth().currentUser.uid).valueChanges().subscribe((user) => {
      this.user = user;
    })

  }

  // Get names of the members to be added to the group.
  // Check if user exists in the group then add/update user.
  // If the user has already left the group, remove user from the list.
  addUpdateOrRemoveMember(member) {
    if (this.broadcast) {
      if (this.broadcast.members.indexOf(member.userId) > -1) {
        // User exists in the group.
        if (!this.broadcastMembers) {
          this.broadcastMembers = [member];
        } else {
          var index = -1;
          for (var i = 0; i < this.broadcastMembers.length; i++) {
            if (this.broadcastMembers[i].userId == member.userId) {
              index = i;
            }
          }
          // Add/Update User.
          if (index > -1) {
            this.broadcastMembers[index] = member;
          } else {
            this.broadcastMembers.push(member);
          }
        }
      } else {
        // User already left the group, remove member from list.
        var index = -1;
        for (var i = 0; i < this.broadcastMembers.length; i++) {
          if (this.broadcastMembers[i].userId == member.userId) {
            index = i;
          }
        }
        if (index > -1) {
          this.broadcastMembers.splice(index, 1);
        }
      }
    }
  }

  // router to the add members pages with the broadcast ID
  addMembers() {
    this.router.navigate(['/addmembers', { 'Id': this.broadcastId }])
  }
  //this handle delete the broadcast 
  async deleteBroadcast() {
    // loading show 
    this.loading.show()
    await this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('key').equalTo(this.broadcastId).once('value', snap => {
      var res = snap.val();
      if (res != null) {
        let store = Object.keys(res)
        this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove();
      }
    }).then(() => {
      //also remove from the group database
      this.afDB.database.ref('groups').child(this.broadcastId).remove();
      // loading hide
      this.loading.hide();
      //aslo then router to the home page
      this.router.navigateByUrl('/home')
    })

  }
}
