'use strict';

import dom from '../dom.js';

const postOverview = (parent, post) => {
    const container = dom.create({
        cssClassName:'postOverview',
        parent,        
    })

    if(post.title){
        dom.create({
            type:'h3',
            content: post.title,
            parent: container
        })
    }

    if(post.text){
        dom.create({
            parent: container,
            content: post.text
        })
    }
}

export default postOverview