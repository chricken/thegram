'use strict';

import express from 'express';
import routes from './routes.js';
import database from './database.js';
const server = express();

server.use(express.static('public', {
    extensions: ['html']
}));

server.use(express.json());

server.use(routes);

const init = () => {
    database.init().then(
        // Webserver starten
        () => server.listen(80, err => {
            if (err) console.log(err)
            else console.log('Server läuft')
        })
    ).catch(
        console.warn
    )
}

init();