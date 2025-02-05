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
    }
}

export default helpers;