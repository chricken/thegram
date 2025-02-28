'use strict';
// Dies ist der Kommentar, wie er im Frontend verwendet wird
import settings from "../settings.js";

class Comment {
    constructor({
        title='',
        text = '',
        post = null,
        comment = null,     // Falls die eine Antwort auf einen Kommentar ist
    }) {
        this.userID = settings.user._id;
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