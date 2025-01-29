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

        // Pfad existenz checken
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
                        return new Promise((resolve, reject) => {
                            // Der Uploadpath ist mit der UserID identisch, daher redundant
                            let fileName = (Math.random() * 1e17).toString(36) + '.png'
                            let filePath = payload.userID + '/' + fileName
                            
                            // Entferne den Header
                            const base64Data = file.replace(/^data:image\/png;base64,/, "");
                            
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
                database.addMediaToUser(payload.userID, res.id);
            }
        ).then(
            res => {
                return payload;
            }
        )
    }
}

export default media;