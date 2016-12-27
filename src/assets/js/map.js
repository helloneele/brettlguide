import huts from '../../../build/data/skihuetten'
import slopes from '../../../build/data/skipisten'
import lifts from '../../../build/data/skilifte'
import parkingSpaces from '../../../build/data/parkplaetze'
import gebietsnr from '../../../build/data/gebietsnr'


// use map.loaded true/false for preloader image

let map;

export default function(long, lat) {

  //document.getElementById("map").style.height = window.innerHeight + "px";

  mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9uZWVsZSIsImEiOiJjaXVlamJoYjEwMDFmMnZxbGk1ZDBzMXdwIn0.i3Sy5G_gVjDLOJ9VcORhcQ'

  map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/helloneele/ciw0yc5ft00dh2jo5ml0fklvd', //hosted style id
      center: [long, lat], // starting position
      zoom: 10, // starting zoom
      pitch: 60
  });

  map.on('load', function () {
    setCurrentPos(map, long, lat)
    setSlopes(map)
    setLifts(map)
    setHuts(map)
    setParkingSpaces(map)
  });

  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['huts', 'parking', 'lifts', 'slopesBlue', 'slopesRed', 'slopesBlack'] });

    if (!features.length)
      return;

    // Get clicked element
    var feature = features[0];
 
    console.log(feature)
   
    switch(feature.layer.id)
    {
      case "parking":
      goToTarget(feature, "parking");
      break;

      case "lifts":
      goToTarget(feature, "lifts");
      break;

      case "huts":
      goToTarget(feature, "huts");
      break;

      case "slopesBlue":
      case "slopesRed":
      case "slopesBlack":
      goToTarget(feature, "slope");
      break;

      default:
      goToTarget(feature);
    }


  });

  // hide/display layers
  // map.setLayoutProperty('my-layer', 'visibility', 'none');
}

function goToTarget(feature, string){
  if(string == "search"){
    //let h = document.getElementById("searchheader");
    //h.innerHTML = feature.properties.name;
    map.flyTo({center: feature.geometry.coordinates[0][0], zoom: 15, pitch: 45});
    map.once('moveend', function() {
      var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates[0][0])
        .setHTML(feature.properties.name)
        .addTo(map)
    });
    return
  }
  else if(string =="area"){

    //let h = document.getElementById("searchheader");
    //h.innerHTML = feature.Skigebiet;
     map.flyTo({center: feature.Koordinaten, zoom: 15, pitch: 45});
      map.once('moveend', function() {
      var popup = new mapboxgl.Popup()
        .setLngLat(feature.Koordinaten)
        .setHTML(feature.Skigebiet+"<br><a href='../detailansicht'>Details</a>")
        .addTo(map)
    });
    return
  }
  else if(string =="slope"|| string =="Piste"){

    //let h = document.getElementById("searchheader");
    //h.innerHTML = feature.Skigebiet;
     map.flyTo({center: feature.geometry.coordinates[0][7], zoom: 15, pitch: 45});

      map.once('moveend', function() {
       var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates[0][7])
        .setHTML(feature.properties.name)
        .addTo(map)
    });
    return
  }
  else if(string =="parking")
  {
     map.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45});
     map.once('moveend', function() {
       var popup = new mapboxgl.Popup()
         .setLngLat(feature.geometry.coordinates)
         .setHTML("Parkplätze: "+feature.properties.groesse)
         .addTo(map)
         });
    return

  }

  else if(string == "huts" || string =="Hütte")
  {
    map.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45});
     map.once('moveend', function() {
       var popup = new mapboxgl.Popup()
         .setLngLat(feature.geometry.coordinates)
         .setHTML(feature.properties.name+"<br><a href='../detailansicht'>Tagesangebote</a>")
         .addTo(map)
         });
    return

  }

  else if(string == "lifts" || string =="Lift")
  {
    map.flyTo({center: feature.geometry.coordinates[0], zoom: 15, pitch: 45});
     map.once('moveend', function() {
       var popup = new mapboxgl.Popup()
         .setLngLat(feature.geometry.coordinates[0])
         .setHTML(feature.properties.name)
         .addTo(map)
         });
    return

  }

  // else if (typeof feature.layer.id !== "undefined" && feature.layer.id == "slopesBlue"){
  //   this.flyTo({center: e.lngLat, zoom: 15, pitch: 45});
  //   this.once('moveend', function() {
  //     var popup = new mapboxgl.Popup()
  //       .setLngLat(e.lngLat)
  //       .setHTML(feature.properties.name)
  //       .setHTML(feature.properties.p_nr)
  //       .addTo(map)
  //   });
  // }
  // else if (typeof feature.layer.id !== "undefined" && feature.layer.id == "parkplaetze"){
  //   this.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45});
  //   this.once('moveend', function() {
  //     var popup = new mapboxgl.Popup()
  //       .setLngLat(feature.geometry.coordinates)
  //       .setHTML(feature.properties.groesse)
  //       .addTo(map)
  //   });
  // }

  else{
    //let h = document.getElementById("searchheader");
    //h.innerHTML = feature.properties.name;
    // https://www.mapbox.com/mapbox-gl-js/example/center-on-symbol/
    this.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45})
    // https://www.mapbox.com/mapbox-gl-js/api/#Popup
    this.once('moveend', function() {
      var popup = new mapboxgl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(feature.properties.name)
        .addTo(map)
    });
  }

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

function setHuts(map){
    map.addSource("huts", {
        "type": "geojson",
        "data": huts
    });

    map.addLayer({
        "id": "huts",
        "type": "symbol",
        "source": "huts",
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

function setSlopes(){
    map.addSource("slopes", {
        "type": "geojson",
        "data": slopes
    });

    map.addLayer({
        "id": "slopesBlue",
        "type": "fill",
        "source": "slopes",
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
        "id": "slopesRed",
        "type": "fill",
        "source": "slopes",
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
        "id": "slopesBlack",
        "type": "fill",
        "source": "slopes",
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

function setLifts(map){
    map.addSource("lifts", {
        "type": "geojson",
        "data": lifts
    });
    map.addLayer({
        "id": "lifts",
        "type": "line",
        "source": "lifts",
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

function setParkingSpaces(map){
    map.addSource("parking", {
        "type": "geojson",
        "data": parkingSpaces
    });
    map.addLayer({
        "id": "parking",
        "type": "symbol",
        "source": "parking",
        "minzoom": 13,
        "layout": {
          "icon-image": "pparking-15"
        }
    });
}

let field = document.getElementById("searchfield");
field.addEventListener("keyup", search);

function search() {

    if(this.value.length >= 3) {
        let regEx = new RegExp(this.value, "i");
        let matchedHuts = scanFile(huts, regEx, "Hütte");
        let matchedSlopes = scanFile(slopes, regEx , "Piste");
        let matchedLifts = scanFile(lifts, regEx, "Lift");

        let listItems = new Map([ ...matchedHuts, ...matchedSlopes, ...matchedLifts]);

        updateListItems(listItems);
    }
    else {
        let ul = document.getElementById("suggestions");
        deleteAllListItems(ul);
    }
}


function scanFile(file, regEx, ident) {

    let suggestions = new Map();

    for(let object of file.features) {
        let name = object.properties.name;

        if(name.match(regEx))
        {
            suggestions.set(object, ident);
        }
    }
    return suggestions;
}


function updateListItems(listItems) {

    let ul = document.getElementById("suggestions");

    deleteAllListItems(ul);

    for(let [key, val] of listItems) {
        let li = document.createElement("li");
        li.setAttribute("class", "suggestion");

        let p = document.createElement("p");
        p.innerHTML = getItemContent(key);

        let area = document.createElement("p");
        let areaName = getItemArea(key);
        area.innerHTML = "("+areaName.Skigebiet+") \t";

        let a = document.createElement("a");
        a.innerHTML = "Details";
        a.setAttribute("href", "huts/assl");

        let span = document.createElement("span");
        span.innerHTML = "\t//" + val ;

        li.appendChild(area);
        li.appendChild(p);
        p.appendChild(a);
        li.appendChild(span);
        ul.appendChild(li);

        p.addEventListener("click", function(){
          goToTarget(key, val)
        })

        area.addEventListener("click", function(){
          goToTarget(areaName, "area")
        })
    }
}

function deleteAllListItems(ul) {
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.firstElementChild);
    }
}

/*function getItemContent(key) {
    for (let object of gebietsnr) {
        if (object.Nr == key.properties.gb_nr) {
            return key.properties.name + " (" + object.Skigebiet + ")" + "\t";
        }
    }
    return key.properties.name + "\t";
}*/

function getItemContent(key) {
    for (let object of gebietsnr) {
        if (object.Nr == key.properties.gb_nr) {
            return key.properties.name + "\t";
        }
    }
    return key.properties.name + "\t";
}

function getItemArea(key) {
  for (let object of gebietsnr) {
        if (object.Nr == key.properties.gb_nr) {
            return object;
        }
    }
    return "";
}
