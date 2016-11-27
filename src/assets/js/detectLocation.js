import map from './map'

export default function() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      DrawMap(position.coords.longitude, position.coords.latitude)
    });
  } else {
    return
  }
}

function DrawMap(long, lat){
  map(long, lat)
}
