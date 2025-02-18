'use strict';

class Post {
    constructor({ id }) {
        this.media = id;
        this.crDate = Date.now();
        this.crDateClear = new Date().toLocaleString();
    }

}

export default Post;