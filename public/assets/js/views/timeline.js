'use strict';

import dom from '../dom.js';
import ws from '../ws.js';
import elements from '../elements.js';
import postOverview from '../components/postOverview.js';
import settings from '../settings.js';
import languages from '../languages/all.js';

/*
let posts = [];
let offset = 0;
let numPostsToShow = 3;
*/

const timeline = {
    reset() {
        // Setzt alle lokalen Einstellungen zurück
        // settings.user.posts = [];
        settings.firstLoad = true;
        settings.offset = 0;
        timeline.init();
    },
    init() {
        // Bereitet den Render-Prozess vor
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
        }
    },
    render(payload) {
        // Stellt die Daten dar
        const parent = elements.content;

        parent.innerHTML = '';

        dom.create({
            parent,
            content: languages[settings.lang]['timeline'],
            type: 'h2'
        })

        payload.forEach(post => {
            postOverview(parent, settings.user, post)
        })

        settings.firstLoad = false;

    },
    append(payload) {
        const parent = elements.content;

        payload.forEach(post => {
            postOverview(parent, settings.user, post)
        })
    }
}

export default timeline;
