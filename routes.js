'use strict';

import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

router.get('/getImg/:userID/:filename/:flag?', (request, response) => {

    // Diese Route wird benötigt, weil Bilder und Hintergrundbilder als Pfad im HTML-Code hinterlegt werden
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    let filepath;
    // console.log(request.params);
    
    if (request.params.flag == 'isAvatar') {
        filepath = `data/avatars/${request.params.userID}/${request.params.filename}`
    } else {
        filepath = `data/img/${request.params.userID}/${request.params.filename}`;
    }

    filepath = path.join(__dirname, filepath);
    console.log('filepath: ', filepath);

    response.sendFile(filepath)
})

export default router;