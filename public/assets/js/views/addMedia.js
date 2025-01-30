'use strict';

import dom from '../dom.js';
import modal from '../components/modal.js';
import button from '../components/button.js';
import ws from '../ws.js';
import elements from '../elements.js';
import settings from '../settings.js';
import timeline from './timeline.js';

const addMedia = () => {

    const parent = modal();
    const payload = {
        text: '',
        userID: settings.user._id,
        imgs: []
    }


    // Objekt, das die Daten des Content-Elementes enthält

    const elImagePreview = dom.create({
        cssClassName: 'parentImagePreview',
        parent: parent.modal,
    })

    const elInpTitle = dom.create({
        parent: parent.modal,
        content: 'Title',
        type: 'h3',
        attr: {
            'contenteditable': true
        }
    })

    const elInpText = dom.create({
        parent: parent.modal,
        content: 'Dummy Inhalt',
        attr: {
            'contenteditable': true
        }
    })

    const formAddMedia = dom.create({
        type: 'form',
        parent: parent.modal,
        listeners: {
            submit(evt) {
                evt.preventDefault();
                // const payload = new FormData(formAddMedia);
                // payload.append('text', elInpText.innerHTML);
                // payload.append('userID', settings.user._id);
                payload.text = elInpText.innerHTML;
                payload.title = elInpTitle.innerHTML;

                console.log(payload);

                const elMsg = dom.create({
                    parent: elements.messages,
                    cssClassName: 'singleMessage',
                    content: 'Uploading',
                })

                ws.uploadMedia(payload).then(
                    () => {
                        console.log('addmedia, 67');
                        
                        // timeline.init();
                    }
                ).catch(
                    console.warn
                )

                parent.bg.remove();

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
                console.log(elInpImage.files);

                files.forEach(file => {
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = evt => {
                            // Bild an Daten anhängen
                            payload.imgs.push(evt.target.result);

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