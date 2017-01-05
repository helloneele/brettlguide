import huts from '../../../build/data/skihuetten'
import slopes from '../../../build/data/skipisten'
import lifts from '../../../build/data/skilifte'
import parkingSpaces from '../../../build/data/parkplaetze'
import skiingAreas from '../../../build/data/gebietsnr'


// use map.loaded true/false for preloader image

let map;
let layersLoaded = false;

export default function initMap(long, lat){
  console.log("init Map");

  mapboxgl.accessToken = 'pk.eyJ1IjoiaGVsbG9uZWVsZSIsImEiOiJjaXVlamJoYjEwMDFmMnZxbGk1ZDBzMXdwIn0.i3Sy5G_gVjDLOJ9VcORhcQ'
  map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/helloneele/ciw0yc5ft00dh2jo5ml0fklvd', //hosted style id
      center: [long, lat], // starting position
      zoom: 8, // starting zoom
      pitch: 60
  });

  addMapEvents();
}

function addMapEvents() {
  let layers = ['areas'];

  map.on('load', function() {
    setSkiingAreas();
  });

  map.on('zoom', function() {
    if(!layersLoaded && map.getZoom() > 12){
      layersLoaded = true;
      setSlopes();
      setLifts();
      setHuts();
      setParkingSpaces();
      layers = ['huts', 'parking', 'lifts', 'slopesBlue', 'slopesRed', 'slopesBlack', 'areas'];
    }
  });

  map.on('click', function (e) {
    let features = map.queryRenderedFeatures(e.point, {layers: layers });
    if (features.length)
      detectTargetPosition(features[0], features[0].layer.id, e);
  });
  // hide/display layers
  // map.setLayoutProperty('my-layer', 'visibility', 'none');
}

export function detectTargetPosition(feature, string, e) {
    if(!e && !feature.geometry.coordinates) {
        let text = "Keine Koordinaten für " + feature.properties.name + " vorhanden";
        alert(text);
        return;
    }
    else {
        let popUpContent;
        let position;
        let offset;
        switch (string) {
            case "huts":
            case "parking":
                popUpContent = createPopUpDiv(feature, string);
                position = feature.geometry.coordinates;
                break;

            case "areas":
              if(e)
                position = [e.lngLat.lng, e.lngLat.lat];
              else
                position = feature.geometry.coordinates;
              break;

            case "slopesBlue":
            case "slopesRed":
            case "slopesBlack":
            case "slopes":
                if(e)
                    position = [e.lngLat.lng, e.lngLat.lat];
                else
                    position = feature.geometry.coordinates[0][0];

                popUpContent = createPopUpDiv(feature, "slopes");
                offset = 0;
                break;

            case "lifts":
                if(e)
                    position = [e.lngLat.lng, e.lngLat.lat];
                else
                    position = feature.geometry.coordinates[0];

                popUpContent = createPopUpDiv(feature, string);
                break;
        }
        moveToTarget(position[0], position[1])
        if(popUpContent != null)
          addPopUpToMap(popUpContent, position, offset);
    }

}

//new function for all FLYTO EVENTS -- NEEDS TO STAY
export function moveToTarget(long, lat){
  map.flyTo({center: [long, lat], zoom: 15, pitch: 45});
}

function createPopUpDiv(feature, ident) {
    let div = document.createElement("div");
    div.classList.add("popup");
    let h1 = document.createElement("h1");
    if(ident !== "parking"){
        h1.innerHTML = feature.properties.name;
        let a = getDetailLinkElement(feature, ident, "Details");
        div.appendChild(h1);
        div.appendChild(a);
    }
    else {
        h1.innerHTML= "Parkplatz";
        let p = document.createElement("p");
        p.innerHTML = "Parkplätze: " + feature.properties.groesse;
        div.appendChild(h1);
        div.appendChild(p);
    }
    return div;
}

function addPopUpToMap(popUpContent, position, offset){
  map.once('moveend', function() {
    let popup;
    let options;
    if(offset != 0) //no offset for slopes
      options = {offset:[0, -20]};
    popup = new mapboxgl.Popup(options)
    .setLngLat(position)
    .setDOMContent(popUpContent)
    .addTo(map);
  });
}

export function setCurrentPos(long, lat){
  // remove layer if initialized before
  if(map.style._layers.currentPos){
    map.removeLayer("currentPos");
    map.removeSource("currentPos");
  }

  map.addSource("currentPos", {
      "type": "geojson",
      "data": {
          "type": "FeatureCollection",
          "features": [{
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [long, lat]
              }
          }]
      }
  });

    map.addLayer({
        "id": "currentPos",
        "type": "symbol",
        "source": "currentPos",
        "layout": {
          "icon-image": "mmarker-15",
          "text-field": "Standort",
          "text-font": ["Lato Bold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.8],
          "text-size": 12,
          "text-anchor": "top"
        },
        "paint": {
          "text-color": "#295e72",
          "text-halo-width": 2,
          "text-halo-color": "rgba(255,255,255,0.7)",
          "text-halo-blur": 0
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
        "minzoom": 12,
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
        "minzoom": 12,
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
        "minzoom": 12,
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
        "minzoom": 12,
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
        "minzoom": 12,
        "layout": {
            "line-join": "round",
            "line-cap": "square"
        },
        "paint": {
          "line-color": "#111",
          "line-width": 2,
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
        "minzoom": 12,
        "layout": {
          "icon-image": "pparking-15"
        }
    });
}

function setSkiingAreas(){
    map.addSource("areas", {
        "type": "geojson",
        "data": skiingAreas
    });
    map.addLayer({
        "id": "areas",
        "type": "symbol",
        "source": "areas",
        "maxzoom": 12,
        "layout": {
          "icon-image": "mmountain-15",
          "text-field": "{name}",
          "text-font": ["Lato Bold", "Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-size": 13,
          "text-offset": [0, 1.5],
          "text-anchor": "top"
        },
        "paint":{
          "text-color": "#295e72",
          "text-halo-width": 2,
          "text-halo-color": "rgba(255,255,255,0.7)",
          "text-halo-blur": 0
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
    let matchedHuts = scanFile(huts, regEx, "huts");
    let matchedSlopes = scanFile(slopes, regEx, "slopes");
    let matchedLifts = scanFile(lifts, regEx, "lifts");
    let matchtedAreas = scanFile(skiingAreas, regEx, "areas");

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
        let li = document.createElement("li")
        li.setAttribute("class", "suggestion")

        let textSpan = document.createElement("span")
        textSpan.setAttribute("class", "suggestion__text")

        let aName = getDetailLinkElement(key, val, key.properties.name)
        aName.setAttribute("class", "suggestion__name")

        let icon = document.createElement("img")
        icon.setAttribute("class", "suggestion__icon")
        icon.setAttribute("src", "/assets/img/icon_"+ val +".svg")

        li.appendChild(icon)
        textSpan.appendChild(aName)

        let br = document.createElement('br')
        textSpan.appendChild(br)

        if(val !== "areas") {
            let area = getItemArea(key)

            if(area) {
                let aArea = getDetailLinkElement(area, "areas", area.properties.name)
                aArea.setAttribute("class", "suggestion__area")
                textSpan.appendChild(aArea);
            }
        }

        li.appendChild(textSpan)
        ul.appendChild(li)
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
    let path = "/" + val + "/";

    if(val === "huts") {
        path += key.properties.h_id;
    }
    else if(val === "slopes") {
        let id = key.properties.gb_nr + "-"
        + key.properties.p_nr + "-"
        + key.properties.a_nr + "-"
        + key.properties.a_name;
        path += id;
    }
    else if(val === "lifts") {
        path += key.properties.s_id;
    }
    else if(val === "areas") {
        path += key.properties.gb_nr;
    }
    else {
        return "*";
    }
    return path;
}
