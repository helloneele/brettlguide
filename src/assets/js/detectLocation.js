import * as map from './map'

export default function() {
 if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      //alert(position.coords.heading)
    //   window.addEventListener('deviceorientation', function(e) {
    //  var heading = 'heading: ' + e.webkitCompassHeading +
    //                '\n' +
    //                'headingAccuracy: ' + e.webkitCompassAccuracy;
    //  alert(heading);
    //   }, false);
      map.moveToTarget(position.coords.longitude, position.coords.latitude)
      map.setCurrentPos(position.coords.longitude, position.coords.latitude)
    });
  }
  else {
    map.moveToTarget(13.375754395073598, 47.49949605823142)
  }

}
