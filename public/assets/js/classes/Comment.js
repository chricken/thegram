'use strict';

class Comment {
    constructor(user) {
        this.uderID = user._id;
        this.crDate = Date.now();
        this.text = '';
        this.likes = [];  // Array mit den IDs der likenden Personen, damit niemand mehrfach liken kann
        this.dislikes = [];
    }
}

export default Comment;