'use strict';

import dom from './dom.js';
import viewLogin from './views/maskLogin.js';
import elements from './elements.js';
import ws from './ws.js';
import settings from './settings.js';
import lang from './languages/all.js';

const prefill = () => {

    let ln = lang[settings.lang];
    /* 
    // Oberheader
    dom.create({
        parent: elements.main,
        content: ln.siteName,
        type:'h1'
    })

    // Subheader
    dom.create({
        parent: elements.main,
        content: ln.siteSubName,
        type:'h5'
    })
    */
}

export default prefill;