'use strict';

import timeline from './views/timeline.js';

const observerHandlers = {
    intersectLoadTrigger(entries) {
        console.log(entries);
        entries.forEach(entry => {
            if (entry.isIntersecting){
                timeline.init()
            }
        })
    }
}

export default observerHandlers;