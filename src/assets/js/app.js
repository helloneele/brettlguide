import detectLocation from './detectLocation';
import map from './map';
import routing from './routing';
import * as charts from './charts';
import page from 'page';

map(12.9863903, 47.8027887)
//map(13.37575, 47.49949)

//define routes
page('/', routing.index);
page('/slopes/:slope', routing.slopes);
page('/huts/:hut', routing.huts);
page('/lifts/:lift', routing.lifts);
page('/areas/:area', routing.areas);
page('/imprint', routing.imprint);
page('*', routing.notFound);
page.start();

// SEARCH ///////////
let searchToggleButton = document.getElementById("searchToggle")
searchToggleButton.addEventListener("click", searchToggle)

function searchToggle(e){
  this.classList.toggle("active")
  document.getElementById("search").classList.toggle("active")

  let icon = document.getElementById("icon")
  icon.classList.toggle("fa-search", !this.classList.contains('active'))
  icon.classList.toggle("fa-close", this.classList.contains('active'))
}

// FINDLOCATION ///////////
let locationToggleButton = document.getElementById("locationToggle")
locationToggleButton.addEventListener("click", locationToggle)

function locationToggle(e){
  detectLocation();
}

//TODO
// cache manifest https://developer.mozilla.org/de/docs/Web/HTML/Using_the_application_cache
