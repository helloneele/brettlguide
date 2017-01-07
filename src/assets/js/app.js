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

// SCROLLTOP ///////////
console.log("hello")
let scrollTopButton = document.getElementsByClassName("scrollTop")[0]
console.log(scrollTopButton)
scrollTopButton.addEventListener("click", scrollContentTop)

function scrollContentTop(){
  console.log("click")
  let height = window.innerHeight - 80

  var scroll = 0.1;  // initial opacity
  var timer = setInterval(function () {
      if (scroll >= height){
          clearInterval(timer);
      }
      window.scrollTo(0, scroll);
      scroll += scroll * 0.6;
        if(scroll > height){
          clearInterval(timer);
          window.scrollTo(0, height);
        }
  }, 70);
}


function fadeIn(height) {

}
