'use strict';

class ContentElement {
    constructor(userID){
        this.text = '';
        this.images=[];
        this.userID = userID;
        this.tags = [];
    }
}

export default ContentElement;