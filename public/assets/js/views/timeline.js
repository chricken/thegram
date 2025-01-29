'use strict';

import dom from '../dom.js';
import ws from '../ws.js';
import elements from '../elements.js';
import postOverview from './postOverview.js';

const timeline = {
    init() {
        ws.getTimeline();
    },
    render(payload) {
        const parent = elements.timeline;

        parent.innerHTML = '';

        dom.create({
            parent,
            content: 'Timeline',
            type: 'h2'
        })
        
        payload.forEach(post => {
            postOverview(parent, post)
        })
        
    }
}

export default timeline;
