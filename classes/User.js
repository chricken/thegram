'use strict';

class User {
    constructor(payload) {
        // _id und _rev werden nur eingehängt, wenn die Daten aus der Datenbank kommen
        if(payload._id) 
            this._id = payload._id;
        
        if(payload._rev) 
            this._rev = payload._rev;

        this.username = payload.username;
        this.password = payload.password;
        this.email = payload.email;
        this.crDate = payload.crDate || Date.now();
        this.chDate = payload.chDate || Date.now();
        this.subbedUsers = payload.subbedUsers || [];
        this.posts = payload.posts || [];

        this.preName = payload.preName || '';
        this.surName = payload.surName || '';

        this.address = payload.address || {};
        this.contact = payload.contact || {};
    }
    addFollow(idToFollow) {
        let subbed = new Set(this.subbedUsers);
        subbed.add ( idToFollow);
        this.subbedUsers = [...subbed];
    }
    removeFollow(idToRemove) {
        this.subbedUsers = this.subbedUsers.filter(u => u != idToRemove);
    }
}

export default User;