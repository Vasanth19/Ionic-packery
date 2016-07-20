import {Injectable, Inject} from '@angular/core';
import * as _ from 'lodash';

declare var firebase: any;
@Injectable()
export class FirebaseRepo {
   public ref:any;
   config = {
    apiKey: "AIzaSyCtVXpNKHCFFfkM18q3MkYtbYnl2yCbTFU",
    authDomain: "partybook-1543e.firebaseapp.com",
    databaseURL: "https://partybook-1543e.firebaseio.com",
    storageBucket: "partybook-1543e.firebaseapp.com",
  };

   constructor() {

       if(!this.ref)
       {
        firebase.initializeApp(this.config);
        this.ref = firebase.database().ref();
       }
     }


    Node = {
        items: 'items',
        users: 'users'
    }

    items = [];

    get ServerTimeStamp():any {
        return firebase.database.ServerValue.TIMESTAMP;
    }

    emailToKey(emailAddress){
        return btoa(emailAddress);
     }

     keyToEmail(emailKey){
        return atob(emailKey);
     }





    getFirebaseData() {

        var self = this;
        return new Promise((resolve, reject) => {
            self.ref.child('items').on('value', function(snapshot) {
                var usersObj = snapshot.val();
                var items = _.values(usersObj);
                resolve(items);
            });
        });

    }


    seedFirebaseItems() {
        var self = this;
        var items = [];

        items.forEach((item) => {
            self.ref.child(self.Node.items).push(item);
        });
    }



}