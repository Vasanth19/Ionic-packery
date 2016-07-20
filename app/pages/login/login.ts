import {Component,ViewChild,NgZone} from '@angular/core';
import {Page, NavController, Alert,
    ViewController, Events, Storage, LocalStorage, Toast} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';

import {UserRepo} from '../../repo/user-repo';
import {StorageService} from '../../services/storage-service';
import * as _ from 'lodash';

declare var firebase: any;
declare var gapi: any;
@Page({
    templateUrl: 'build/pages/login/login.html'
})

export class LoginPage {
    login: { username?: string, password?: string } = {};
    submitted = false;
    partyId: string = '';
    user:any = {};

    constructor(
        private nav: NavController,
        private viewCtrl: ViewController,
        private userRepo: UserRepo,
        private events: Events,
        private storage: StorageService,
         private ngZone: NgZone
    ) {


    }

    onLogin(form) {
        this.submitted = true;
        if (form.valid) {
            this.nav.push(TabsPage);
        }
    }

    doAlert() {
        let alert = Alert.create({
            title: 'Could not login',
            subTitle: 'Something went wrong, we could not log in!',
            buttons: ['Ok']
        });
        this.nav.present(alert);
    }

    facebookLogin() {
        if (this.partyId === '') {
            this.showToast('Enter the event id');
            return;
        }

        var self = this;

        self.userRepo.authenticateWithFacebook()
            .then((user) => self.saveUser(user))
            .then(() => self.goBack())
            .catch((error) => self.doAlert());
    }

    googleLogin() {

        if (this.partyId === '') {
            this.showToast('Enter the event id');
            return;
        } else {

        }

        var self = this;
        var ref = self.userRepo.ref;
        self.userRepo.authenticateWithGoogle()
            .then((user) => self.saveUser(user))
            .then(() => self.goBack())
            .catch((error) => self.doAlert());
    }


    showToast(message) {
        let toast = Toast.create({
            message: message,
            duration: 3000
        });

        toast.onDismiss(() => {
            console.log('Dismissed toast');
        });

        this.nav.present(toast);
    }

    saveUser(user: any) {
        var self = this;
        self.events.publish('user:login');
        let key = user.key; delete user.key;
        if (self.storage.cache.gcmTokenRef)
            user.gcmTokenRef = self.storage.cache.gcmTokenRef;

        self.userRepo.ref.child("users").child(key)
            .update(user, (err) => {
                if (!err) {
                    self.goBack();

                    self.userRepo.ref.child("users/" + key).once('value', (snapshot) => {
                        user = snapshot.val();
                        user.key = snapshot.key; //use key again for storage and get the additional items and favorites
                        self.storage.set('user', user);
                    });
                }
            });

        user.key = key; //use key again for storage
        self.storage.set('user', user);
        self.storage.set('partyId', self.partyId);
    }

    goBack() {
        if (this.nav.canGoBack())
            this.nav.pop();
        else
            this.nav.push(TabsPage);

    }


ngAfterViewInit() {
    // Converts the Google login button stub to an actual button.
    gapi.signin2.render(
      'google-signin',
      {
        "onSuccess": this.onGoogleLoginSuccess,
        "scope": "profile email",
        "theme": "dark",
        'height': 50,
        'longtitle': true
      });
  }

  // Triggered after a user successfully logs in using the Google external
  // login provider.
 onGoogleLoginSuccess = (googleUser) => {
       if (this.partyId === '') {
            this.showToast('Enter the party id');
            return;
        }

     this.ngZone.run(() => {

        this.onGoogleAuthSignIn(googleUser);

        var profile = googleUser.getBasicProfile();
          this.user = {
              key: this.userRepo.emailToKey(profile.getEmail()),
              name:profile.getName(),
              email:profile.getEmail(),
              profileImage:profile.getImageUrl(),
              provider:'google.com',
              authToken: googleUser.getAuthResponse().id_token
          }
        this.saveUser(this.user);
    });
  }


    onGoogleAuthSignIn(googleUser) {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.getAuthResponse().id_token);
                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential)
                .then(function(result) {
                      console.log(result);
                })
                .catch(function(error) {
                      console.log(error);
                });
            } else {
                console.log('User already signed-in Firebase.');
            }
        });

        function isUserEqual(googleUser, firebaseUser) {
            if (firebaseUser) {
                var providerData = firebaseUser.providerData;
                for (var i = 0; i < providerData.length; i++) {
                    if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                        providerData[i].uid === googleUser.getBasicProfile().getId()) {
                        // We don't need to reauth the Firebase connection.
                        return true;
                    }
                }
            }
            return false;
        }

    }

    signOut() {

        firebase.auth().signOut().then(function() {
            console.log('firebase User signed out.');
            }, function(error) {
            // An error happened.
            });
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('google User signed out.');
            });
    }


}
