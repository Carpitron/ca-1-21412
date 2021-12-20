import { Component, ElementRef, ViewChild } from '@angular/core';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { LatLng } from '@capacitor-community/capacitor-googlemaps-native/dist/esm/types/common/latlng.interface';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  constructor(private alertCtrl: AlertController) { }
 
  @ViewChild('map') mapView: ElementRef;
 
  ionViewDidEnter() {
    this.createMap();
  }
 
  createMap() {
    const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
 
    CapacitorGoogleMaps.create({
      width: Math.round(boundingRect.width),
      height: Math.round(boundingRect.height),
      x: Math.round(boundingRect.x),
      y: Math.round(boundingRect.y),
      zoom: 2
    });
 
    CapacitorGoogleMaps.addListener('onMapReady', async () => {
      CapacitorGoogleMaps.setMapType({
        type: "normal" // hybrid, satellite, terrain
      });
      
      this.showCurrentPosition();

      CapacitorGoogleMaps.addListener('didTapPOIWithPlaceID', async (ev) => {
        const result = ev.results;
   
        const alert = await this.alertCtrl.create({
          header: result.name,
          message: `Place ID:  ${result.placeID}`,
          buttons: ['OK']
        });
   
        await alert.present();
      });
    });
  }
 
  async showCurrentPosition() {
    Geolocation.requestPermissions().then(async premission => {
      const coordinates = await Geolocation.getCurrentPosition();
    
      // Create our current location marker
      CapacitorGoogleMaps.addMarker({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        title: 'My castle of loneliness',
        snippet: 'Come and find me!'
      });
    
      // Focus the camera
      CapacitorGoogleMaps.setCamera({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        zoom: 12,
        bearing: 0
      });
    });
  }

  draw() {
    const points: LatLng[] = [
      {
        latitude: 51.88,
        longitude: 7.60,
      },
      {
        latitude: 55,
        longitude: 10,
      }
    ];
 
    CapacitorGoogleMaps.addPolyline({
      points,
      color: '#ff00ff',
      width: 2
    });
  }
 
  ionViewDidLeave() {
    CapacitorGoogleMaps.close();
  }
 
}