'use strict';

import { resourceUsage } from 'process';
import database from './database.js';
import fs from 'fs';
const fsp = fs.promises;

const media = {
    handleUploadedImage(uploadPath, userID, file, index = 0) {
        let path = uploadPath + userID + '/';
        return fsp.access(path).then(
            res => {
                // console.log(res);
                return res
            }
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
    async handleUploaded(uploadPath, payload) {
        const results = [];

        for (const index in payload.imgs) {
            let file = payload.imgs[index]
            const result = await media.handleUploadedImage(
                uploadPath,
                payload.userID,
                file,
                index
            )
            results.push(result);
        }
        payload.imgNames = [...payload.imgNames, ...results];
        return payload;

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
        }))
    },

}

export default media;