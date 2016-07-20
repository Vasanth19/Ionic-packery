import {Component,ViewChild} from '@angular/core';
import {Platform, ionicBootstrap,Nav,Toast} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {TutorialPage} from './pages/tutorial/tutorial';
import {LoginPage} from './pages/login/login';

import {FirebaseRepo} from './repo/firebase-repo';
import {UserRepo} from './repo/user-repo';

import {ConfigService} from './services/config-service';
import {CommonService} from './services/common-service';
import {StorageService} from './services/storage-service';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class photoBookApp {

  private rootPage:any;
  private backPressed:boolean = false;

  @ViewChild(Nav) nav: Nav;


  constructor(
      private platform:Platform,
      private storage: StorageService
        ) {
    this.rootPage = TabsPage;
    var self = this;

  //  this.checkifLoggedIn();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      self.registerBackButton();
    });
  }

    registerBackButton(){

        document.addEventListener("backbutton", onBackKeyDown, false);

        var self = this;
        // this.platform.backButton.subscribe((e) => onBackKeyDown(e), error => showToast(error))

        function onBackKeyDown(event) {
            event.preventDefault();
            event.stopPropagation();
                if (this.backPressed === false) {
                    this.menu.close();
                    if (this.nav.canGoBack()) {
                        this.nav.pop();
                        return;
                    }
                    else {
                        showToast('Press again to exit');
                        this.backPressed = true;
                        setTimeout(() => this.backPressed = false, 3000) // wait for 3 secs before setting it again
                        this.nav.setRoot(TabsPage);
                    }
                }
                else{
                    navigator.app.exitApp();
                    //this.platform.exitApp();
                }


            }

            function showToast(message) {
                let toast = Toast.create({
                    message: message,
                    duration: 3000
                });

                toast.onDismiss(() => {
                    console.log('Dismissed toast');
                });

                self.nav.present(toast);
                }

    }



}

ionicBootstrap(photoBookApp,
        [FirebaseRepo,UserRepo,CommonService,StorageService,ConfigService],
        { tabbarPlacement: 'bottom'}
        )
