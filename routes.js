'use strict';

import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

router.get('/getImg/:userID/:filename', (request, response) => {
    // Diese Route wird benötigt, weil Bilder und Hintergrundbilder als Pfad im HTML-Code hinterlegt werden
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    let filepath = path.join(__dirname, `data/img/${request.params.userID}/${request.params.filename}`);

    response.sendFile(filepath)
})

export default router;