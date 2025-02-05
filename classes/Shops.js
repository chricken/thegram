'use strict';

class Shop {
    constructor(data) {
        this.name = data.name || '';
        this.website = data.website || '';
        this.profileName = data.profileName || '';
        this.profileURL = data.profileURL || '';
    }
}

class Shops {
    constructor(data) {
        for (let i = 1; i <= 10; i++) {
            this['shop' + i] = new Shop(data['shop' + i] || []);
        }
    }
}

export default Shops;