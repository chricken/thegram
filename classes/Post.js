'use strict';

// Diese Klasse beschreibt keinen eigentlichen post,
// sondern nur den Eintrag im User-Datensatz, der den Post referenziert

class Post {
    constructor({ id }) {
        this.media = id;
        this.crDate = Date.now();
        this.chDate = Date.now();
        
        // Eigentlich nur für debugging
        this.crDateClear = new Date().toLocaleString();
        this.chDateClear = new Date().toLocaleString();
    }

}

export default Post;