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
        comments: 'tg_comments',   // Kommentare, die über die ID mit dem Post verbunden sind
    },
    uploadPath: './data/img/',
    uploadPathAvatars: './data/avatars/',
    wsSockets: {},
    numNewUsersToShow: 15,
    tokenValidity: 14 * 24 * 60 * 60 * 1000, // 14 Tage in ms
    viewMode: null,
    contentTypes: {
        '0': 'artwork',
        '10': 'news',
        '20': 'servicepost',
        '30': 'photos',
        '40': 'forwarding'
    },
    userTypes: {
        '0': 'visitor',
        '10': 'user',
        '20': 'artist',
        '30': 'admin',
    },

    // Objekt, in dem für jeden Benutzer-Datensatz ein Objekt hinterlegt wird.
    // Key ist die User-ID
    // Alle Interaktion findet über dieses Objekt statt. Damit werden Seiteneffekte vermieden
    agents: {},
    agentsPost: {},
}

export default settings;
export let agents = settings.agents;
export let agentsPost = settings.agentsPost;