'use strict';

class SocialMedia {
    constructor(data={}) {
        this.instagram = data.instagram || '';
        this.xing = data.xing || '';
        this.linkedin = data.linkedin || '';
        this.facebook = data.facebook || '';
        this.bluesky = data.bluesky || '';
        this.cara = data.cara || '';
        this.pinterest = data.pinterest || '';
        this.behance = data.behance || '';
        this.dribble = data.dribble || '';
        this.deviantart = data.deviantart || '';
        this.artstation = data.artstation || '';
        this.other = data.other || [];
    }
}

export default SocialMedia;