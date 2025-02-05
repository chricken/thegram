'use strict';

import dom from './dom.js';
import viewLogin from './views/maskLogin.js';
import elements from './elements.js';
import ws from './ws.js';
import prefill from './prefill.js';

const init = () => {
    dom.mapping();
    dom.appendEventListeners();
    dom.appendObservers();

    ws.init().then(
        () => ws.appendEventListeners()
    ).then(
        prefill
    ).then(
        viewLogin
    ).catch(
        console.warn
    )
}

init();