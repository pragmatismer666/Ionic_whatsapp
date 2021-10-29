/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { Injectable } from '@angular/core';
import { AngularFireObject, AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  list: AngularFireList<any>;
  user: AngularFireObject<any>;

  constructor(
    public angularDb: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) { }

  listUnread(groupId) {
    return this.list = this.angularDb.list('/accounts/' + firebase.auth().currentUser.uid + '/groups/' + groupId + '/messagesRead/')
  }

  listMessage(groupId) {
    return this.list = this.angularDb.list('/groups/' + groupId + '/messages/')
  }

  // list of story post from the angular firedatabase
  getStory() {
    return this.list = this.angularDb.list('story/');
  }

  // list of story post from the angular firedatabase
  getStoryCurrent(userId) {
    return  this.angularDb.list('story/').query.orderByChild("postBy").equalTo(userId)
  }

  //get view list
  getview(viewId) {
    return this.list = this.angularDb.list("/views/" + viewId)
  }


  //post when a seen a story
  postView(postId) {
    return this.user = this.angularDb.object("/views/" + postId);
  }





  //Get user by userId
  //get the accounts group
  accountsGroups(userId) {
    return this.user = this.angularDb.object('/accounts/' + userId + '/groups/')
  }

  // Get messages of the group given the Id.
  getGroupMessage(groupId) {
    return this.list = this.angularDb.list('/groups/' + groupId + '/messages/');
  }

  listUnreadStatus(userId) {
    return this.angularDb.list('/messages/' + firebase.auth().currentUser.uid + '/' + userId + '/').query.orderByChild('read' && 'userId').equalTo('unread' && userId)
  }

  listUnreadChat(userId, key) {
    return this.list = this.angularDb.list('/messages/' + firebase.auth().currentUser.uid + '/' + userId + '/' + key);
  }


  // get the current user, load all data from the Database
  getCurrentUser(user) {
    return this.user = this.angularDb.object('accounts/' + user);
  }
  chat(userId) {
    return this.list = this.angularDb.list('/conversations/' + userId)
  }

  call(userId) {
    return this.list = this.angularDb.list('/accounts/' + userId + '/call')
  }
  // let invoke data from the firebase;
  groups(userId) {
    return this.user = this.angularDb.object('/groups/' + userId)
  }
  //get timline Post for the current user
  groupImage(userId) {
    return this.list = this.angularDb.list("groups/" + userId + "/message/", ref => ref.orderByChild('image'));
  }
  members(userId) {
    return this.list = this.angularDb.list("groups/" + userId + "/members/");
  }
  //Get user by userId
  getUser(userId) {
    return this.user = this.angularDb.object('accounts/' + userId)
  }
  userBock(userId) {
    return this.list = this.angularDb.list("/accounts/" + userId + "/userblocks/")
  }
  readSender(currerntUser) {
    return this.user = this.angularDb.object("/messages/" + firebase.auth().currentUser.uid + '/' + currerntUser)
  }
  userBocks(userId) {
    return this.list = this.angularDb.list("/accounts/" + userId + "/blocks/")
  }
  conversation(userId) {
    return this.list = this.angularDb.list("/conversations/" + userId)
  }
  postuserBock(userId) {
    return this.user = this.angularDb.object("/accounts/" + firebase.auth().currentUser.uid + "/blocks/")
  }
  postsenderBock(userId) {
    return this.user = this.angularDb.object("/accounts/" + userId + "/blocks/")
  }
  userblocksBy(userId) {
    return this.user = this.angularDb.object("/accounts/" + firebase.auth().currentUser.uid + "/userblocks/")
  }
  //get all users
  getUsers() {
    return this.list = this.angularDb.list('accounts', ref =>
      ref.orderByChild('username'));
  }

}
