'use strict';

// Diese Klasse beschreibt keinen eigentlichen post,
// sondern nur den Eintrag im User-Datensatz, der den Post referenziert

class Post {
    constructor({ id }) {
        this.media = id;
        this.crDate = Date.now();
        this.crDateClear = new Date().toLocaleString();
    }

}

export default Post;