'use strict';

import database from './database.js';
import fs from 'fs';
const fsp = fs.promises;

const media = {
    handleUploadedImage(uploadPath, userID, file, index = 0) {
        let path = uploadPath + userID + '/';
        return fsp.access(path).then(
            () => { }
        ).catch(
            () => fsp.mkdir(path)
        ).then(
            () => {
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
                    // Der Dateipfad enthält die User ID und einen Timestamp. Damit sind Dupletten praktisch ausgeschlossen
                    let fileName = (Math.random() * 1e17).toString(36) + '_' + Date.now() + '_' + index + fileSuffix
                    let filePath = userID + '/' + fileName

                    // Schreibe Dateien
                    fs.writeFile(
                        uploadPath + filePath,
                        base64Data,
                        'base64',
                        (err) => {
                            if (err) {
                                console.error('Fehler beim Speichern des Bildes:', err);
                                reject()
                            } else {
                                resolve(fileName)
                            }
                        }
                    );
                })
            }
        )
    },
    handleUploaded(uploadPath, payload) {
        return Promise.all(
            // Array mit Promises 
            payload.imgs.map((file, index) => {
                return media.handleUploadedImage(
                    uploadPath,
                    payload.userID,
                    file,
                    index
                )
            })
        ).then(
            (res) => {
                // Datensatz um den Pfad erweitern
                payload.imgNames = res;
            }
        ).then(
            () => {
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
                    user: res
                }
            }
        )
    },
    removeFiles(uploadPath, post) {
        return Promise.all(post.imgNames.map(imgName => {
            return new Promise((resolve, reject) => {
                let filePath = post.userID + '/' + imgName
                fs.unlink(
                    uploadPath + '/' + filePath,
                    err => {
                        if (err) resolve(err)
                        else resolve(`${filePath} removed successfully`)
                    }
                )
            })
        })).then(
            res => {
                // Wenn die Datei nicht gelöscht werden konnte, ist sie vermutlich einfach nicht da. 
                // Der Lösch-Prozess soll dann weiter laufen
                // console.log(res);
                return res;
            }
        )
    },

}

export default media;