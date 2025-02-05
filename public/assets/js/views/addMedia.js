'use strict';

import dom from '../dom.js';
import modal from '../components/modal.js';
import button from '../components/button.js';
import ws from '../ws.js';
import helpers from '../helpers.js';
import elements from '../elements.js';
import settings from '../settings.js';
import timeline from './timeline.js';
import randomTexts from '../randomTexts.js';

const addMedia = () => {

    // const parent = modal();
    const parent = elements.content;
    parent.innerHTML = '';

    const payload = {
        title: randomTexts[helpers.createNumber(0, randomTexts.length - 1)].substring(0, 20),
        text: randomTexts[helpers.createNumber(0, randomTexts.length - 1)],
        userID: settings.user._id,
        imgs: []
    }

    // Objekt, das die Daten des Content-Elementes enthält
    const elImagePreview = dom.create({
        cssClassName: 'parentImagePreview',
        // parent: parent.modal,
        parent,
    })

    const elInpTitle = dom.create({
        // parent: parent.modal,
        parent,
        content: payload.title,
        type: 'h3',
        attr: {
            'contenteditable': true
        }
    })

    const elInpText = dom.create({
        // parent: parent.modal,
        parent,
        content: payload.text,
        attr: {
            'contenteditable': true
        }
    })

    const formAddMedia = dom.create({
        type: 'form',
        // parent: parent.modal,
        parent,
        listeners: {
            submit(evt) {
                evt.preventDefault();
                payload.text = elInpText.innerHTML;
                payload.title = elInpTitle.innerHTML;

                // console.log(payload);

                dom.create({
                    parent: elements.messages,
                    cssClassName: 'singleMessage',
                    content: 'Uploading',
                })

                ws.uploadMedia(payload).then(
                    console.log
                ).catch(
                    console.warn
                )

                // parent.bg.remove();

            }
        }
    })

    const elInpImage = dom.create({
        parent: formAddMedia,
        type: 'input',
        attr: {
            type: 'file',
            name: 'upload',
            multiple: true,
        },
        listeners: {
            change() {
                let files = [...elInpImage.files];

                files.forEach(file => {
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = evt => {
                            // Bild an Daten anhängen
                            payload.imgs.push({
                                mime: file.type,
                                data: evt.target.result
                            });

                            // Bild in FE anzeigen
                            const imagePreview = dom.create({
                                type: 'img',
                                parent: elImagePreview,
                                cssClassName: 'imagePreview',
                                attr: {
                                    src: evt.target.result,
                                },
                            })
                        }
                        reader.readAsDataURL(file); // Bild als Data URL lesen
                    }
                })
            }
        }
    })

    const btnSaveContent = button({
        parent: formAddMedia,
        legend: 'Save',

    })
}

export default addMedia;