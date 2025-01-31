'use strict';

import dom from '../dom.js';
import elements from '../elements.js';

const findUsers = {
    init(){
        findUsers.render();
    },
    render(){
        const parent = elements.content;

        parent.innerHTML = '';

        parent.innerHTML = 'Find Users'
    }
}

export default findUsers;