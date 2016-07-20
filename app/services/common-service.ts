import {Injectable} from '@angular/core';
import * as _ from 'lodash';

import {StorageService} from './storage-service';

@Injectable()
export class CommonService {
    constructor(private storage:StorageService) {
        var self = this;
        this.getCurrentPosition().
            then((userLocation) =>{
                self.storage.set('userLocation',userLocation);
            });
    }

    getLocation(latLng){
        let location:any = {};
        return new Promise<any>((resolve,reject)=>{
            let geocoder = new google.maps.Geocoder();
            let LatLng = new google.maps.LatLng(latLng.lat, latLng.lng);
            geocoder.geocode({ 'location': LatLng },(results, status) => processGeocode(results, status));

            function processGeocode(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results.length > 0) {
                            var result = results[0];

                            location.address = results[1].formatted_address; // need approximate address

                            var addressComponents = result.address_components;

                            //zipCode
                            location.zipCode = _.chain(addressComponents)
                                .filter(function(address) {
                                    return address.types.indexOf('postal_code') != -1;
                                })
                                .map(function(address) {
                                    return { shortName: address.short_name, longName: address.long_name };
                                }).value()[0];

                            location.country = _.chain(addressComponents)
                                .filter(function(address) {
                                    return address.types.indexOf('country') != -1;;
                                })
                                .map(function(address) {
                                    return { shortName: address.short_name, longName: address.long_name };
                                }).value()[0];

                            location.state = _.chain(addressComponents)
                                .filter(function(address) {
                                    return address.types.indexOf('administrative_area_level_1') != -1;
                                })
                                .map(function(address) {
                                    return { shortName: address.short_name, longName: address.long_name };
                                }).value()[0];

                            location.city = _.chain(addressComponents)
                                .filter(function(address) {
                                    return address.types.indexOf('locality') != -1;
                                })
                                .map(function(address) {
                                    return { shortName: address.short_name, longName: address.long_name };
                                }).value()[0];

                        }
                        resolve(location);
                    }
                    else{
                        reject("Could not fetch information");
                    }
                }
           });

    }

    getCurrentPosition(){
        let options = {timeout: 10000, enableHighAccuracy: false};

        return new Promise<any>((resolve,reject)=>{
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let coords = {lat: position.coords.latitude , lng: position.coords.longitude}
                        resolve(coords);
                      },
                    (error) => {
                      reject(error);
                    }, options
                );
            });
    }

      getDistance(userLocation, itemLocation, kmIndicator:boolean = false) {
        var from = new google.maps.LatLng(userLocation.lat, userLocation.lng);
        var to = new google.maps.LatLng(itemLocation.lat, itemLocation.lng);
        var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
        var km = (dist / 1000).toFixed(1);
            if(kmIndicator)
                return km;
        var miles = (dist * 0.621371 / 1000).toFixed(1);
        return miles;
    }


}


