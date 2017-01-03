import mapTpl from '../../../build/assets/templates/map';
import slopeTpl from '../../../build/assets/templates/slopes';
import hutTpl from '../../../build/assets/templates/huts';
import liftTpl from '../../../build/assets/templates/lifts';
import areasTpl from '../../../build/assets/templates/areas';
import notFoundTpl from '../../../build/assets/templates/notFound';

import detectLocation from './detectLocation';
import getObject from './getObject';


let dynamicContent = document.getElementById("dynamic-content");

let templates = {
    index: () => {
        detectLocation();
        //dynamicContent.innerHTML = mapTpl(); //map handlebar anzeigen
    },
    slopes: (ctx) => {
        let slope = getObject.slope(ctx.params.slope);

        if (slope) {
            dynamicContent.innerHTML = slopeTpl(slope);
        }
        else {
            templates.notFound();
        }
    },
    huts: (ctx) => {
        let hut = getObject.hut(ctx.params.hut);

        if (hut) {
            dynamicContent.innerHTML = hutTpl(hut);
        }
        else {
            templates.notFound();
        }
    },
    lifts: (ctx) => {
        let lift = getObject.lift(ctx.params.lift);

        if (lift) {
            dynamicContent.innerHTML = liftTpl(lift);
        }
        else {
            templates.notFound();
        }
    },
    areas: (ctx) => {
        let area = getObject.area(ctx.params.area);

        if (area) {
            dynamicContent.innerHTML = liftTpl(area);
        }
        else {
            templates.notFound();
        }
    },
    notFound: () => {
        dynamicContent.innerHTML = notFoundTpl();
    }
};

export default templates;