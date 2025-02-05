'use strict';

import database from './database.js';
import settings from './settings.js';
import websocket from './websocket.js';
import fs from 'fs';
const fsp = fs.promises;

const media = {
    handleUploaded(payload) {
        // console.log(payload);
        let path = settings.uploadPath + payload.userID + '/';
        payload.timestamp = Date.now();
        // Pfad Existenz checken
        return fsp.access(path).then(
            () => { }
        ).catch(
            () => fsp.mkdir(path)
        ).then(
            () => {
                // Datensatz um den Pfad erweitern
                payload.imgNames = [];
                // Alle Schreibversuche zu einem Promise zusammenfassen
                return Promise.all(
                    // Array mit Promises 
                    payload.imgs.map(file => {
                        // console.log(file);

                        return new Promise((resolve, reject) => {

                            // Entferne den Header
                            let base64Data, fileSuffix;
                            if (file.mime == 'image/jpeg') {
                                base64Data = file.data.replace(/^data:image\/jpeg;base64,/, '');
                                fileSuffix = '.jpg';
                            } else if (file.mime == 'image/png') {
                                base64Data = file.data.replace(/^data:image\/png;base64,/, "");
                                fileSuffix = '.png';
                            } else if (file.mime == 'image/webp') {
                                base64Data = file.data.replace(/^data:image\/webp;base64,/, "");
                                fileSuffix = '.webp';
                            }

                            // Der Uploadpath ist mit der UserID identisch, daher redundant
                            let fileName = (Math.random() * 1e17).toString(36) + fileSuffix
                            let filePath = payload.userID + '/' + fileName

                            // Schreibe Dateien
                            fs.writeFile(
                                settings.uploadPath + filePath,
                                base64Data,
                                'base64',
                                (err) => {
                                    if (err) {
                                        console.error('Fehler beim Speichern des Bildes:', err);
                                        reject()
                                    } else {
                                        payload.imgNames.push(fileName);
                                        resolve()
                                    }
                                }
                            );
                        })
                    })
                )
            }
        ).then(
            (res) => {
                // Bilder entfernen
                delete payload.imgs;
                // Zur Datenbank hinzufügen
                return database.addMedia(payload)
            }
        ).then(
            res => {
                payload.mediaID = res.id;
                return database.addMediaToUser(payload.userID, res.id);
            }
        ).then(
            res => {
                return {
                    media: payload,
                    posts: res
                }
            }
        )
    }
}

export default media;