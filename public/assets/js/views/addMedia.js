'use strict';

import dom from '../dom.js';
import button from '../components/button.js';
import ws from '../ws.js';
import helpers from '../helpers.js';
import elements from '../elements.js';
import settings from '../settings.js';
import randomTexts from '../randomTexts.js';
import ContentElement from '../classes/ContentElement.js';
import inpRange from '../components/inpRange.js';
import lang from '../languages/all.js';
import selector from '../components/selection.js';

const addMedia = () => {
    let ln = lang[settings.lang];

    // const parent = modal();
    const parent = elements.content;
    parent.innerHTML = '';

    const payload = new ContentElement({
        title: randomTexts[helpers.createNumber(0, randomTexts.length - 1)].substring(0, 20),
        text: randomTexts[helpers.createNumber(0, randomTexts.length - 1)],
        userID: settings.user._id,
    })

    selector({
        parent,
        options: settings.postTypes,
        title: 'Type of Post',
        onChange(value) {
            // console.log('Type', value);
            payload.contentType = value;
        }
    })

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

    if (payload._id) {
        dom.create({
            parent,
            cssClassName: 'info',
            content: `ID: ${payload._id}`
        })
    }


    const cbIsDraft = dom.create({
        type: 'input',
        parent,
        id: 'cbIsDraft',
        attr: {
            type: 'checkbox'
        },
        listeners: {
            input() {
                payload.isDraft = cbIsDraft.checked;
                console.log(payload.isDraft);
                
            }
        }
    })

    let labelIsDraft = dom.create({
        type: 'label',
        parent,
        content: ln.isDraft
    })

    labelIsDraft.setAttribute('for', 'cbIsDraft');
    // console.log('isDraft', payload);

    if (payload.isDraft) cbIsDraft.setAttribute('checked', payload.isDraft);

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

                /*
                dom.create({
                    parent: elements.messages,
                    cssClassName: 'singleMessage',
                    content: 'Uploading',
                })
                */

                ws.uploadMedia(payload).then(
                    res => console.log('uploaded', res)
                ).catch(
                    console.warn
                )
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

                files.forEach((file, index) => {
                    if (file) {
                        const reader = new FileReader();

                        reader.onload = evt => {
                            // Bild an Daten anhängen
                            payload.imgs.push({
                                mime: file.type,
                                data: evt.target.result
                            });

                            // Bild in FE anzeigen
                            dom.create({
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

    inpRange({
        title: ln.progress,
        parent: formAddMedia,
        value: payload.progress,
        onChange(value) {
            payload.progress = value;
        }
    })

    inpRange({
        title: ln.AIInfluenceConcept,
        parent: formAddMedia,
        value: payload.AIInfluence.concept,
        onChange(value) {
            payload.AIInfluence.concept = value;
        }
    })

    inpRange({
        title: ln.AIInfluenceCreation,
        parent: formAddMedia,
        value: payload.AIInfluence.creation,
        onChange(value) {
            payload.AIInfluence.creation = value;
        }
    })

    inpRange({
        title: ln.AIInfluenceDocumentation,
        parent: formAddMedia,
        value: payload.AIInfluence.documentation,
        onChange(value) {
            payload.AIInfluence.documentation = value;
        }
    })

    inpRange({
        title: ln.AIInfluencePostProcess,
        parent: formAddMedia,
        value: payload.AIInfluence.postProcess,
        onChange(value) {
            payload.AIInfluence.postProcess = value;
        }
    })

    button({
        parent: formAddMedia,
        legend: 'Save',
    })
}

export default addMedia;