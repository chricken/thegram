'use strict';

import dom from '../dom.js';
import ws from '../ws.js';

const userBadge = ({
    parent = null,
    userID = ''
}) => {
    const container = dom.create({
        parent,
        cssClassName: 'containerWithUserBadge'
    })
    const containerBadge = dom.create({
        parent: container,
        cssClassName: 'containerUserBadge'
    })
    const containerContent = dom.create({
        parent: container,
        cssClassName: 'containerNextToUserBadge'
    })

    ws.getUser({
        userID
    }).then(
        user => {
            dom.create({
                parent: containerBadge,
                type: 'img',
                cssClassName: 'avatar',
                attr:{
                    src: `getImg/${userID}/${user.imgAvatar}/isAvatar`,
                },
                listeners:{
                    error(evt){
                        evt.target.src = `/assets/img/profile_404.png`;
                    }
                }
            })


            dom.create({
                parent: containerBadge,
                content: user.username,
                type: 'span',
                cssClassName: 'username'
            })

        }
    )

    return containerContent;
}

export default userBadge;