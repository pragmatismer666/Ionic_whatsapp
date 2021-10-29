/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { AlertService } from 'src/app/services/alert.service';
import { NavController, ToastController } from '@ionic/angular';
import { DataService } from './../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingService } from 'src/app/services/loading.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-group-info-edite',
  templateUrl: './group-info-edite.page.html',
  styleUrls: ['./group-info-edite.page.scss'],
})
export class GroupInfoEditePage implements OnInit {

  groupId: any;
  name: any;
  groupName: any;
  changeName;

  user;

  group: any;


  description;

  public formGroup: FormGroup;


  constructor(
    private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dataService: DataService,
    public angularDb: AngularFireDatabase,
    public loading: LoadingService,
    private navCtrl: NavController,
    private toastController: ToastController,
    public alertService: AlertService

  ) {
    this.groupId = this.actRoute.snapshot.paramMap.get('groupId')
    this.name = this.actRoute.snapshot.paramMap.get('name');

    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ])),
      dec: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]))
    });
  }

  ngOnInit() {
    this.dataService.groups(this.groupId).valueChanges().subscribe((group) => {
      this.group = group;
    });
    // let get the databse from the current user
    this.dataService.getCurrentUser(firebase.auth().currentUser.uid).valueChanges().subscribe((user) => {
      this.user = user;
    })

    this.dataService.groups(this.groupId).valueChanges().subscribe((data) => {
      this.groupName = data.name
    });
  }

  // save the changes that your made 
  saveChanges() {
    if (this.name === 'name' && this.changeName != '') {
      if (this.group.name != this.changeName) {
        this.loading.show();
        this.dataService.groups(this.groupId).update({
          name: this.changeName,
        }).then(() => {
          firebase.database().ref('groups').child(this.groupId).child('messages').push({
            date: new Date().toString(),
            userId: firebase.auth().currentUser.uid,
            type: 'system',
            message: this.user.nikeName + ' has change the group name to: ' + this.changeName + '.',
            icon: 'create'
          }).then((sucess) => {
            let key = sucess.key
            for (let i = 0; i < this.group.members.length; i++) {
              firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                key: key
              })
            }
            this.loading.hide();
            this.alertService.showGroupUpdatedMessage();
            this.navCtrl.pop();
          }).catch((error) => {
            this.loading.hide();
            this.alertService.showErrorMessage('group/error-update-group');
          })
        })
      }
    } else if (this.name === 'dec' && this.description != '') {
      this.loading.show();
      firebase.database().ref("group/").child(this.groupId).once("value").then((user) => {
        if (user.val()) {
          this.angularDb.object("group/" + this.groupId).update({
            description: this.description
          }).then(() => {
            firebase.database().ref('groups').child(this.groupId).child('messages').push({
              date: new Date().toString(),
              userId: firebase.auth().currentUser.uid,
              type: 'system',
              message: this.user.nikeName + ' has change the group name to: ' + this.description + '.',
              icon: 'create'
            }).then((sucess) => {
              let key = sucess.key
              for (let i = 0; i < this.group.members.length; i++) {
                firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                  key: key
                })
              }
              this.loading.hide();
              this.alertService.showGroupUpdatedMessage();
              this.navCtrl.pop()
            }).catch((error) => {
              this.loading.hide();
              this.alertService.showErrorMessage('group/error-update-group');
            })
          })
        }
      })
    }
  }

  // this handele the back buttom
  back() {
    this.navCtrl.pop()
  }





}
