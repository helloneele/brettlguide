//import detectLocation from './detectLocation';
//import map from './map';
import routing from './routing'
import page from 'page';

//detectLocation()

//define routes
page('/', routing.index);
page('/slopes/:slope', routing.slopes);
page('/huts/:hut', routing.huts);
page('/lifts/:lift', routing.lifts);
page('/areas/:area', routing.areas);
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


//TODO
// cache manifest https://developer.mozilla.org/de/docs/Web/HTML/Using_the_application_cache
