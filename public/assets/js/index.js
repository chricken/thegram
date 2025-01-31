'use strict';

import dom from './dom.js';
import viewLogin from './views/login.js';
import elements from './elements.js';

const init = () => {
    dom.mapping();
    dom.appendEventListeners();
    dom.appendObservers();
    
    viewLogin({
        parent: elements.main
    })
}

init();