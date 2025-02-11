'use strict';

import Address from './Address.js';
import Contact from './Contact.js';
import SocialMedia from './SocialMedia.js';
import Shops from './Shops.js';

class User {
    constructor({
        _id = null,
        _rev = null,
        username = '',
        password = '',
        language = 'en',
        type = 0,
        imgAvatar = '',
        crDate = Date.now(),
        chDate = Date.now(),
        subbedUsers = [],
        posts = [],
        preName = '',
        surName = '',
        description = '',
        address = new Address(),
        contact = new Contact(),
        socialMedia = new SocialMedia(),
        shops = new Shops(),

    }) {
        // _id und _rev werden nur eingehängt, wenn die Daten aus der Datenbank kommen
        if (_id)
            this._id = _id;

        if (_rev)
            this._rev = _rev;

        Object.assign(this, {
            username, password, language, type, imgAvatar, crDate, chDate,
            subbedUsers, posts, preName, surName, description,
            address, contact, socialMedia, shops
        })
    }
    addFollow(idToFollow) {
        let subbed = new Set(this.subbedUsers);
        subbed.add(idToFollow);
        this.subbedUsers = [...subbed];
    }
    removeFollow(idToRemove) {
        this.subbedUsers = this.subbedUsers.filter(u => u != idToRemove);
    }
    get score() {
        // Je Tag und upload 1 Punkt. Je like 2 pkte, je Kommentar 10 pkte, je pledge...
    }
}

export default User;