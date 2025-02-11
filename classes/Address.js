'use strict';

class Address {
    constructor(data={}) {
        this.recipientname = data.recipientname || '';
        this.street = data.street || '';
        this.no = data.no || '';
        this.addition = data.addition || '';
        this.zip = data.zip || '';
        this.city = data.city || '';
        this.country = data.country || '';
        this.description = data.description || '';

    }
}

export default Address;