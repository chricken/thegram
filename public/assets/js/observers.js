'use strict';

import settings from './settings.js';

const observers = {
    handleIntersectLoadTrigger(entries) {
        // console.log(entries);
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (settings.viewMode)
                    settings.viewMode.init()
            }
        })
    },
    obsIntersectLoadTrigger: null,
    init() {
        observers.obsIntersectLoadTrigger = new IntersectionObserver(
            observers.handleIntersectLoadTrigger
        )
    }
}

export default observers;