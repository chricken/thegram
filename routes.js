'use strict';

import express from 'express';
const router = express.Router();
import database from './database.js';

router.post('/login', (request, response) => {
    let { userName, password } = request.body;

    console.log(userName, password);

    database.checkLogin({
        userName, password
    }).then(
        res => {
            response.json(res)
        }
    ).catch(
        err => response.json({
            status: 'err',
            err
        })
    )
})

export default router;