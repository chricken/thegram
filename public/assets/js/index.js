'use strict';

import dom from './dom.js';
import observers from './observers.js';
import ws from './ws.js';
import prefill from './prefill.js';
import loginout from './loginout.js';

const init = () => {
    dom.mapping();

    ws.init().then(
        () => ws.appendEventListeners()
    ).then(
        () => observers.init()
    ).then(
        loginout.autoLogin
    ).then(
        prefill
    // ).then(
    //  viewLogin
    ).catch(
        console.warn
    )
}

init();