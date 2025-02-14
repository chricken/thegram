'use strict';

import express from 'express';
import routes from './routes.js';
import database from './database.js';
import websocket from './websocket.js';
import Agent from './classes/Agent.js';
import settings, {agents} from './settings.js';

const server = express();

server.use(express.static('public', {
    extensions: ['html']
}));

server.use(express.json());

server.use(routes);

const init = () => {
    database.init().then(
        // Agents aktivieren
        // Bei vielen Usern sind das viele Agents. Aber das scheint mir der beste Weg zu sein
        database.getAllUsers
    ).then(
        userIDs => Promise.all(
             userIDs.map(id => {
                const agent = new Agent({id});
                agents[id] = agent;
                // console.log('Active agents', Object.keys(agents));
                return agent.init();
            })
        )
    ).then(
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