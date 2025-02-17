'use strict';

import dom from '../dom.js';
import ws from '../ws.js';
import elements from '../elements.js';
import postOverview from '../components/postOverview.js';
import settings from '../settings.js';
import languages from '../languages/all.js';
import observers from '../observers.js';

const timeline = {
    // Sammelbehälter für alle anzuzeigenden Posts
    postsToRender: [],

    reset() {
        console.log('Reset Timeline');

        // Setzt alle lokalen Einstellungen zurück
        settings.firstLoad = true;
        timeline.postsToRender = [];
        settings.offset = 0;
        timeline.init();
    },
    init() {
        // Bereitet den Render-Prozess vor, ...
        // ... indem die nächsten Datensätze geladen werden
        if (settings.user) {
            console.log('init');
            ws.getTimeline().then(
                payload => {
                    console.log(payload);

                    timeline.postsToRender.push(...payload);
                    timeline.render();
                }
            )

            // settings.offset += postsToLoad.length;
            settings.offset = Math.min(settings.offset, settings.user.posts.length);
        }
    },
    render() {
        // Stellt die Daten dar
        const parent = elements.content;

        parent.innerHTML = '';

        dom.create({
            parent,
            content: languages[settings.lang]['timeline'],
            type: 'h2'
        })

        timeline.postsToRender
            // Falls doch mal ein leerer Post ankommt ... ignorieren
            .filter(post => post != null)
            .forEach(post => {
                console.log(post);
                postOverview(parent, post)
            })

        const elLoadTrigger = dom.create({
            type: 'loadTrigger',
            parent,
        })
        /* 
        // Der Observer soll nur aktiv sein, wenn noch posts hinzugefügt werden können
        if (settings.user.posts.length > timeline.postsToRender.length) {
            // Verzögert den Observer hinzufügen, damit der beim Einhängen nicht automatisch getriggert wird
            setTimeout(
                () => observers.obsIntersectLoadTrigger.observe(elLoadTrigger),
                100
            )
        }
        */
    }
}

export default timeline;
