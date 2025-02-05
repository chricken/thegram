'use strict';

import dom from './dom.js';
import viewLogin from './views/maskLogin.js';
import observers from './observers.js';
import ws from './ws.js';
import prefill from './prefill.js';

const init = () => {
    dom.mapping();
    dom.appendEventListeners();
    observers.init();

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