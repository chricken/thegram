'use strict';

import dom from '../dom.js';
import elements from '../elements.js';
import settings from '../settings.js';

// Views

const nav = () => {
    const parent = elements.nav;

    const linkTimeline = dom.create({
        cssClassName:'link',
        parent,
        content: 'Timeline',
        listeners:{
            click(){
                settings.viewMode.init()
            }
        }
    })

    const linkFindUsers = dom.create({
        cssClassName:'link',
        parent,
        content: 'Users',
        listeners:{
            click(){
                settings.viewMode.init()
            }
        }
    })
}

export default nav;