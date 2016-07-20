import {Component,ViewChild,NgZone} from '@angular/core';
import {Page, ViewController, NavController, Alert,Content} from 'ionic-angular';
import * as _ from 'lodash';
import {Camera,ImagePicker} from 'ionic-native';



import {LoginPage} from '../login/login';
import {StorageService} from '../../services/storage-service';
import {ConfigService} from '../../services/config-service';
import {CommonService} from '../../services/common-service';

import {UserRepo} from '../../repo/user-repo';

declare var Packery: any;
declare var imagesLoaded: any;

@Component({
    templateUrl: 'build/pages/add-image/add-image.html',

})

export class AddImagePage {

  @ViewChild(Content) content: Content;

   partyId:string = '';
   userLocation:any;
   isGridInitialized = false;
   pictures = [];

   partyRef:any;


    constructor(
        private viewCtrl: ViewController,
        private nav: NavController,
        private config: ConfigService,
        private firebaseRepo:UserRepo,
        private commonService: CommonService,
        private storage: StorageService,
         private ngZone: NgZone
    ) {
        this.getLocation();
        this.partyRef = this.firebaseRepo.ref.child('Parties');
        this.checkifLoggedIn();
        if (!window.cordova) {
            this.pictures.push(
                {createdByName: "Vasanth Subramanyam",
                 timestamp:"1529969040",
                 images : ["https://pickpack.blob.core.windows.net/media/15-14-023904402.jpg",
                                                "https://pickpack.blob.core.windows.net/media/6-8-063213631.jpg",
                                                "https://pickpack.blob.core.windows.net/media/20-17-121850543.jpg",
                                                 "https://pickpack.blob.core.windows.net/media/6-8-063213631.jpg",
                                                "https://pickpack.blob.core.windows.net/media/20-17-121850543.jpg"]
                }
            );

            this.pictures.push(
                {createdByName: "Sindhu Naidu",
                 timestamp:"1529969040",
                 images : ["https://pickpack.blob.core.windows.net/media/15-14-023904402.jpg",
                                                "https://pickpack.blob.core.windows.net/media/6-8-063213631.jpg",
                                                "https://pickpack.blob.core.windows.net/media/20-17-121850543.jpg",
                                                 "https://pickpack.blob.core.windows.net/media/6-8-063213631.jpg",
                                                "https://pickpack.blob.core.windows.net/media/20-17-121850543.jpg"]
                }
            );

        }

    //     this.doImageResize("https://pickpack.blob.core.windows.net/media/20-17-121850543.jpg", (_data) => {
    //     this.ngZone.run(() => {
    //         this.pictures[0].images.push(_data);
    //     })
    //   }, 640)
    }

    checkifLoggedIn(){
        var self = this;
        var user = this.storage.get('user').then((user)=>{
            if(!user)
            {
                self.nav.push(LoginPage);
            }
            else{
                  self.partyId = this.storage.cache.partyId;
                  self.getPictures();

            }
        })
    }


    ionViewDidEnter(){
        if(!this.isGridInitialized){
            for (var i = 0; i < this.pictures.length; i++) {
              this.initGrid(i);
            }

        }

    }

   initGrid(index) {
    this.isGridInitialized = true;
    let elem = document.querySelector('.grid' + index);
    let pckry;
    imagesLoaded(elem, function(instance) {
      console.log('all images are loaded');
      pckry = new Packery(elem, {
        percentPosition: true,
        itemSelector: '.grid-item',
        gutter: 0
      });
    });
  }

    doImageResize(img, callback, MAX_WIDTH: number = 900, MAX_HEIGHT: number = 900) {
    var canvas = document.createElement("canvas");

    var image = new Image();

    image.onload = function () {
      console.log("Size Before: " + image.src.length + " bytes");
      console.log(this.width, this.height);

      var width = image.width;
      var height = image.height;
        console.log(width, height);

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      var dataUrl = canvas.toDataURL('image/jpeg');
      // IMPORTANT: 'jpeg' NOT 'jpg'
      console.log("Size After:  " + dataUrl.length + " bytes");
      callback(dataUrl)
    }

    image.src = img;
  }

     getPictures(){
        var self = this;
            self.partyRef.child(self.partyId).orderByChild('timestamp')
           .once('value', function(snapshot) {
                var picturesData = snapshot.val();
                _.forEach(picturesData,(pictureInfo,key)=>{
                    pictureInfo.key = key;
                    self.pictures.push(pictureInfo);
                });

                setTimeout(function() {
                     self.scrollToBottom(self);
                }, 200);

            });
    }

       scrollToBottom(self){
        let dimensions = self.content.getContentDimensions();
        self.content.scrollTo(0, dimensions.scrollBottom, 200);
    }

selectPictures(){
        var self = this;
        let options = {
                maximumImagesCount: 10
            }
        ImagePicker.getPictures(options).then((results) => {
            var  selectedPics = [];
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);

                var dataURL = encodeImageUri(results[i]);
                 selectedPics.push(dataURL);
              }

              if(selectedPics.length >0){
                 self.pictures.push(selectedPics);
                 self.savePicture(selectedPics);
              }
            }, (err) => {
                self.presentAlert('Could not upload pictures', 'Please try other options');
                console.log(err);
            });

        function encodeImageUri(imageUri)
                {
                    var c=document.createElement('canvas');
                    var ctx=c.getContext("2d");
                    var img=new Image();
                    img.onload = function(){
                    c.width=this.width;
                    c.height=this.height;
                    ctx.drawImage(img, 0,0);
                    };
                    img.src=imageUri;
                    var dataURL = c.toDataURL("image/jpeg");
                    return dataURL;
                }
    }


    captureImage() {
        this.callCamera(Camera.PictureSourceType.CAMERA);
    }

   selectImage() {
        this.callCamera(Camera.PictureSourceType.PHOTOLIBRARY);
    }


    callCamera(sourceType: any) {

        let options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: false,
            //popoverOptions: CameraPopoverOptions,
             correctOrientation: true
        };

        setTimeout(() => {
            Camera.getPicture(options).then(
                (imageData) => {
                    this.pictures.push("data:image/jpeg;base64," + imageData);

                    this.savePicture(["data:image/jpeg;base64," + imageData]);
                },
                (error) => {
                    if (error.indexOf('cancelled') === -1)
                        this.presentAlert('Oops..Could not get that image', 'Something went wrong ther..Do you mind trying it again?');
                    console.log(error);
                });

        }, 100);
    }





    presentAlert(title: string, subTitle: string) {
        let alert = Alert.create({
            title: title,
            subTitle: subTitle,
            buttons: ['Dismiss']
        });
        this.nav.present(alert);
    }

    savePicture(images){
        var self = this;

          var imageInfo = {
            images: images,
            createdBy: this.storage.cache.user.key,
            createdByName:this.storage.cache.user.name,
            timestamp: this.firebaseRepo.ServerTimeStamp,
            city:this.userLocation.city
        }

        self.partyRef.child(self.partyId).push(imageInfo);

    }

    getLocation(){
        var self = this;
        this.commonService.getCurrentPosition()
        .then((data) =>{
             self.userLocation = data;
             self.commonService.getLocation(self.userLocation)
                .then((address)=>{
                    self.userLocation.city = address.city.shortName + ',' + address.state.shortName;
                });
        });

        // catch and alert to enter the zipcode

    }


}
