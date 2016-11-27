import skihuetten from '../../../build/data/skihuetten'

// use map.loaded true/false for preloader image

export default function(long, lat) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9uZWVsZSIsImEiOiJjaXVlamJoYjEwMDFmMnZxbGk1ZDBzMXdwIn0.i3Sy5G_gVjDLOJ9VcORhcQ'

  var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/helloneele/ciw0yc5ft00dh2jo5ml0fklvd', //hosted style id
      center: [long, lat], // starting position
      zoom: 10, // starting zoom
      pitch: 45
  });

  //setCurrentPos(map, long, lat)
  setSkihuetten(map)


  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['huetten'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];
    // https://www.mapbox.com/mapbox-gl-js/example/center-on-symbol/
    this.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45});
    // https://www.mapbox.com/mapbox-gl-js/api/#Popup
    this.once('moveend', function() {
      var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(feature.properties.name)
        .addTo(map)
    });





  });

}


function setCurrentPos(map, long, lat){

  map.on('load', function () {
    map.addSource("points", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [long, lat]
                },
                "properties": {
                    "icon": "marker"
                }
            }]
        }
    });

    map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": "points",
        "layout": {
          "icon-image": "{icon}-15",
          "text-field": "{title}",
          "text-font": ["Lato Regular", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top"
        }

    });
  });
}

function setSkihuetten(map){
  map.on('load', function () {
    map.addSource("huetten", {
        "type": "geojson",
        "data": skihuetten
    });

    map.addLayer({
        "id": "huetten",
        "type": "symbol",
        "source": "huetten",
        "layout": {
          "icon-image": "rrestaurant-15",
          "text-field": "{name}",
          "text-font": ["Lato Regular", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, 0.6],
          "text-anchor": "top"
        },
        "paint": {
          "text-color": "#295e72",
          "icon-color": "#295e72",
        }
    });
  });
}
