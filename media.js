'use strict';

import database from './database.js';
import settings from './settings.js';
import fs from 'fs';
const fsp = fs.promises;

const media = {
    handleUploaded(payload) {
        console.log(payload);
        let path = settings.uploadPath + payload.userID + '/';

        // Pfad existenz checken
        fsp.access(path).then(
            () => { }
        ).catch(
            () => fsp.mkdir(path)
        ).then(
            () => {

            }
        ).then(
            () => {
                // Datensatz um den Pfad erweitern
                payload.imgURLs = [];
                // Alle Schreibversuche zu einem Promise zusammenfassen
                return Promise.all(
                    payload.imgs.map(file => {
                        return new Promise((resolve, reject) => {
                            let filePath = payload.userID + '/' + (Math.random() * 1e17).toString(36) + '.png'
                            // Entferne den Header
                            const base64Data = file.replace(/^data:image\/png;base64,/, "");
                            fs.writeFile(
                                settings.uploadPath + filePath,
                                base64Data,
                                'base64',
                                (err) => {
                                    if (err) {
                                        console.error('Fehler beim Speichern des Bildes:', err);
                                        reject()
                                    } else {
                                        payload.imgURLs.push(filePath);
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
                console.log(payload);
                
                // Zur Datenbank hinzufügen
                return database.addMedia(payload)
            }
        ).then(
            res => {
                database.addMediaToUser(payload);
            }
        ).then(
            () => {
            }
        ).catch(
            () => {
            }
        )
    }
}

export default media;