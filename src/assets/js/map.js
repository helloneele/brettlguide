import skihuetten from '../../../build/data/skihuetten'
import skipisten from '../../../build/data/skipisten'
import skilifte from '../../../build/data/skilifte'

// use map.loaded true/false for preloader image

export default function(long, lat) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9uZWVsZSIsImEiOiJjaXVlamJoYjEwMDFmMnZxbGk1ZDBzMXdwIn0.i3Sy5G_gVjDLOJ9VcORhcQ'

  var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/helloneele/ciw0yc5ft00dh2jo5ml0fklvd', //hosted style id
      center: [long, lat], // starting position
      zoom: 10, // starting zoom
      pitch: 60
  });

  map.on('load', function () {
    setCurrentPos(map, long, lat)
    setSkipisten(map)
    setSkilifte(map)
    setSkihuetten(map)
  });

  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['huetten', 'skilifte'] });

    if (!features.length) {
        return;
    }

    var feature = features[0];
    console.log(feature);
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
}

function setSkipisten(map){
  console.log("pisten")

    map.addSource("skipisten", {
        "type": "geojson",
        "data": skipisten
    });

    map.addLayer({
        "id": "skipisten",
        "type": "fill",
        "source": "skipisten",
        "layout": {
            // "line-join": "round",
            // "line-cap": "round"
        },
        "paint": {
          "fill-color": "#4bb4ca",
          "fill-opacity": 0.6
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
            "line-cap": "round"
        },
        "paint": {
          "line-color": "#295e72",
          "line-width": 2
          // "line-dasharray": [10, 4]
        }
    });
}
