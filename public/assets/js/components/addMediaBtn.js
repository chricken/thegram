'use strict';

import addMedia from '../views/addMedia.js';
import btn from './button.js';
import dom from '../dom.js';
import lang from '../languages/all.js';
import settings from '../settings.js';


const addMediaBtn = ({
    parent = null
}) => {

    let ln = lang[settings.lang];

    dom.create({
        type: 'span',
        cssClassName: 'navLink addMedia',
        parent,
        content: '➕' + ln.addMedia,
        listeners: {
            click() {
                addMedia()

            },
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