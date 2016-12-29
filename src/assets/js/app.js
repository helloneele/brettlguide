import detectLocation from './detectLocation';
import map from './map';

import routing from './routing'
import page from 'page';

//define routes
page('/', routing.index);
page('/slopes/:slope', routing.slopes);
page('/huts/:hut', routing.huts);
page('/lifts/:lift', routing.lifts);
page('/areas/:area', routing.areas);
page('*', routing.notFound);
page.start();


//TODO
// cache manifest https://developer.mozilla.org/de/docs/Web/HTML/Using_the_application_cache

detectLocation();

