import mapTpl from '../../../build/assets/templates/map';
import slopeTpl from '../../../build/assets/templates/slopes';
import hutTpl from '../../../build/assets/templates/huts';
import liftTpl from '../../../build/assets/templates/lifts';
import areasTpl from '../../../build/assets/templates/areas';
import imprintTpl from '../../../build/assets/templates/imprint';
import notFoundTpl from '../../../build/assets/templates/notFound';

import huts from '../data/skihuetten';
import slopes from '../data/skipisten';
import lifts from '../data/skilifte';
import parkingSpaces from '../data/parkplaetze';
import skiingAreas from '../data/gebietsnr';

import * as map from './map';
import detectLocation from './detectLocation';
import getObject from './getObject';
import * as charts from './charts';

let dynamicContent = document.getElementById("dynamic-content");

let templates = {
    index: (ctx) => {
        detectLocation()
        dynamicContent.innerHTML = mapTpl();
    },
    slopes: (ctx) => {
        let slope = getObject.slope(ctx.params.slope, slopes);

        if (slope) {
            map.detectTargetPosition(slope, "slopes");
            let area = map.getItemArea(slope);
            dynamicContent.innerHTML = slopeTpl({slope: slope, area: area});
        }
        else {
            templates.notFound();
        }
    },
    huts: (ctx) => {
        let hut = getObject.hut(ctx.params.hut, huts)

        if (hut) {
            map.detectTargetPosition(hut, "huts");
            let area = map.getItemArea(hut);
            dynamicContent.innerHTML = hutTpl({hut: hut, area: area});
        }
        else {
            templates.notFound();
        }
    },
    lifts: (ctx) => {
        let lift = getObject.lift(ctx.params.lift, lifts);

        if (lift) {
            map.detectTargetPosition(lift, "lifts");
            let area = map.getItemArea(lift);
            dynamicContent.innerHTML = liftTpl({lift: lift, area: area});
        }
        else {
            templates.notFound();
        }
    },
    areas: (ctx) => {
        let area = getObject.area(ctx.params.area, skiingAreas);

        if (area) {
            let areaSlopes = getObject.allOfArea(area.properties.gb_nr, slopes);
            let areaHuts = getObject.allOfArea(area.properties.gb_nr, huts);
            let areaLifts = getObject.allOfArea(area.properties.gb_nr, lifts);
            let areaParkingSpaces = getObject.allOfArea(area.properties.gb_nr, parkingSpaces);

            map.detectTargetPosition(area, "areas");
            dynamicContent.innerHTML = areasTpl({
                area: area,
                slopes: areaSlopes,
                huts: areaHuts,
                lifts: areaLifts,
                parking: areaParkingSpaces
            });
            charts.auslastung();
            charts.schwierigkeit();
            charts.schnee();
        }
        else {
            templates.notFound();
        }
    },
    imprint: () => {
        dynamicContent.innerHTML = imprintTpl();
    },
    notFound: () => {
        dynamicContent.innerHTML = notFoundTpl();
    }
};



export default templates;
