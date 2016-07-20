import {Page, NavController,ViewController,NavParams} from 'ionic-angular';

import {TabsPage} from '../tabs/tabs';
import {CommonService} from '../../services/common-service';
import {StorageService} from '../../services/storage-service';

@Page({
  templateUrl: 'build/pages/enable-location/enable-location.html'
})
export class EnableLocationPage {
  navType: any;
  constructor(
      private nav: NavController,
      private navParams: NavParams,
      private commonService: CommonService,
      private storage: StorageService,
      private viewCtrl: ViewController) {
      this.navType = navParams.data.navType;
  }

  accept() {
    //this.nav.push(TabsPage);
    var self = this;

    self.commonService.getCurrentPosition().
    then((userLocation) =>{
       self.storage.set('userLocation',userLocation);
        if(self.navType === 'modal')
               self.viewCtrl.dismiss(userLocation);
        else{
                if(self.nav.canGoBack())
                    self.nav.pop();
                else
                    self.nav.push(TabsPage);
        }

    });



  }

}
