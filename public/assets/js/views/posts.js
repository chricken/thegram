'use strict';

import dom from '../dom.js';
import ws from '../ws.js';
import elements from '../elements.js';
import postOverview from '../components/postOverview.js';
import settings from '../settings.js';
import languages from '../languages/all.js';
import observers from '../observers.js';

const posts = {
    // Sammelbehälter für alle anzuzeigenden Posts
    postsToRender: [],

    reset() {
        // Setzt alle lokalen Einstellungen zurück
        settings.firstLoad = true;
        posts.postsToRender = [];
        settings.offset = 0;
        posts.init();
    },
    init() {
        // Bereitet den Render-Prozess vor, ...
        // ... indem die nächsten Datensätze geladen werden
        if (settings.user) {
            let postsToLoad = settings.user.posts.filter((post, index) => {
                return (
                    index >= settings.offset
                    && index < settings.offset + settings.numPostsToShow
                )
            }).map(
                post => post.media
            )

            ws.getPosts(postsToLoad).then(
                payload => {
                    // console.log('posts to render', payload);

                    posts.postsToRender.push(...payload);
                    posts.render();
                }
            )

            settings.offset += postsToLoad.length;
            settings.offset = Math.min(settings.offset, settings.user.posts.length);
        }
    },
    render() {
        // Stellt die Daten dar
        const parent = elements.content;

        parent.innerHTML = '';

        dom.create({
            parent,
            content: languages[settings.lang]['posts'],
            type: 'h2'
        })

        posts.postsToRender
            // Falls doch mal ein leerer Post ankommt ... ignorieren
            .filter(p => p != null)
            .forEach(post => {
                // console.log(post);
                postOverview(parent, post)
            })

        const elLoadTrigger = dom.create({
            type: 'loadTrigger',
            parent,
        })

        // Der Observer soll nur aktiv sein, wenn noch posts hinzugefügt werden können
        if (settings.user.posts.length > posts.postsToRender.length) {
            // Verzögert den Observer hinzufügen, damit der beim Einhängen nicht automatisch getriggert wird
            setTimeout(
                () => observers.obsIntersectLoadTrigger.observe(elLoadTrigger),
                100
            )
        }
    }
}

export default posts;
