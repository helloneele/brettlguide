
export default {
    slope: (param, file) => {
        for(let object of file.features) {
            let id = object.properties.gb_nr + "-"
                + object.properties.p_nr + "-"
                + object.properties.a_nr;

            if(id === param) {
                return object;
            }
        }
    },
    hut: (param, file) => {
        for(let object of file.features) {
            let id = object.properties.h_id + "-"
            + object.properties.name;
            if(id === param) {
                return object;
            }
        }
    },
    lift: (param, file) => {
        for(let object of file.features) {
            if(object.properties.s_id == param) //id ist number
            {
                return object;
            }
        }
    },
    area: (param, file) => {
        for(let object of file.features) {
            if(object.properties.gb_nr == param) //gb_nr ist number
            {
                return object;
            }
        }
    },
    allOfArea: (gb_nr, file) => {
        let arr = new Array();
        for(let object of file.features) {
            if(gb_nr == object.properties.gb_nr) {
                arr.push(object);
            }
        }
        return arr;
    }
};