'use strict';

import settings from '../settings.js';
import elements from '../elements.js';
import dom from '../dom.js';
import languages from '../languages/all.js';
import logoutBtn from './logoutBtn.js';

const currentUser = () => {
    const user = settings.user;

    let ln = languages[settings.lang];

    const container = dom.create({
        parent: document.body,
        cssClassName: 'currentUser',
    })

    // Benutzername
    dom.create({
        parent: container,
        type: 'h4',
        // content: `${ln.username}: ${user.username}`
        content: `${user.username}`
    })

    // Logintime
    dom.create({
        parent: container,
        content: new Date(settings.loginTime).toLocaleString()
    })

    logoutBtn({
        parent: container
    })

}

export default currentUser;