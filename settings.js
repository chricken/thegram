'use strict';

import credentials from './credentials.js';

const settings = {
    credentials,
    dbNames: {
        users: 'tg_users',
        posts: 'tg_posts',
        tags: 'tg_tags',    // Tags, nach denen gesucht werden kann
        wallet:'tg_wallet', // hier gibt es eine Verknüpfung zwischen dem Benutzer und den Coins in seiner Wallet
        coins:'tg_coins',   // Alle coins werden hier abgelegt
    },
    uploadPath: './data/img/',
    uploadPathAvatars: './data/avatars/',
    wsSockets: {},
    viewMode:null
}

export default settings;