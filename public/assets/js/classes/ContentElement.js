'use strict';

class ContentElement {
    constructor(userID) {
        this.text = '';
        this.images = [];
        this.userID = userID;
        this.tags = [];
        this.likes = [];// Array mit den IDs der likenden Personen, damit niemand mehrfach liken kann
        this.dislikes = [];
        this.comments = []; // Kommentare in einer eigenen Datenbank ablegen
    }
}

export default ContentElement;