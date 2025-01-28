'use strict';

import dom from '../dom.js';
import modal from '../components/modal.js';
import button from '../components/button.js';
import ajax from '../ajax.js';
import ws from '../ws.js';
import elements from '../elements.js';
import settings from '../settings.js';

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
                payload.text= elInpText.innerHTML;

                console.log(payload);

                const elMsg = dom.create({
                    parent: elements.messages,
                    cssClassName: 'singleMessage',
                    content: 'Uploading',
                })

                /*
                ajax.uploadMedia(payload).then(
                    console.log                    
                ).catch(
                    console.warn                    
                )
                */

                ws.uploadMedia(payload).then(
                    console.log
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
        },
        listeners: {
            change() {
                let file = elInpImage.files[0];
                if (file) {
                    
                    const reader = new FileReader();
                    reader.onload = evt => {
                        // Bild an Daten anhängen
                        payload.imgs[0] = evt.target.result;

                        console.log(payload);
                        

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
            }
        }
    })

    const btnSaveContent = button({
        parent: formAddMedia,
        legend: 'Save',

    })
}

export default addMedia;