import {ViewChild} from '@angular/core';
import {Page, NavController, MenuController,Modal,Events,Slides} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {EnableLocationPage} from '../enable-location/enable-location';

import {StorageService} from '../../services/storage-service';


interface Slide {
  title: string;
  description: string;
  image: string;
}

@Page({
  templateUrl: 'build/pages/tutorial/tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  slideOptions:any;

  @ViewChild('mySlider') mySlider: Slides;

  constructor(private nav: NavController, private menu: MenuController,
  private storage: StorageService, private events:Events) {

    this.slides = [
      {
        title: 'Welcome to <b>Pick Pack</b>',
        description: 'The <b>Pick Pack App</b> is a simple platform tailored for ease of use to make transactions simpler.',
        image: 'img/ica-slidebox-img-1.png',
      },
      {
        title: 'Explore Item details',
        description: 'View item details, <b>Locate and Chat</b> with the item owner easily.',
        image: 'img/ica-slidebox-img-2.png',
      },
      {
        title: 'Realtime chatting',
        description: '<b>No more emails. </b> Chat, negotiate and decide right away.',
        image: 'img/ica-slidebox-img-3.png',
      }
    ];

  }

  startApp() {
      var self = this;
    this.storage.set('skipTutorial',true);
    //this.nav.push(TabsPage,{tabIndex:0});
            let modal = Modal.create(EnableLocationPage,{navType: 'modal' });
            this.nav.present(modal);
            modal.onDismiss((userLocationData: any) => {
            self.events.publish('user:location');
            });

    this.nav.pop();
  }

  goToNextSlide(){
      this.mySlider.slideNext(1000);
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  onPageDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  onPageWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
