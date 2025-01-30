'use strict';

import express from 'express';
const router = express.Router();
import database from './database.js';
import formidable from 'formidable';
import settings from './settings.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const fsp = fs.promises;

router.post('/login', (request, response) => {
    let { userName, password } = request.body;

    // console.log(userName, password);

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
router.get('/getImg/:userID/:filename', (request, response) => {
    console.log('userID', request.params.userID);
    console.log('filename', request.params.filename);
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    let filepath = path.join(__dirname, `data/img/${request.params.userID}/${request.params.filename}`);
    // `data/img/${request.params.userID}/${request.params.filename}`;

    response.sendFile(filepath)

})
router.post('/uploadMedia', (request, response) => {
    const myForm = formidable({
        uploadDir: settings.uploadPath,
        keepExtensions: true
    })

    myForm.parse(request, (err, fields, files) => {
        if (err) {
            console.warn(err);
            response.json({
                status: 'err',
                err: 'An error while upload happened.'
            })
        } else {
            let path = settings.uploadPath + fields.userID + '/';
            // console.log(path);

            let data = {};

            Object.entries(fields).forEach(([key, value]) => {
                data[key] = value[0];
            })

            // Pfad existenz checken
            fsp.access(path).then(
                res => {
                    // console.log('existiert');
                }
            ).catch(
                () => {
                    // console.log('existiert nicht')
                    return fsp.mkdir(path);
                }
            ).then(
                res => {
                    let file = files.upload[0];

                    // Datei verschieben                
                    return fsp.rename(
                        settings.uploadPath + file.newFilename,
                        path + file.newFilename,
                    )
                }
            ).then(
                () => {
                    // Datensatz um den Pfad erweitern
                    let file = files.upload[0];
                    data.imgURL = path + file.newFilename;
                }
            ).then(
                () => {
                    // Zur Datenbank hinzufügen
                    return database.addMedia(data)
                }
            ).then(
                res => {
                    database.addMediaToUser(res, data);
                }
            ).then(
                () => response.json({
                    status: 'success'
                })
            ).catch(
                () => response.json({
                    status: 'err'
                })
            )
        }
    })
})

export default router;