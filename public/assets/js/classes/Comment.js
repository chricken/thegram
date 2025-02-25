'use strict';

class Comment {
    constructor({
        title='',
        text = '',
        user = {},
        post = null,
        comment = null,     // Falls die eine Antwort auf einen Kommentar ist
    }) {
        this.userID = user._id;
        this.crDate = Date.now();

        if (post) this.postID = post._id;
        if (comment) this.commentID = comment._id;
        
        this.title = title;
        this.text = text;

        this.likes = [];  // Array mit den IDs der likenden Personen, damit niemand mehrfach liken kann
        this.dislikes = [];
        this.comments = []
    }
}

export default Comment;