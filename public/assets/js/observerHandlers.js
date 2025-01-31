'use strict';

import timeline from './views/timeline.js';
import settings from './settings.js';

const observerHandlers = {
    intersectLoadTrigger(entries) {
        console.log(entries);
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (settings.viewMode)
                    settings.viewMode.init()
            }
        })
    }
}

export default observerHandlers;