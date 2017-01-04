import * as map from './map'

let prevLat = 0
let prevLong = 0

export default function() {
 if("geolocation" in navigator) {
   navigator.geolocation.getCurrentPosition(function(position) {
      let long = position.coords.longitude
      let lat = position.coords.latitude

      map.moveToTarget(long, lat)
      if(lat != prevLat || long != prevLong){
        map.setCurrentPos(long, lat)
        prevLat = lat
        prevLong = long
      }
    });
  }
  else {
    map.moveToTarget(13.375754395073598, 47.49949605823142)
  }

}

// COMPASS NOT WORKING IN CHROME only mobile
//alert(position.coords.heading)
//   window.addEventListener('deviceorientation', function(e) {
//  var heading = 'heading: ' + e.webkitCompassHeading +
//                '\n' +
//                'headingAccuracy: ' + e.webkitCompassAccuracy;
//  alert(heading);
//   }, false);
