import map from './map'

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
      DrawMap(position.coords.longitude, position.coords.latitude);
    });
  }
  else {
    return;
  }

  
}

function DrawMap(long, lat){
  map(long, lat)
}
