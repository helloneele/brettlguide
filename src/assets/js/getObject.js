import huts from '../../../build/data/skihuetten';
import slopes from '../../../build/data/skipisten';
import lifts from '../../../build/data/skilifte';
import parkingSpaces from '../../../build/data/parkplaetze';
import skiingAreas from '../../../build/data/gebietsnr';

export default {
    slope: (param) => {
        for(let object of slopes.features)
        {
            let id = object.properties.gb_nr + "-"
                + object.properties.p_nr + "-"
                + object.properties.a_nr + "-"
                + object.properties.a_name;

            if(id === param)
            {
                return object;
            }
        }
    },
    hut: (param) => {
        for(let object of huts.features)
        {
            if(object.properties.h_id === param)
            {
                return object;
            }
        }
    },
    lift: (param) => {
        for(let object of lifts.features)
        {
            if(object.properties.s_id == param) //id ist number
            {
                return object;
            }
        }
    }/*,
    area: (param) => {
        for(let object of skiingAreas.features)
        {
            if(object.properties.gb_nr === param)
            {
                return object;
            }
        }
    }*/
};
