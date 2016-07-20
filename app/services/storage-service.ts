
import {Injectable} from '@angular/core';
import { Storage, LocalStorage, Events} from 'ionic-angular';


@Injectable()
export class StorageService{
  private local:any;
  public cache:any;
 constructor(
    private events: Events
 ){
   this.local = new Storage(LocalStorage);


   this.cache = {};
   var self = this;
   this.get('user');
   this.get('partyId');
   this.get('userLocation');
   this.get('skipTutorial');
   this.get('gcmTokenRef');

 }

 public set(key:string,value:any)
 {
     this.cache[key] = value;
     let valueStr = JSON.stringify(value);
     this.local.set(key, valueStr)
 }

 public get(key:string):any{
   //  return this.local.get(key);
   var self = this;
     return new Promise<any>((resolve,reject)=>{
              this.local.get(key).then(
                    (value) => {
                        self.cache[key] = JSON.parse(value);
                        resolve(JSON.parse(value));
                      },
                    (error) => {
                      reject(error);
                    }
                );
            });
 }

 public remove(key:string){
     delete this.cache[key];
     return this.local.remove(key);
 }

}