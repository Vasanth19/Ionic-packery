import {Page,Modal,NavController} from 'ionic-angular';
import {StorageService} from '../../services/storage-service';
import {EnableLocationPage} from '../enable-location/enable-location';

@Page({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage {

    userLocation : any;
  constructor(
      private nav: NavController,
      private storage:StorageService
      ) {
          var self = this;
           setTimeout(() => {
            self.loadMap();
        }, 10);
      }

  loadMap() {

     this.userLocation = this.storage.cache.userLocation;
     let mapEle = document.getElementById('map');

      let map = new google.maps.Map(mapEle, {
        center: this.userLocation,
        zoom: 12
      });

      let infoWindow = new google.maps.InfoWindow({
            content: `<h5>Your Location</h5>`
        });

         var userMarkerImage = 'https://cdn3.iconfinder.com/data/icons/location-vol-2/128/location-17-48.png';
        var userMarker = new google.maps.Marker({
            position: this.storage.cache.userLocation,
            map: map,
            icon: userMarkerImage
        });

          userMarker.addListener('click', () => {
          infoWindow.open(map, userMarker);
        });


      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
       });

  }

  presentEnableLocationModal() {
     //if not logged in

        let modal = Modal.create(EnableLocationPage,{navType: 'modal' });
        this.nav.present(modal);
        var self = this;
        modal.onDismiss((userLocationData: any) => {
            if (self.userLocation.lat === userLocationData.lat  && self.userLocation.lng === userLocationData.lng )
                return;
            else
                setTimeout(() => {
                    self.loadMap();
                }, 10);
        });

  }


}
