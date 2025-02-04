'use strict';

import dom from '../dom.js';
import elements from '../elements.js';
import settings from '../settings.js';
import viewTimeline from '../views/timeline.js';
import viewFindUsers from '../views/findUsers.js';
import lang from '../languages/all.js';

// Views

const nav = () => {
    const parent = elements.nav;

    let ln = lang[settings.lang];

    const linkTimeline = dom.create({
        cssClassName:'link',
        parent,
        content: ln.timeline,
        listeners:{
            click(){
                settings.viewMode = viewTimeline;
                settings.viewMode.reset()
            }
        }
    })

    const linkFindUsers = dom.create({
        cssClassName:'link',
        parent,
        content: ln.users,
        listeners:{
            click(){
                settings.viewMode = viewFindUsers;
                settings.viewMode.reset()
            }
        }
    })
}

export default nav;