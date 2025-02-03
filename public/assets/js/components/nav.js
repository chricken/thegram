'use strict';

import dom from '../dom.js';
import elements from '../elements.js';
import settings from '../settings.js';
import viewTimeline from '../views/timeline.js';
import viewFindUsers from '../views/findUsers.js';

// Views

const nav = () => {
    const parent = elements.nav;

    const linkTimeline = dom.create({
        cssClassName:'link',
        parent,
        content: 'Timeline',
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
        content: 'Users',
        listeners:{
            click(){
                settings.viewMode = viewFindUsers;
                settings.viewMode.reset()
            }
        }
    })
}

export default nav;