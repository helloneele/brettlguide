export default function() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      DrawMap(position.coords.latitude, position.coords.longitude)
    });
  } else {
    return
  }
}

function DrawMap(lat, long){
  console.log(lat, long)
}
