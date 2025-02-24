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
                src: `getImg/${userID}/${user.imgAvatar}/isAvatar`,
                listener:{
                    error(evt){
                        console.log('Error');
                        
                        evt.target.src = `getImg/dummy/404.png/isAvatar`;
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