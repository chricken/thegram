'use strict';

import ajax from '../ajax.js';
import dom from '../dom.js';

const timeline = ({
    parent = null
}) => {
    
    dom.create({
        parent,
        content: 'Timeline',
        type:'h2'
    })

}

export default timeline;