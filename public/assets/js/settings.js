'use strict';

const settings = {
    user: null,
    wsAddress: 'ws://localhost:8080',
    socketID: null,
    appName: 'artSphere',
    nameItemAuthToken: 'authToken',
    firstLoad: true,
    posts: [],
    offset: 0,
    numPostsToShow: 6,
    viewMode: null,
    lang: 'de',
    postTypes: {
        '0': 'artwork',
        '1': 'forward',
        '2': 'news'
    },
    avatarSize: 300,
}

export default settings;