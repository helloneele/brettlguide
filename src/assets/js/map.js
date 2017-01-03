import huts from '../../../build/data/skihuetten'
import slopes from '../../../build/data/skipisten'
import lifts from '../../../build/data/skilifte'
import parkingSpaces from '../../../build/data/parkplaetze'
import skiingAreas from '../../../build/data/gebietsnr'


// use map.loaded true/false for preloader image

let map;
let layersLoaded = false;


export default function(long, lat) {
  //document.getElementById("map").style.height = window.innerHeight-70 + "px";

  mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9uZWVsZSIsImEiOiJjaXVlamJoYjEwMDFmMnZxbGk1ZDBzMXdwIn0.i3Sy5G_gVjDLOJ9VcORhcQ'

  map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/helloneele/ciw0yc5ft00dh2jo5ml0fklvd', //hosted style id
      center: [long, lat], // starting position
      zoom: 10, // starting zoom
      pitch: 60
  });

  map.on('load', function() {
    setCurrentPos(long, lat)
    //TODO LOAD Skigebiete
  });

  map.on('zoom', function() {
    if(!layersLoaded && map.getZoom() > 12){
      layersLoaded = true
      setSlopes()
      setLifts()
      setHuts()
      setParkingSpaces()
    }
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
      goToTarget(feature, "lifts", e);
      break;

      case "huts":
      goToTarget(feature, "huts");
      break;

      case "slopesBlue":
      case "slopesRed":
      case "slopesBlack":
      goToTarget(feature, "slope", e);
      break;

      default:
      goToTarget(feature);
    }
  });

  // hide/display layers
  // map.setLayoutProperty('my-layer', 'visibility', 'none');
}


function goToTarget(feature, string, e){
    if(!e && !feature.geometry.coordinates) {
        let text = "Keine Koordinaten für " + feature.properties.name + " vorhanden";
        alert(text);
        return;
    }
    if(string === "area" || string === "Skigebiet" ){
        let div = createPopUpDiv(feature, "Skigebiet");

        map.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45});

        map.once('moveend', function() {
            var popup = new mapboxgl.Popup()
                .setLngLat(feature.geometry.coordinates)
                .setDOMContent(div)
                .addTo(map);
        });
        return;
    }
    else if(string === "slope" || string === "Piste"){
        let div = createPopUpDiv(feature, "Piste");
        let coordinate;

        if(string === "slope") {
            coordinate = e.lngLat;
        }
        else{
            coordinate = feature.geometry.coordinates[0][0];
        }
        map.flyTo({center: coordinate, zoom: 15, pitch: 45});

        map.once('moveend', function() {
            var popup = new mapboxgl.Popup()
                .setLngLat(coordinate)
                .setDOMContent(div)
                .addTo(map);
        });
        return;
    }
    else if(string =="parking") {
        map.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45});

        map.once('moveend', function() {
            var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML("Parkplätze: "+ feature.properties.groesse)
            .addTo(map);
        });
        return;
    }
    else if(string == "huts" || string =="Hütte") {
        let div = createPopUpDiv(feature, "Hütte");

        map.flyTo({center: feature.geometry.coordinates, zoom: 15, pitch: 45});

        map.once('moveend', function() {
            var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setDOMContent(div)
            .addTo(map);
        });
        return;
    }
    else if(string == "lifts" || string =="Lift") {
        let div = createPopUpDiv(feature, "Lift");
        let coordinate;

        if(string === "lifts") {
            coordinate = e.lngLat;
        }
        else{
            coordinate = feature.geometry.coordinates[0];
        }
        map.flyTo({center: coordinate, zoom: 15, pitch: 45});

        map.once('moveend', function() {
        var popup = new mapboxgl.Popup()
            .setLngLat(coordinate)
            .setDOMContent(div)
            .addTo(map)
            });
        return;
    }
}

function createPopUpDiv(feature, ident) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.innerHTML = feature.properties.name;
    let a = getDetailLinkElement(feature, ident, "Details");

    div.appendChild(p);
    div.appendChild(a);

    return div;
}


function setCurrentPos(long, lat){
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

function setHuts(){
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

function setLifts(){
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

function setParkingSpaces(){
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
field.addEventListener("focus", search);

function search() {
  let ul = document.getElementById("suggestions");

  if(this === document.activeElement){
    ul.classList.remove("hidden")
  }

  if(this.value.length >= 3) {
    let regEx = new RegExp(this.value, "i");
    let matchedHuts = scanFile(huts, regEx,  "Hütte");
    let matchedSlopes = scanFile(slopes, regEx , "Piste");
    let matchedLifts = scanFile(lifts, regEx, "Lift");
    let matchtedAreas = scanFile(skiingAreas, regEx, "Skigebiet")

    let listItems = new Map([ ...matchedHuts, ...matchedSlopes, ...matchedLifts, ...matchtedAreas]);

    updateListItems(listItems);

    // closing suggestions if clicked outside
    document.addEventListener('click', function(event) {
    let isClickInside = document.getElementById("search").contains(event.target);
    if (!isClickInside)
      hideSearchResults()
    });

  }
  else {
      deleteAllListItems(ul)
  }
}


function scanFile(file, regEx, ident) {
    let suggestions = new Map();

    for(let object of file.features) {
        let name = object.properties.name;

        if(name.match(regEx)) {
            suggestions.set(object, ident);
        }
    }
    return suggestions;
}

function hideSearchResults() {
  let results = document.getElementById("suggestions")
  results.classList.add("hidden")
}

function updateListItems(listItems) {

    let ul = document.getElementById("suggestions");

    deleteAllListItems(ul);

    for(let [key, val] of listItems) {
        let li = document.createElement("li");
        li.setAttribute("class", "suggestion");

        let p = document.createElement("p");

        let pName = document.createElement("p");
        pName.innerHTML = key.properties.name;

        let span = document.createElement("span");
        span.innerHTML = "//" + val ;

        let a = getDetailLinkElement(key, val, "Details");

        if(val !== "Skigebiet") {
            let area = getItemArea(key);

            if(area) {
                let pArea = document.createElement("p");
                pArea.innerHTML = "(" + area.properties.name + ")";
                li.appendChild(pArea);

                pArea.addEventListener("click", function () {
                    goToTarget(area, "area")
                });
            }
        }

        pName.addEventListener("click", function () {
            goToTarget(key, val)
        });

        li.appendChild(p);
        p.appendChild(pName);
        p.appendChild(a);
        li.appendChild(span);
        ul.appendChild(li);
    }
}

function deleteAllListItems(ul) {
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.firstElementChild);
    }
}

function getItemArea(key) {
  for (let object of skiingAreas.features) {
        if (object.properties.gb_nr == key.properties.gb_nr) {
            return object;
        }
    }
}


function getDetailLinkElement(key, val, text) {
    let a = document.createElement("a");
    let path = getPath(key, val);
    a.innerHTML = text;
    a.setAttribute("href", path);

    return a;
}

function getPath(key, val) {
    let path = "*";

    if(val === "Hütte")
    {
        path = "/huts/" + key.properties.h_id;
    }
    else if(val === "Piste")
    {
        let id = key.properties.gb_nr + "-"
        + key.properties.p_nr + "-"
        + key.properties.a_nr + "-"
        + key.properties.a_name;
        path = "/slopes/" + id;
    }
    else if(val === "Lift")
    {
        path = "/lifts/" + key.properties.s_id;
    }
    else if(val === "Skigebiet")
    {
        path = "/areas/" + key.properties.gb_nr;
    }
    return path;
}
