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
    numPostsToShow: 3,
    viewMode: null,
    lang: 'de',
    postTypes: ['artwork', 'comment', 'news'],
    avatarSize: 300,
}

export default settings;