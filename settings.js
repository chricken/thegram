'use strict';

import credentials from './credentials.js';

const settings = {
    credentials,
    dbNames: {
        users: 'tg_users',
        posts: 'tg_posts',
        tags: 'tg_tags',    // Tags, nach denen gesucht werden kann
        wallet: 'tg_wallet', // hier gibt es eine Verknüpfung zwischen dem Benutzer und den Coins in seiner Wallet
        coins: 'tg_coins',   // Alle coins werden hier abgelegt
        authtokens: 'tg_tokens',   // Token zur Authentifizierung 
    },
    uploadPath: './data/img/',
    uploadPathAvatars: './data/avatars/',
    wsSockets: {},
    tokenValidity: 14 * 24 * 60 * 60 * 1000, // 14 Tage in ms
    viewMode: null,
}

export default settings;