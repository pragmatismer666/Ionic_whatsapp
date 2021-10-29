/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { StatusService } from './../../services/status.service';
import { Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { EventService } from '../../services/event.service';
import { LoadingService } from '../../services/loading.service';
import { ChatService } from '../../services/chat.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataService } from '../../services/data.service';
import { ToastController, Platform } from '@ionic/angular';
import * as firebase from 'firebase';
import { Network } from '@ionic-native/network/ngx';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  Conversations = [].reverse();
  allUser = [];
  isLoading = true;
  userList: any;
  user: any;
  userLength: any;
  conversations: any
  currentUserId: any;
  lenght
  userId: any;
  private subscription: any;
  groups: any;

  img = 'assets/profile.png';

  constructor(
    private router: Router,
    public alertService: AlertService,
    public events: EventService,
    public ngZone: NgZone,
    public loading: LoadingService,
    public chatService: ChatService,
    public afDB: AngularFireDatabase,
    public dataService: DataService,
    private toast: ToastController,
    private network: Network,
    private platform: Platform,
    public statusService: StatusService
  ) {
    this.currentUserId = firebase.auth().currentUser.uid
    // calling the connetion to invoke 
    this.connection();
    // when the platform is ready
    this.platform.ready().then(() => {
      // this handle the  online methode or offline
      this.statusService.onlineStatus();
    });
  }

  ngOnInit() {
    // initialized the view message conversation and group and broadcast 
    this.viewMessaging()
    //get the conversations length
    this.dataService.conversation(firebase.auth().currentUser.uid).valueChanges().subscribe((lengths) => {
      this.conversations = lengths;
      this.isLoading = false;

    })
    this.dataService.getUsers().valueChanges().subscribe((userlist) => {
      // slipe the maximun length to view
      this.userList = userlist.slice(0, 5)
    })

  }
  // this will delete the conversation content;
  async deleteConversation(item) {
    await this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('userId').equalTo(item.userId).once('value', snap => {
      var res = snap.val()
      if (res != null) {
        let store = Object.keys(res)
        this.afDB.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove();
      }
    })
  }

  // after leave the page from chat will be
  ionViewDidLeave() {
    this.events.subscribe('conversations', () => { })
  }

  // when view did enter 
  ionViewDidEnter() {
    // this will initial the conversation item for the list
    this.viewMessaging()
  }

  // set the connection when the data offline   
  connection() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.statusService.offlineStatusLog();
    });
    disconnectSubscription.unsubscribe
    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.statusService.onlineStatus();
      setTimeout(() => {
        if (this.network.type === 'wifi') {
        }
      }, 3000);
    });
    connectSubscription.unsubscribe();
  }


  // this handle also route to chat module pagas
  doChat(userId) {
    // if the cuurent user tap route to the profile page
    if (userId === this.currentUserId) {
      this.router.navigateByUrl("/profile")
    } else {
      // route to chat message
      this.router.navigate(['/do-chat', { 'userId': userId }])
    }
  }
  // this handle also route to group chat module pagas
  groupChat(groupKey) {
    this.router.navigate(['/group-chat', { 'key': groupKey }])
  }

  // this handle also route to broadcast chat module pagas
  broadcast(broadcastKey) {
    this.router.navigate(['/broadcast', { 'key': broadcastKey }])
  }

  // user can navigate form other page//
  userpagas() {
    this.router.navigateByUrl("/userpage")
  }

  // this will notify the option
  async notification() {
    const toast = await this.toast.create({
      message: 'Oops, wait for the developer update for next version.',
      duration: 3000,
    });
    toast.present();
  }


  viewMessaging() {
    // let the message  chat bot with the group chat
    this.userId = firebase.auth().currentUser.uid;
    this.dataService.chat(this.userId).valueChanges().subscribe((groupIds) => {
      this.Conversations = [];
      // let make list forEach of item from the list
      groupIds.forEach((groupId) => {
        let tempData = <any>{};
        tempData = groupId;
        this.dataService.getUser(groupId.userId).valueChanges().subscribe((user) => {
          tempData.nikeName = user.nikeName;
          tempData.img = user.img;
          this.dataService.listUnreadStatus(groupId.userId).once('value', snap => {
            var res = snap.val();
            let store = Object.keys(res)
            tempData.unreadMessagesCount = store.length;
          })
        })
        // console.log("userDAta", tempData)
        this.dataService.groups(groupId.key).valueChanges().subscribe((group) => {
          tempData.groupName = group.name;
          tempData.groupImage = group.img;
          tempData.groupKey = group.key;
          this.dataService.listMessage(groupId.key).valueChanges().subscribe((message) => {
            let messages = message.slice(-1)[0]
            tempData.groupMessage = messages.message;
          })
          this.dataService.listUnread(groupId.key).valueChanges().subscribe((unread) => {
            tempData.unreadGroupCount = unread.length;
            // console.log("num", unread.length)
          })
          // console.log("userData", this.groups)
        });
        // console.log("Data", tempData)
        this.Conversations.unshift(tempData);
      })
      // }
    })

  }


  //Add or update friend data fro real-time sync.
  addOrUpdategroups(group) {
    if (!this.groups) {
      this.groups = [group];
    } else {
      var index = -1;
      for (var i = 0; i < this.groups.length; i++) {
        if (this.groups[i].key == group.key) {
          index = i;
        }
      }
      if (index > -1) {
        this.groups[index] = group;
      } else {
        this.groups.push(group);
      }
    }
  }


}
