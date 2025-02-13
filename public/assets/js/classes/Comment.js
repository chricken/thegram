'use strict';

class Comment {
    constructor({
        text = '',
        user = {},
        post = {}
    }) {
        this.userID = user._id;
        this.crDate = Date.now();
        this.postID = post._id;
        this.text = text;
        this.likes = [];  // Array mit den IDs der likenden Personen, damit niemand mehrfach liken kann
        this.dislikes = [];
    }
}

export default Comment;