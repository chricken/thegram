'use strict';

import dom from '../dom.js';
import ws from '../ws.js';
import elements from '../elements.js';
import postOverview from './postOverview.js';
import settings from '../settings.js';

/*
let posts = [];
let offset = 0;
let numPostsToShow = 3;
*/

const timeline = {
    reset(){
        // settings.user.posts = [];
        settings.firstLoad = true;
        settings.offset = 0;
        timeline.init();
    },
    init() {
        if (settings.user) {
            // settings.posts = settings.user.posts;

            let postsToLoad = settings.user.posts.filter((post, index) => {
                return (
                    index >= settings.offset
                    && index < settings.offset + settings.numPostsToShow
                )
            }).map(
                post => post.media
            )

            ws.getTimeline(postsToLoad);

            settings.offset += settings.numPostsToShow;
            settings.offset = Math.min(settings.offset, settings.user.posts.length);
            console.log('offset', settings.offset);

        }
    },
    render(payload) {
        const parent = elements.content;
        console.log('render');
        

        parent.innerHTML = '';

        dom.create({
            parent,
            content: 'Timeline',
            type: 'h2'
        })

        payload.forEach(post => {
            postOverview(parent, post)
        })

        settings.firstLoad = false;

    },
    append(payload) {
        console.log('append');
        
        const parent = elements.content;

        payload.forEach(post => {
            postOverview(parent, post)
        })
    }
}

export default timeline;
