import {Injectable} from '@angular/core';
import {FirebaseRepo} from './firebase-repo';
declare var firebase:any;

@Injectable()
export class UserRepo  extends FirebaseRepo{

    public user: User;
    constructor() {
        super();
     }


      authenticateWithFacebook() {
        var self = this;

         return new Promise<User>((resolve, reject) => {

             var provider = new firebase.auth.FacebookAuthProvider();
             provider.addScope('public_profile');
             //provider.addScope('user_friends');
             provider.addScope('email');

             firebase.auth().signInWithPopup(provider)
             .then(function(result) {
                    self.populateUser(result);
                    resolve(self.user);
              })
               .catch(function(error) {
                    console.log(error);
                        reject(error);
                });
        });
    }



    authenticateWithGoogle() {
        var self = this;

         return new Promise<User>((resolve, reject) => {
                var provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('https://www.googleapis.com/auth/plus.me');
                //provider.addScope('https://www.googleapis.com/auth/plus.login');

                firebase.auth().signInWithPopup(provider)
                .then(function(result) {
                    self.populateUser(result);
                    resolve(self.user);

                    })
                    .catch(function(error) {
                        console.log(error);
                         reject(error);
                });

        });


    }


    private populateUser(authData){
        var self = this;

        var email = (authData.user.email)? authData.user.email : authData.user.providerData[0].email
            self.user = {
                        key: self.emailToKey(email),
                        email: email.replace(/\./g, ','),
                        name: authData.user.displayName,
                        profileImage: authData.user.photoURL,
                        provider:authData.credential.provider,
                        uid: authData.user.uid,
                     };
     }



}


export interface User {
    key?:string;
	email:string;
	name: string;
    profileImage:string;
    provider:string;
    uid: string;

}







