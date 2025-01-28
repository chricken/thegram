'use strict';

import dom from './dom.js';
import viewLogin from './views/login.js';
import elements from './elements.js';
import ws from './ws.js';

const init = () => {
    dom.mapping();
    
    viewLogin({
        parent: elements.main
    })
}

init();