'use strict';

import addMedia from '../views/addMedia.js';
import btn from './button.js';
import dom from '../dom.js';
import lang from '../languages/all.js';
import settings from '../settings.js';
import loginout from '../loginout.js';
import userSettings from '../views/userSettings.js';

const btnUserSettings = ({
    parent = null
}) => {

    let ln = lang[settings.lang];

    dom.create({
        type: 'span',
        cssClassName: 'navLink userSettings',
        parent,
        content: '👤' + ln.settings,
        listeners: {
            click(){
                userSettings.reset();
            }
        }
    })

}

export default btnUserSettings;