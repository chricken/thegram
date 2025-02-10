'use strict';

import Address from './Address.js';
import Contact from './Contact.js';
import SocialMedia from './SocialMedia.js';
import Shops from './Shops.js';

class User {
    constructor(payload) {
        // _id und _rev werden nur eingehängt, wenn die Daten aus der Datenbank kommen
        if (payload._id)
            this._id = payload._id;

        if (payload._rev)
            this._rev = payload._rev;

        this.username = payload.username || '';
        this.password = payload.password || '';

        this.language = payload.language || 'en';

        this.imgAvatar = payload.imgAvatar || '';

        this.crDate = payload.crDate || Date.now();
        this.chDate = payload.chDate || Date.now();
        this.subbedUsers = payload.subbedUsers || [];
        this.posts = payload.posts || [];

        this.preName = payload.preName || '';
        this.surName = payload.surName || '';
        this.description = payload.description || '';

        this.address = new Address(payload.address || {})
        this.contact = new Contact(payload.contact || {})
        this.socialMedia = new SocialMedia(payload.socialMedia || {})
        this.shops = new Shops(payload.shops || {})
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