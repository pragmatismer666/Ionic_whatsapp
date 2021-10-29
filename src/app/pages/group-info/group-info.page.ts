/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { AngularFireStorage } from '@angular/fire/storage';
import { ImageService } from './../../services/image.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { LoadingService } from './../../services/loading.service';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertService } from 'src/app/services/alert.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { take, finalize } from 'rxjs/operators';
import * as firebase from 'firebase';




@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.page.html',
  styleUrls: ['./group-info.page.scss'],
})
export class GroupInfoPage implements OnInit {

  private groupId: any;
  group = <any>{};
  public groupMembers: any;
  public alert: any;
  public user: any;
  public subscription: any;
  isAdmin: any;
  Gallery: any;
  imageCount: any;
  members: any;
  // GroupInfoPage
  // This is the page where the user can view group information, change group information, add members, and leave/delete group.
  private groupPhotoOption: CameraOptions;


  constructor(
    private actRoute: ActivatedRoute,
    public dataService: DataService,
    private camera: Camera,
    public angularDb: AngularFireDatabase,
    public loading: LoadingService,
    private alertController: AlertController,
    public alertService: AlertService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    public imageService: ImageService,
    public afstorage: AngularFireStorage
  ) {
    // get groupId 
    this.groupId = this.actRoute.snapshot.paramMap.get('groupId')

    // group photo Option 
    this.groupPhotoOption = {
      quality: 100,
      targetHeight: 530,
      targetWidth: 530,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      allowEdit: true
    }
  }

  ngOnInit() {
    //get the member length
    this.dataService.members(this.groupId).valueChanges().subscribe((length) => {
      this.members = length.length;
    })

    // list the image order by image
    this.getGroupGallery()

    // list image base image type
    this.dataService.groups(this.groupId).valueChanges().subscribe((group) => {
      this.group = group;
      if (group.admin) {
        let index = _.indexOf(group.admin, firebase.auth().currentUser.uid);
        if (index > - 1) {
          this.isAdmin = true;
        }
      }

      // list the member from the group member
      if (group.members) {
        group.members.forEach((memberId) => {
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

  // if is Admin or not
  isAdminOrNotAdmin(member) {
    let index = _.indexOf(this.group.admin, member.userId);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  // get post timeline for the gallery
  getGroupGallery() {
    this.dataService.groupImage(this.groupId).valueChanges().subscribe((post) => {
      this.Gallery = []
      this.imageCount = post.length;
      post.forEach((timeline) => {
        let tempData = <any>{};
        tempData = timeline;
        this.Gallery.unshift(tempData);
      })
    })
  }

  // let create  a assign the admin member
  async assignAdmin(member) {
    if (this.user.userId != member.userId) {
      if (this.isAdmin && this.user.userId !== member.userId) {
        if (this.isAdminOrNotAdmin(member)) {
          const actionSheet = await this.actionSheetController.create({
            buttons: [
              {
                text: 'Remove Admin',
                handler: () => {
                  this.loading.show();
                  let index = _.indexOf(this.group.admin, member.userId);
                  if (index >= 0) {
                    this.group.admin.splice(index, 1);
                    this.dataService.groups(this.groupId).update({
                      admin: this.group.admin,
                    }).then(() => {
                      firebase.database().ref('groups').child(this.groupId).child('messages').push({
                        date: new Date().toString(),
                        sender: this.user.userId,
                        type: 'system',
                        message: this.user.nikeName + ' has removed ' + member.nikeName + ' as admin.',
                        icon: 'person-remove'
                      }).then((sucess) => {
                        let key = sucess.key
                        for (let i = 0; i < this.group.members.length; i++) {
                          firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                            key: key
                          })
                        }
                      }).then(() => {
                        // Back.
                        this.loading.hide();
                      })
                    });
                  } else {
                    this.loading.hide();
                    this.alertService.showAlert('Failed', "Member not admin.")
                  }
                },
              },
              {
                // it invoke the message chat page
                text: 'Message ' + member.nikeName,
                handler: () => {
                  this.router.navigate(['/do-chat', { 'userId': member.userId }])
                }
              },
              {

                text: 'View ' + member.nikeName,
                handler: () => {
                  this.router.navigate(['/do-chat', { 'userId': member.userId }])
                }
              },
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => { }
              }
            ]
          })
          actionSheet.present();
        } else {
          const actionSheet = await this.actionSheetController.create({
            buttons: [
              {
                text: 'Make Admin',
                role: 'share',
                handler: () => {
                  this.loading.show();
                  let index = _.indexOf(this.group.admin, member.userId);
                  if (index < 0) {
                    let _tempAdmin = this.group.admin;
                    _tempAdmin.push(member.userId)
                    this.dataService.groups(this.groupId).update({
                      admin: _tempAdmin,
                    }).then(() => {
                      // this handle thne message page send chat notifation
                      firebase.database().ref('groups').child(this.groupId).child('messages').push({
                        date: new Date().toString(),
                        sender: this.user.userId,
                        type: 'system',
                        message: this.user.nikeName + ' has make ' + member.nikeName + ' as admin.',
                        icon: 'person-add'
                      }).then((sucess) => {
                        let key = sucess.key
                        for (let i = 0; i < this.group.members.length; i++) {
                          firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                            key: key
                          })
                        }
                      }).then(() => {
                        // Back.
                        this.loading.hide();
                      })

                    });
                  } else {
                    this.loading.hide();
                    this.alertService.showAlert('Failed', "Member alerday admin.")
                  }

                }
              },
              {
                text: 'Message ' + member.nikeName,
                handler: () => {
                  this.router.navigate(['/do-chat', { 'userId': member.userId }])
                }
              },
              {
                text: 'View ' + member.nikeName,
                handler: () => {
                  this.router.navigate(['/do-chat', { 'userId': member.userId }])
                }
              },
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => { }
              }
            ]
          })
          actionSheet.present();
        }

      } else {
        const actionSheet = await this.actionSheetController.create({
          buttons: [
            {
              text: 'Message ' + member.nikeName,
              handler: () => {
                this.router.navigate(['/do-chat', { 'userId': member.userId }])
              }
            },
            {
              text: 'View ' + member.nikeName,
              handler: () => {
                this.router.navigate(['/do-chat', { 'userId': member.userId }])
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => { }
            }
          ]
        })
        actionSheet.present();
      }
    }

  }

  // Get names of the members to be added to the group.
  // Check if user exists in the group then add/update user.
  // If the user has already left the group, remove user from the list.
  addUpdateOrRemoveMember(member) {
    if (this.group) {
      if (this.group.members.indexOf(member.userId) > -1) {
        // User exists in the group.
        if (!this.groupMembers) {
          this.groupMembers = [member];
        } else {
          var index = -1;
          for (var i = 0; i < this.groupMembers.length; i++) {
            if (this.groupMembers[i].userId == member.userId) {
              index = i;
            }
          }
          // Add/Update User.
          if (index > -1) {
            this.groupMembers[index] = member;
          } else {
            this.groupMembers.push(member);
          }
        }
      } else {
        // User already left the group, remove member from list.
        var index = -1;
        for (var i = 0; i < this.groupMembers.length; i++) {
          if (this.groupMembers[i].userId == member.userId) {
            index = i;
          }
        }
        if (index > -1) {
          this.groupMembers.splice(index, 1);
        }
      }
    }
  }

  //handel ot delete the groups
  async deleteGroup() {
    const alert = await this.alertController.create({
      header: ' Confirm Delete',
      message: "Are you sure you want delete this group",
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          handler: (data) => {
            // Delete group image.
            this.angularDb.object('/accounts/' + firebase.auth().currentUser.uid + '/groups/' + this.groupId).remove().then(() => {
              this.dataService.groups(this.groupId).remove();
            });
          }
        }
      ]
    })
    alert.present();
  }



  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Okay',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }


  // change the group Name
  changeGroupInfoName() {
    // pass the parameter is name
    let name = 'name'
    // route to the page to the group edite
    this.router.navigate(['/group-info-edite', { 'groupId': this.groupId, 'name': name }])
  }
  // change the group decription
  changeGroupInfoDec() {
    // pass the parameter is dec means description
    let name = 'dec'
    // route to the page to the group edite
    this.router.navigate(['/group-info-edite', { 'groupId': this.groupId, 'name': name }])
  }

  //Set the photo 
  async changeGroupPhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Group Picture',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.loading.show();
            this.imageService.setGroupPhotoProfile(this.groupId, this.camera.PictureSourceType.CAMERA).then((group) => {
              this.dataService.groups(this.groupId).update({
                img: group,
              }).then(() => {
                // then let add to systme massage can any one see in the group
                firebase.database().ref('groups').child(this.groupId).child('messages').push({
                  date: new Date().toString(),
                  userId: firebase.auth().currentUser.uid,
                  type: 'system',
                  message: this.user.nikeName + ' has changed the group photo.',
                  icon: 'camera'
                }).then((sucess) => {
                  let key = sucess.key
                  for (let i = 0; i < this.group.members.length; i++) {
                    firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                      key: key
                    })
                  }
                  this.loading.hide();
                  this.alertService.showGroupUpdatedMessage();
                }).catch((error) => {
                  this.loading.hide();
                  this.alertService.showErrorMessage('group/error-update-group');
                })
              })
            })
          }
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.loading.show();
            this.imageService.setGroupPhotoProfile(this.groupId, this.camera.PictureSourceType.PHOTOLIBRARY).then((group) => {
              this.dataService.groups(this.groupId).update({
                img: group,
              }).then(() => {
                // then let add to systme massage can any one see in the group
                firebase.database().ref('groups').child(this.groupId).child('messages').push({
                  date: new Date().toString(),
                  userId: firebase.auth().currentUser.uid,
                  type: 'system',
                  message: this.user.nikeName + ' has changed the group photo.',
                  icon: 'camera'
                }).then((sucess) => {
                  let key = sucess.key;
                  for (let i = 0; i < this.group.members.length; i++) {
                    firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                      key: key
                    })
                  }
                  this.loading.hide();
                  this.alertService.showGroupUpdatedMessage();
                }).catch((error) => {
                  this.loading.hide();
                  this.alertService.showErrorMessage('group/error-update-group');
                })
              })
            })

          }
        }, {
          text: 'Cancel',
          icon: 'help-circle',
          role: 'cancel',
          handler: () => {

          }
        }]
    });
    await actionSheet.present();
  }


  //handel the leave the gr\oups
  async exit() {
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
    await this.angularDb.database.ref('conversations').child(firebase.auth().currentUser.uid).orderByChild('key').equalTo(this.groupId).once('value', snap => {
      var res = snap.val();
      if (res != null) {
        let store = Object.keys(res)
        this.angularDb.database.ref('conversations').child(firebase.auth().currentUser.uid).child(store[0]).remove();
      }
    })
  }

  // naviget to the members pages
  addMembers() {
    this.router.navigate(['/addmembers', { 'Id': this.groupId }])
  }

  // change the group photo
  async changeGroupInfoPhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Group Picture',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.loading.show();
            this.uploadGroupPhotoMessage(this.groupId, this.camera.PictureSourceType.CAMERA).then((group) => {
              this.dataService.groups(this.groupId).update({
                img: group,
              }).then(() => {
                // then let add to systme massage can any one see in the group
                firebase.database().ref('groups').child(this.groupId).child('messages').push({
                  date: new Date().toString(),
                  userId: firebase.auth().currentUser.uid,
                  type: 'system',
                  message: this.user.nikeName + ' has changed the group photo.',
                  icon: 'camera'
                }).then((sucess) => {
                  let key = sucess.key
                  for (let i = 0; i < this.group.members.length; i++) {
                    firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                      key: key
                    })
                  }
                  this.loading.hide();
                  this.alertService.showGroupUpdatedMessage();
                }).catch((error) => {
                  this.loading.hide();
                  this.alertService.showErrorMessage('group/error-update-group');
                })
              })
            })
          }
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.loading.show();
            this.uploadGroupPhotoMessage(this.groupId, this.camera.PictureSourceType.PHOTOLIBRARY).then((group) => {
              this.dataService.groups(this.groupId).update({
                img: group,
              }).then(() => {
                // then let add to systme massage can any one see in the group
                firebase.database().ref('groups').child(this.groupId).child('messages').push({
                  date: new Date().toString(),
                  userId: firebase.auth().currentUser.uid,
                  type: 'system',
                  message: this.user.nikeName + ' has changed the group photo.',
                  icon: 'camera'
                }).then((sucess) => {
                  let key = sucess.key;
                  for (let i = 0; i < this.group.members.length; i++) {
                    firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
                      key: key
                    })
                  }
                  this.loading.hide();
                  this.alertService.showGroupUpdatedMessage();
                }).catch((error) => {
                  this.loading.hide();
                  this.alertService.showErrorMessage('group/error-update-group');
                })
              })
            })
          }
        }, {
          text: 'Cancel',
          icon: 'help-circle',
          role: 'cancel',
          handler: () => {

          }
        }]
    });
    await actionSheet.present();
  }


  // this handle the upload to the firebase 
  // it handle the selection from the image after will be upload to firebase storage 
  // also will be return the download url
  uploadGroupPhotoMessage(groupId, sourceType) {
    return new Promise((resolve) => {
      this.groupPhotoOption.sourceType = sourceType;
      this.loading.show();
      this.camera.getPicture(this.groupPhotoOption).then((imageData) => {
        let url = "data:image/jpeg;base64," + imageData;
        let imgBlob = this.imgURItoBlob(url);
        let metadata = {
          'contentType': imgBlob.type
        };
        const ref = this.afstorage.ref('/groupsMessage/' + groupId + this.generateFilename())
        const task = ref.put(imgBlob, metadata)
        task.snapshotChanges().pipe(
          finalize(async () => {
            ref.getDownloadURL().subscribe((url) => {
              resolve(url);
              this.loading.hide();
            })

          })
        ).subscribe()
      })

    })
  }

  // convert the image to the blob
  imgURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  //generate the random name return to jpg
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

}
