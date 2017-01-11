import map from './map';
import routing from './routing';
import page from 'page';

map(12.9863903, 47.8027887)

//define routes
page('/', routing.index);
page('/slopes/:slope', routing.slopes);
page('/huts/:hut', routing.huts);
page('/lifts/:lift', routing.lifts);
page('/areas/:area', routing.areas);
page('/imprint', routing.imprint);
page('*', routing.notFound);
page.start();
