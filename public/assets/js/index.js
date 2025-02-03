'use strict';

import dom from './dom.js';
import viewLogin from './views/login.js';
import elements from './elements.js';
import ws from './ws.js';

const init = () => {
    dom.mapping();
    dom.appendEventListeners();
    dom.appendObservers();

    ws.init().then(
        () => ws.appendEventListeners()
    ).then(
        () => viewLogin({
            parent: elements.main
        })
    ).then(
        credentials => {
            console.log(credentials);
            
            ws.login(credentials);
        }
    ).catch(
        console.warn        
    )
}

init();