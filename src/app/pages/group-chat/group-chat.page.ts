/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { LoadingService } from './../../services/loading.service';
import { DataService } from './../../services/data.service';
import { GroupoptComponent } from './../../component/groupopt/groupopt.component';
import { PopoverController, IonContent, ActionSheetController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { StreamingMedia, StreamingAudioOptions } from '@ionic-native/streaming-media/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import * as firebase from 'firebase';




@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.page.html',
  styleUrls: ['./group-chat.page.scss'],
})
export class GroupChatPage implements OnInit {
  key: any;
  public title: any;
  groupId: any;
  public message: any;
  private messages: any;
  group: any;
  recording = false;

  groups: any;
  private alert: any;

  isLoading = true;

  private groupPhotoOption: CameraOptions;


  private updateDateTime: any;
  private subscription: any;
  messagesToShow = [];
  private startIndex: any = -1;
  // Set number of messages to show.
  private numberOfMessages = 10;
  isAdmin: any;
  myTracks: any;
  allTracks: any;
  selectedTrack: any;
  userId;
  image;
  keyMessage;

  audioFile: MediaObject;


  img = 'assets/profile.png';

  @ViewChild('IonContent', { static: true }) IonContent: IonContent


  constructor(
    private actRoute: ActivatedRoute,
    private media: Media,
    private popoverController: PopoverController,
    public dataServices: DataService,
    private afDB: AngularFireDatabase,
    private toastController: ToastController,
    private camera: Camera,
    private file: File,
    private nativeAudio: NativeAudio,
    public loading: LoadingService,
    private afstorage: AngularFireStorage,
    private actionSheet: ActionSheetController,
    private streamingMedia: StreamingMedia,
    private router: Router
  ) {
    this.groupId = this.actRoute.snapshot.paramMap.get('key')

    // load the audio send play
    this.nativeAudio.preloadSimple('send', 'assets/audio/send.wav');

    // Photo group Option
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
    // to  clear the message when enter to the chat
    this.setMessagesRead();
    this.userId = firebase.auth().currentUser.uid;
    this.subscription = this.dataServices.groups(this.groupId).valueChanges().subscribe((group) => {
      this.group = group;
      if (group.admin) {
        let index = _.indexOf(group.admin, firebase.auth().currentUser.uid);
        if (index > - 1) {
          this.isAdmin = true;
        }
      }
      //for the title
      this.title = group.name;
      this.image = group.img;
      //get the message from the group
      this.dataServices.getGroupMessage(this.groupId).valueChanges().subscribe((messages) => {
        this.messagesToShow = []
        this.isLoading = false
        messages.forEach((message) => {
          let tempMessage = message;
          let tempData = <any>{}
          tempData = tempMessage;
          this.dataServices.getUser(tempMessage.userId).valueChanges().subscribe((user) => {
            tempData.name = user.username;
            tempData.avatar = user.img;
          });
          this.messagesToShow.push(tempData);
        })

      })
    })

  }

  // for more Option
  async more(ev: any) {
    const popover = await this.popoverController.create({
      component: GroupoptComponent,
      event: ev,
      cssClass: 'my-custom-class',
      translucent: true,
      componentProps: { groupId: this.groupId },
    });
    await popover.present();
  }

  // When enter the page automatic load
  ionViewDidEnter() {
    this.setMessagesRead();
    setTimeout(() => {
      this.scrollToBottom()
    }, 500)
  }

  // scroll the bottom after 10 miliSecond
  scroll() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 10)
  }

  // Update messagesRead when user lefts this page.
  ionViewWillLeave() {
    this.setMessagesRead();
  }

  //scroll to the bottom
  scrollToBottom() {
    this.IonContent.scrollToBottom(100)
  }

  // Check if currentPage is active, then update user's messagesRead.
  setMessagesRead() {
    this.afDB.object('/accounts/' + firebase.auth().currentUser.uid + '/groups/' + this.groupId + '/messagesRead/').remove()
  }

  // Send text message to the group.
  sendMessage() {
    var promise = new Promise((resolve, reject) => {
      let messages = {
        date: new Date().toString(),
        userId: firebase.auth().currentUser.uid,
        type: 'text',
        message: this.message
      }
      let convasation = {
        key: this.groupId,
        me: "you",
        type: 'text',
        view: 'group',
        // read: 'unread',
        date: new Date().toString(),
      }
      //update group message
      firebase.database().ref('groups').child(this.groupId).child('messages').push(messages).then((sucess) => {
        this.keyMessage = sucess.key;
        var keys = sucess.key;
        sucess.update({
          key: keys
        })
        this.message = '';
        setTimeout(() => {
          this.scrollToBottom()
        }, 10)
      }).then(() => {
        for (let i = 0; i < this.group.members.length; i++) {
          firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
            key: this.keyMessage
          });
          this.afDB.database.ref('conversations').child(this.group.members[i]).orderByChild('key').equalTo(this.groupId).once('value', snapshot => {
            var res = snapshot.val();
            if (res != null) {
              let store = Object.keys(res)
              this.afDB.database.ref('conversations').child(this.group.members[i]).child(store[0]).remove().then(() => {
                this.afDB.database.ref('conversations').child(this.group.members[i]).push(convasation).then(() => {
                  resolve(true);
                })
              }).catch((err) => {
                reject(err);
              })
            } else {
              this.afDB.database.ref('conversations').child(this.group.members[i]).push(convasation).then(() => {
                resolve(true);
              })
            }
          }).then(() => {
            this.nativeAudio.play('send')
          }).catch((err) => {
            reject(err);
          })

        }
      });
    });
    return promise;
  }

  // send the photo url to user
  sendMessagePhoto(url) {
    var promise = new Promise((resolve, reject) => {
      let messages = {
        date: new Date().toString(),
        userId: firebase.auth().currentUser.uid,
        type: 'image',
        message: url
      }
      let convasation = {
        key: this.groupId,
        me: "you",
        type: 'image',
        view: 'group',
        date: new Date().toString(),
      }
      //update group message
      firebase.database().ref('groups').child(this.groupId).child('messages').push(messages).then((snap) => {
        this.message = '';
        var keys = snap.key;
        snap.update({
          key: keys
        })
        setTimeout(() => {
          this.scrollToBottom()
        }, 10)
      }).then(() => {
        for (let i = 0; i < this.group.members.length; i++) {
          firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
            key: this.keyMessage
          });
          this.afDB.database.ref('conversations').child(this.group.members[i]).orderByChild('key').equalTo(this.groupId).once('value', snapshot => {
            var res = snapshot.val();
            if (res != null) {
              let store = Object.keys(res)
              this.afDB.database.ref('conversations').child(this.group.members[i]).child(store[0]).remove().then(() => {
                this.afDB.database.ref('conversations').child(this.group.members[i]).push(convasation).then(() => {
                  resolve(true);
                })
              }).catch((err) => {
                reject(err);
              })
            } else {
              this.afDB.database.ref('conversations').child(this.group.members[i]).push(convasation).then(() => {
                resolve(true);
              })
            }
          }).then(() => {
            this.nativeAudio.play('send')
          }).catch((err) => {
            reject(err);
          })
        }

      });
    });
    return promise;
  }

  // generate the random name and return the jpg
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }
  //Make it Blod file
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


  // this handle the upload to the firebase 
  // it handle the selection from the image after will be upload to firebase storage 
  // also will be return the download url
  uploadPhotoMessage(sourceType) {
    return new Promise((resolve) => {
      this.groupPhotoOption.sourceType = sourceType;
      this.camera.getPicture(this.groupPhotoOption).then((imageData) => {
        let url = "data:image/jpeg;base64," + imageData;
        let imgBlob = this.imgURItoBlob(url);
        let metadata = {
          'contentType': imgBlob.type
        };
        this.loading.showPro();
        const ref = this.afstorage.ref('/groupMessage/' + firebase.auth().currentUser.uid + this.generateFilename())
        const task = ref.put(imgBlob, metadata)
        task.snapshotChanges().pipe(
          finalize(async () => {
            ref.getDownloadURL().subscribe((url) => {
              resolve(url);
              this.loading.hidePro();
            })
          })
        ).subscribe()
      })
    })
  }

  // photo Option choosen
  async sendPhoto() {
    const alert = await this.actionSheet.create({
      header: "Send Photo  Message",
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            //Upload the image and return pormise
            this.uploadPhotoMessage(this.camera.PictureSourceType.CAMERA).then((url) => {
              //process photo massge on the database
              this.sendMessagePhoto(url);
            })
          },
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            // Upload the image and retunr pormise
            this.uploadPhotoMessage(this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {
              //process photo massge on the database
              this.sendMessagePhoto(url);
            })
          },
        },
        {
          text: 'Cancel',
          icon: 'help-circle',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    })
    alert.present();
  }

  //enlarge the image
  enlargeImage(image) {
    this.router.navigate(['enlarge-image/', { 'image': image }])
  }

  // this handel the record the voice mooden
  async record() {
    this.audioFile = await this.media.create(this.file.externalDataDirectory + `${this.groupId}.mp3`);
    this.audioFile.startRecord()
    // this.statusRecord = "Recording..."
    this.recording = true;
  }

  async stopRec() {
    this.audioFile.stopRecord()
    // this.statusRecord = "Stopped..."
    this.recording = false;
    this.uploadRec().then((url) => {
      this.sendMessageAudio(url)
    })
  }

  //generate the randon name and return mp3 file
  generateFilenameAudio() {
    var length = 4;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".mp3";
  }

  //play voice from the database
  play(audioUrl) {
    let options: StreamingAudioOptions = {
      successCallback: () => { },
      errorCallback: (e) => { this.presentToast() },
      initFullscreen: false
    };
    this.streamingMedia.playAudio(`${audioUrl}`, options);
  }

  // present the toast notification
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Something going wrong.',
      duration: 1000
    });
    toast.present();
  }

  // upload the recording voice to firebase
  // this handle the upload to the firebase 
  // it handle the selection from the audio after will be upload to firebase storage 
  // also will be return the download url
  async uploadRec() {
    return new Promise((resolve) => {
      const metadata = {
        contentType: 'audio/mp3',
      };
      let fileName = `${this.groupId}.mp3`
      this.file.readAsDataURL(this.file.externalDataDirectory, fileName).then((file) => {
        this.loading.showPro();
        const ref = this.afstorage.ref('/audio/' + '/group/' + this.generateFilenameAudio())
        const task = ref.putString(file, firebase.storage.StringFormat.DATA_URL)
        task.snapshotChanges().pipe(
          finalize(async () => {
            ref.getDownloadURL().subscribe((audioUrl) => {
              resolve(audioUrl);
              this.loading.hidePro();
              this.file.removeFile(this.file.externalDataDirectory, fileName);
            })
          })
        ).subscribe()
      })
    })
  }

  // Send text message to the group.
  sendMessageAudio(url) {
    var promise = new Promise((resolve, reject) => {
      let messages = {
        date: new Date().toString(),
        userId: firebase.auth().currentUser.uid,
        type: 'audio',
        audio: url
      }
      let convasation = {
        key: this.groupId,
        me: "you",
        type: 'audio',
        view: 'group',
        // read: 'unread',
        date: new Date().toString(),
      }
      //update group message
      firebase.database().ref('groups').child(this.groupId).child('messages').push(messages).then((sucess) => {
        this.message = '';
        this.keyMessage = sucess.key;
        var keys = sucess.key;
        sucess.update({
          key: keys
        })
        setTimeout(() => {
          this.scrollToBottom()
        }, 10)
      }).then(() => {
        for (let i = 0; i < this.group.members.length; i++) {
          firebase.database().ref('accounts').child(this.group.members[i]).child('groups').child(this.groupId).child('messagesRead').push({
            key: this.keyMessage
          });
          this.afDB.database.ref('conversations').child(this.group.members[i]).orderByChild('key').equalTo(this.groupId).once('value', snapshot => {
            var res = snapshot.val();
            if (res != null) {
              let store = Object.keys(res)
              this.afDB.database.ref('conversations').child(this.group.members[i]).child(store[0]).remove().then(() => {
                this.afDB.database.ref('conversations').child(this.group.members[i]).push(convasation).then(() => {
                  resolve(true);
                })
              }).catch((err) => {
                reject(err);
              })
            } else {
              this.afDB.database.ref('conversations').child(this.group.members[i]).push(convasation).then(() => {
                resolve(true);
              })
            }
          }).then(() => {
            this.nativeAudio.play('send')
          }).catch((err) => {
            reject(err);
          })

        }
      });
    });
    return promise;
  }

  // Delete Option Message from the Group if the current user send message
  async optionDelete(key) {
    const alert = await this.actionSheet.create({
      header: 'Delete Message from ' + this.title,
      buttons: [
        {
          text: 'delete message',
          handler: () => {
            this.deleteMessage(key)
          }
        },
        {
          text: 'cancel',
          handler: () => {
          }
        },
      ]

    })
    await alert.present();
  }

  // this handle for the conversation delete for only user
  deleteMessage(key) {
    this.loading.show();
    this.afDB.database.ref('groups').child(this.groupId).child('messages').orderByChild('key').equalTo(key).once('value', snapKey => {
      var res = snapKey.val();
      let store = Object.keys(res)
      this.loading.hide();
      this.afDB.database.ref('groups').child(this.groupId).child('messages').child(store[0]).remove()
    })
  }

  // route to the group-info page alone with the groupId
  groupInfo() {
    this.router.navigate(['/group-info', { 'groupId': this.groupId }]);
  }



}
