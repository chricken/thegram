'use strict';

const helpers = {
    createNumber(min, max) {
        return ~~(Math.random() * (max - min + 1) + min);
    },
    createID(obj) {
        // Geht davon aus, dass die IDs als Keys eines Objekte verwendet werden
        const create = () => {
            let id = (Math.random() * 1e17).toString(36);
            id += '_';
            id += Date.now();
            return id;
        }

        let id = create();

        // Checken, ob eine Datensammlung übergeben wurde
        if (obj) {
            // Checken, ob es die ID schon gibt
            obj = Object.keys(obj);
            while (obj.includes(id)) {
                id = create();
            }
        }

        return id;
    }
}

export default helpers;