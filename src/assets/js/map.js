import skihuetten from '../../../build/data/skihuetten'
import skipisten from '../../../build/data/skipisten'
import skilifte from '../../../build/data/skilifte'
import parkplaetze from '../../../build/data/parkplaetze'

// use map.loaded true/false for preloader image

export default function(long, lat) {
  document.getElementById("map").style.height = window.innerHeight + "px";

  mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9uZWVsZSIsImEiOiJjaXVlamJoYjEwMDFmMnZxbGk1ZDBzMXdwIn0.i3Sy5G_gVjDLOJ9VcORhcQ'

  var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/helloneele/ciw0yc5ft00dh2jo5ml0fklvd', //hosted style id
      center: [long, lat], // starting position
      zoom: 10, // starting zoom
      pitch: 60
  });

  map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
  }));

  map.on('load', function () {
    setCurrentPos(map, long, lat)
    setSkipisten(map)
    setSkilifte(map)
    setSkihuetten(map)
    setParkingSpots(map)
  });

  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['huetten', 'parkplaetze', 'skilifte', 'skipistenx'] });
    console.log(features);
    if (!features.length) {
        return;
    }

    // Get clicked element
    var feature = features[0];

    if (feature.layer.id == "skipistenx"){
      this.flyTo({center: e.lngLat, zoom: 15, pitch: 45});
      this.once('moveend', function() {
        var popup = new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(feature.properties.name)
          .setHTML(feature.properties.p_nr)
          .addTo(map)
      });
    }
    else if (feature.layer.id == "parkplaetze"){
      this.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45});
      this.once('moveend', function() {
        var popup = new mapboxgl.Popup()
          .setLngLat(feature.geometry.coordinates)
          .setHTML(feature.properties.groesse)
          .addTo(map)
      });
    }

    else{
      // https://www.mapbox.com/mapbox-gl-js/example/center-on-symbol/
      this.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45});
      // https://www.mapbox.com/mapbox-gl-js/api/#Popup
      this.once('moveend', function() {
        var popup = new mapboxgl.Popup()
          .setLngLat(feature.geometry.coordinates)
          .setHTML(feature.properties.name)
          .addTo(map)
      });
    }

  });

}


function setCurrentPos(map, long, lat){
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
}

function setSkihuetten(map){
    map.addSource("huetten", {
        "type": "geojson",
        "data": skihuetten
    });

    map.addLayer({
        "id": "huetten",
        "type": "symbol",
        "source": "huetten",
        "minzoom": 13,
        "layout": {
          "icon-image": "rrestaurant-15",
          //"text-field": "{name}",
          "text-font": ["Lato Regular", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, 0.6],
          "text-anchor": "top"
        },
        "paint": {
          "text-color": "#295e72"
        }
    });
}

function setSkipisten(map){
  console.log("pisten")

    map.addSource("skipisten2", {
        "type": "geojson",
        "data": skipisten
    });

    console.log(skipisten.features[0].properties['schwgrad']);
    map.addLayer({
        "id": "skipistenx",
        "type": "fill",
        "source": "skipisten2",
        "filter": ["==", "schwgrad", 1],
        "layout": {
        },
        "paint": {
          "fill-color": "#295e72",
          "fill-opacity": 0.5,
          "fill-outline-color": "#295e72"
        }
    });

    map.addLayer({
        "id": "skipistenxx",
        "type": "fill",
        "source": "skipisten2",
        "filter": ["==", "schwgrad", 2],
        "layout": {
        },
        "paint": {
          "fill-color": "#722929",
          "fill-opacity": 0.5,
          "fill-outline-color": "#722929"
        }
    });

    map.addLayer({
        "id": "skipistenxxx",
        "type": "fill",
        "source": "skipisten2",
        "filter": ["==", "schwgrad", 3],
        "layout": {
        },
        "paint": {
          "fill-color": "#333",
          "fill-opacity": 0.5,
          "fill-outline-color": "#333"
        }
    });
}

function setSkilifte(map){
  console.log("lifte")

    map.addSource("skilifte", {
        "type": "geojson",
        "data": skilifte
    });

    map.addLayer({
        "id": "skilifte",
        "type": "line",
        "source": "skilifte",
        "layout": {
            "line-join": "round",
            "line-cap": "square"
        },
        "paint": {
          "line-color": "#111",
          "line-width": 3,
          "line-dasharray": [3, 2]
        }
    });
}

function setParkingSpots(map){
    console.log(parkplaetze)
    map.addSource("parkplaetze", {
        "type": "geojson",
        "data": parkplaetze
    });

    map.addLayer({
        "id": "parkplaetze",
        "type": "symbol",
        "source": "parkplaetze",
        "minzoom": 13,
        "layout": {
          "icon-image": "pparking-15"
        }
    });
}
