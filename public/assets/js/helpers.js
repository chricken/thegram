'use strict';

const helpers = {
    createNumber(min, max) {
        return ~~(Math.random() * (max - min + 1) + min);
    },
    createString(numChars=10){
        const sourceVow = 'aeiou';
        const sourceCon = 'bbbcdddfghjklmmnnpqrssstvwxyz';
        let str = '';

        while(str.length < numChars){
            str += sourceCon[~~(Math.random()*sourceCon.length)];
            str += sourceVow[~~(Math.random()*sourceVow.length)];
        }

        return str;
    },
    getDataFromImgInput(target){
        return new Promise((resolve, reject) => {

            const file = target.files[0];
            const reader = new FileReader();
            reader.onload = evt => {
                // Bild an Daten anhängen
                const data = {
                    mime: file.type,
                    data: evt.target.result
                };
                resolve(data);
            }
            reader.readAsDataURL(file); // Bild als Data URL lesen
        })
    }
}

export default helpers;