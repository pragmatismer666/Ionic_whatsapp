/*
* WhatsApp in Ionic 5 application  (https://github.com/habupagas/ionic-5-WhatsApp)
* Copyright  @2020-present. All right reserved.
* Author: Abubakar Pagas
*/


import { LoadingService } from 'src/app/services/loading.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { BroadcastComponent } from './../../component/broadcast/broadcast.component';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
// import firebase from 'firebase';
import * as _ from 'lodash';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PopoverController, IonContent, ActionSheetController, ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MediaObject, Media } from '@ionic-native/media/ngx';
import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media/ngx';
import { File } from '@ionic-native/file/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import * as firebase from 'firebase';




@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.page.html',
  styleUrls: ['./broadcast.page.scss'],
})
export class BroadcastPage implements OnInit {

  broadcastId;
  membersLength = []

  userId;
  playAudio = false;

  isAdmin: any;
  members;
  image;
  isLoading = true;
  messagesToShow = [];
  recording = false;
  public message: any;
  private messages: any;

  audioFile: MediaObject;

  private broadcastPhotoOption: CameraOptions;
  broadcast;

  @ViewChild('IonContent', { static: true }) IonContent: IonContent;

  constructor(
    private actRoute: ActivatedRoute,
    public dataServices: DataService,
    private toast: ToastController,
    private camera: Camera,
    private nativeAudio: NativeAudio,
    private afstorage: AngularFireStorage,
    private popoverController: PopoverController,
    public afDB: AngularFireDatabase,
    private router: Router,
    private media: Media,
    private file: File,
    private streamingMedia: StreamingMedia,
    private actionSheet: ActionSheetController,
    public loading: LoadingService
  ) {
    // current userId
    this.userId = firebase.auth().currentUser.uid;
    // preload the sound wave 
    this.nativeAudio.preloadSimple('send', 'assets/audio/send.wav');
    //invoke the broadcastId the key
    this.broadcastId = this.actRoute.snapshot.paramMap.get('key');

    this.broadcastPhotoOption = {
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
    //initiallize the data will be loaded
    this.dataServices.groups(this.broadcastId).valueChanges().subscribe((broadcast) => {
      this.broadcast = broadcast;
      if (broadcast.admin) {
        let index = _.indexOf(broadcast.admin, firebase.auth().currentUser.uid);
        if (index > - 1) {
          this.isAdmin = true;
        }
      }
      //for the title
      this.membersLength = broadcast.members;
      this.image = broadcast.img;
      //get the message from the group
      this.dataServices.getGroupMessage(this.broadcastId).valueChanges().subscribe((messages) => {
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
          console.log("dataChat", tempData)
          this.messagesToShow.push(tempData);
        })

      })
    });
  }

  // show the option from the popOver 
  // and then pass the broadcastId the Broadcast component
  async more(ev: any) {
    const popover = await this.popoverController.create({
      component: BroadcastComponent,
      event: ev,
      cssClass: 'my-custom-class',
      translucent: true,
      componentProps: { broadcastId: this.broadcastId },
    });
    await popover.present();
  }

  // when enter the page automatic scroll to the bottom page
  ionViewDidEnter() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 500)
  }

  //scroll pages
  scroll() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 10)
  }
  // Update messagesRead when user lefts this page.
  // ionViewWillLeave() {
  //   this.setMessagesRead();
  // }

  // scrollToBottom
  scrollToBottom() {
    this.IonContent.scrollToBottom(100)
  }
  //enlarge the image
  enlargeImage(image) {
    this.router.navigate(['enlarge-image/', { 'image': image }])
  }
  // generate the random name file
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  //splite the quality of image page
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

  // send message and then scroll to the bottom page
  // pass the message parameter
  sendMessage() {
    this.sendNewMessage(this.message).then(() => {
      setTimeout(() => {
        this.scrollToBottom()
      }, 10)
      this.message = '';
    })
  }

  //send message to user
  sendNewMessage(message) {
    if (this.userId) {
      var promise = new Promise((resolve, reject) => {
        var messages = {
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'text',
          message: message,
          read: 'unread',
        };
        var conversation = {
          userId: this.userId,
          me: "me",
          view: 'broadcast',
          message: message,
          type: 'text',
          read: 'unread',
          date: new Date().toString(),
        }
        var convasation = {
          userId: firebase.auth().currentUser.uid,
          message: message,
          me: "you",
          type: 'text',
          view: 'broadcast',
          read: 'unread',
          date: new Date().toString(),
        }
        //update group message
        firebase.database().ref('groups').child(this.broadcastId).child('messages').push(messages).then((sucess) => {
          var keys = sucess.key;
          sucess.update({
            key: keys
          })
          this.message = '';
          setTimeout(() => {
            this.scrollToBottom()
          }, 10)
        })
        for (let i = 0; i < this.broadcast.members.length; i++) {
          this.afDB.database.ref('/messages/').child(this.broadcast.members[i]).child(firebase.auth().currentUser.uid).push(messages).then((snap) => {
            var keys = snap.key;
            snap.update({
              key: keys
            })
          })
          this.afDB.database.ref('conversations').child(this.broadcast.members[i]).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
            var res = snapshot.val()
            if (res != null) {
              let store = Object.keys(res)
              this.afDB.database.ref('conversations').child(this.broadcast.members[i]).child(store[0]).remove().then(() => {
                this.afDB.database.ref('conversations').child(this.broadcast.members[i]).push(convasation).then(() => {
                  resolve(true);
                })
              }).catch((err) => {
                reject(err);
              })
            } else {
              this.afDB.database.ref('conversations').child(this.broadcast.members[i]).push(convasation).then(() => {
                resolve(true);
              })
            }
          }).then(() => {
            this.nativeAudio.play('send')
          })
        }
      })
      return promise;
    }
  }

  //send Photo to user
  sendNewPhoto(url) {
    if (this.userId) {
      var promise = new Promise((resolve, reject) => {
        var messages = {
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'image',
          message: url,
          read: 'unread',
        };
        var conversation = {
          userId: this.userId,
          me: "me",
          view: 'broadcast',
          message: url,
          type: 'image',
          read: 'unread',
          date: new Date().toString(),
        }
        var convasation = {
          userId: firebase.auth().currentUser.uid,
          message: url,
          me: "you",
          type: 'image',
          view: 'broadcast',
          read: 'unread',
          date: new Date().toString(),
        }
        //update group message
        firebase.database().ref('groups').child(this.broadcastId).child('messages').push(messages).then((sucess) => {
          var keys = sucess.key;
          sucess.update({
            key: keys
          })
          this.message = '';
          setTimeout(() => {
            this.scrollToBottom()
          }, 10)
        })
        for (let i = 0; i < this.broadcast.members.length; i++) {
          this.afDB.database.ref('/messages/').child(this.broadcast.members[i]).child(firebase.auth().currentUser.uid).push(messages).then((snap) => {
            var keys = snap.key;
            snap.update({
              key: keys
            })
          })
          this.afDB.database.ref('conversations').child(this.broadcast.members[i]).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
            var res = snapshot.val()
            if (res != null) {
              let store = Object.keys(res)
              this.afDB.database.ref('conversations').child(this.broadcast.members[i]).child(store[0]).remove().then(() => {
                this.afDB.database.ref('conversations').child(this.broadcast.members[i]).push(convasation).then(() => {
                  resolve(true);
                })
              }).catch((err) => {
                reject(err);
              })
            } else {
              this.afDB.database.ref('conversations').child(this.broadcast.members[i]).push(convasation).then(() => {
                resolve(true);
              })
            }
          }).then(() => {
            this.nativeAudio.play('send')
          })
        }
      })
      return promise;
    }
  }

  //router page
  groupInfo() {
    this.router.navigate(['/broadcast-info', { 'broadcastId': this.broadcastId }]);
  }

  // choose option photo to sende picturer
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
              this.sendNewPhoto(url);
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
              this.sendNewPhoto(url);
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

  // this handle the upload to the firebase 
  // it handle the selection from the image after will be upload to firebase storage 
  // also will be return the download url
  uploadPhotoMessage(sourceType) {
    return new Promise((resolve, reject) => {
      this.broadcastPhotoOption.sourceType = sourceType;
      this.camera.getPicture(this.broadcastPhotoOption).then((imageData) => {
        let url = "data:image/jpeg;base64," + imageData;
        let imgBlob = this.imgURItoBlob(url);
        let metadata = {
          'contentType': imgBlob.type
        };

        alert(url)
        this.loading.showPro();
        const ref = this.afstorage.ref('/Messaging/' + firebase.auth().currentUser.uid + this.generateFilename())
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

  // this handel the record the voice mooden
  record() {
    // create the media store the audio file mp3
    this.audioFile = this.media.create(this.file.externalDataDirectory + `${this.userId}.mp3`);
    // start the recorde voice
    this.audioFile.startRecord()
    // this.statusRecord = "Recording..."
    this.recording = true;
  }
  stopRec() {
    // stop the recorde voice
    this.audioFile.stopRecord()
    // this.statusRecord = "Stopped..."
    this.recording = false;

    this.uploadRec().then((url) => {
      this.sendNewAudio(url)
    })
  }

  //send Photo to user
  sendNewAudio(url) {
    if (this.userId) {
      var promise = new Promise((resolve, reject) => {
        var messages = {
          date: new Date().toString(),
          userId: firebase.auth().currentUser.uid,
          type: 'audio',
          message: url,
          read: 'unread',
        };
        var conversation = {
          userId: this.userId,
          message: url,
          type: 'audio',
          me: "me",
          view: 'broadcast',
          date: new Date().toString(),
          read: 'unread',
        }
        var convasation = {
          userId: firebase.auth().currentUser.uid,
          message: url,
          me: "you",
          view: 'broadcast',
          date: new Date().toString(),
          type: 'audio',
          read: 'unread',
        }
        //update group message
        firebase.database().ref('groups').child(this.broadcastId).child('messages').push(messages).then((sucess) => {
          var keys = sucess.key;
          sucess.update({
            key: keys
          })
          this.message = '';
          setTimeout(() => {
            this.scrollToBottom()
          }, 10)
        })
        for (let i = 0; i < this.broadcast.members.length; i++) {
          this.afDB.database.ref('/messages/').child(this.broadcast.members[i]).child(firebase.auth().currentUser.uid).push(messages).then((snap) => {
            var keys = snap.key;
            snap.update({
              key: keys
            })
          })
          this.afDB.database.ref('conversations').child(this.broadcast.members[i]).orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value', snapshot => {
            var res = snapshot.val()
            if (res != null) {
              let store = Object.keys(res)
              this.afDB.database.ref('conversations').child(this.broadcast.members[i]).child(store[0]).remove().then(() => {
                this.afDB.database.ref('conversations').child(this.broadcast.members[i]).push(convasation).then(() => {
                  resolve(true);
                })
              }).catch((err) => {
                reject(err);
              })
            } else {
              this.afDB.database.ref('conversations').child(this.broadcast.members[i]).push(convasation).then(() => {
                resolve(true);
              })
            }
          }).then(() => {
            this.nativeAudio.play('send')
          })
        }
      })
      return promise;
    }
  }

  // upload the recording voice to firebase
  uploadRec() {
    return new Promise((resolve) => {
      const metadata = {
        contentType: 'audio/mp3',
      };
      let fileName = `${this.userId}.mp3`
      this.file.readAsDataURL(this.file.externalDataDirectory, fileName).then((file) => {
        this.loading.showPro();
        const ref = this.afstorage.ref('/audio/' + '/broadcast/' + this.generateFilenameAudio())
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


  async presentToast() {
    const toast = await this.toast.create({
      message: 'Something going wrong.',
      duration: 1000
    });
    toast.present();
  }

  async optionDelete(key) {
    const alert = await this.actionSheet.create({
      header: 'Delete Message from  broadcast',
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
    this.afDB.database.ref('groups').child(this.broadcastId).child('messages').orderByChild('key').equalTo(key).once('value', snapKey => {
      var res = snapKey.val();
      let store = Object.keys(res)
      this.loading.hide();
      this.afDB.database.ref('groups').child(this.broadcastId).child('messages').child(store[0]).remove()
    })
  }

}
