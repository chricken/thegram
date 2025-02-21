'use strict';

import dom from '../dom.js';
import lang from '../languages/all.js';
import settings from '../settings.js';
import loginout from '../loginout.js';

const addMediaBtn = ({
    parent = null
}) => {

    let ln = lang[settings.lang];

    dom.create({
        type: 'span',
        cssClassName: 'navLink logout',
        parent,
        content: '👤' + ln.logout,
        listeners: {
            click(){
                loginout.logout();
            }
        }
    })

    /* 
    btn({
        legend: 'Add Media',
        parent,
        onClick: addMedia
    })
    */


}

export default addMediaBtn;