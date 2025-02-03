'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import btnClose from './buttonClose.js';
import postOverview from './postOverview.js';
import lang from '../languages/all.js';
import ws from '../ws.js';
import timeline from '../views/timeline.js';

const userDetails = ({user, changeCallback}) => {

    let currentIndex = 0;

    let ln = lang[settings.lang];

    const bg = dom.create({
        parent: document.body,
        cssClassName: 'detailsBG'
    })

    const container = dom.create({
        parent: bg,
        cssClassName: 'details'
    })

    dom.create({
        parent: container,
        content: user.username,
        type: 'h3'
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


    // Alle Posts
    if (user.posts.length) {
        let posts = user.posts
            .toSorted((a, b) => b.crDate - a.crDate)
            .map(post => post.media)
            .splice(0, settings.numPostsToShow)

        const parent = dom.create({
            parent: container,
            cssClassName: 'allPosts'
        })

        fetch('/getPosts', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(posts)
        }).then(
            res => res.json()
        ).then(
            res => {
                res.forEach((post, index) => {
                    postOverview(parent, user, post)
                })
            }
        )
    }

    let following = settings.user.subbedUsers.map(user => user.userID);

    if (following.includes(user._id)) {
        dom.create({
            parent: container,
            type: 'button',
            content: ln['unfollow'],
            listeners: {
                click() {
                    settings.user.subbedUsers = settings.user.subbedUsers.filter(el => {
                        return (user._id != el.userID);
                    })
                    ws.saveCurrentUser().then(
                        () =>{
                            bg.remove();
                            changeCallback()
                        } 
                    )
                }
            }
        })
    } else {
        dom.create({
            parent: container,
            type: 'button',
            content: ln['follow'],
            listeners: {
                click() {
                    console.log(user);
                    
                    settings.user.subbedUsers.push({
                        subDate:Date.now(),
                        userID: user._id
                    })
                    ws.saveCurrentUser().then(
                        () =>{
                            bg.remove();
                            changeCallback()
                        } 
                    )
                    
                }
            }
        })

    }


    // Close-Button
    btnClose({
        parent: container,
        onClick() {
            bg.remove();
        }
    })
}

export default userDetails;