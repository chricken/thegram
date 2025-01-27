'use strict';

import credentials from './credentials.js';

const settings = {
    credentials,
    neededDBs: ['tg_users', 'tg_posts', 'tg_tags'],
    dbNames: {
        users: 'tg_users',
        posts: 'tg_posts',
        tags: 'tg_tags',
    },
    uploadPath: './data/img/',
}

export default settings;