'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import userDetails from './userDetails.js';
import lang from '../languages/all.js';
import findUsers from '../views/findUsers.js';

const userOverview = (parent, user) => {

    let ln = lang[settings.lang];

    const container = dom.create({
        cssClassName: 'overview transit userOverview',
        parent,
        listeners: {
            click() {
                userDetails({
                    user,
                    changeCallback() {
                        findUsers.reset()
                    }
                })
            }
        }
    })

    dom.create({
        type: 'h3',
        content: user.username,
        parent: container
    })

    dom.create({
        parent: container,
        content: ln['created'] + ': ' + new Date(user.crDate).toLocaleString()
    })

    dom.create({
        parent: container,
        content: ln['lastChange'] + ': ' + new Date(user.chDate).toLocaleString()
    })

    dom.create({
        parent: container,
        content: ln['numPosts'] + ': ' + user.posts.length
    })


}

export default userOverview