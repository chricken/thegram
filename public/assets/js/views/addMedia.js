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
import ContentElement from '../classes/ContentElement.js';
import inpRange from '../components/inpRange.js';
import lang from '../languages/all.js';

const addMedia = () => {
    /*
    "_id": "2209c7a52cd806b1ea4bb70aa600229f",
    "_rev": "1-aecb53f53b3e0ed224214c37d4ca356e",
    "title": "Die alte Brücke über",
    "text": "Reisen ist eine der bereicherndsten Erfahrungen, die man im Leben machen kann. Es eröffnet neue Perspektiven, Kulturen und Traditionen, die unser Verständnis von der Welt erweitern. Wenn wir neue Orte besuchen, treffen wir Menschen mit unterschiedlichen Lebensweisen und Geschichten, die uns inspirieren und zum Nachdenken anregen. Ob es sich um eine Reise in die Berge, an den Strand oder in eine pulsierende Stadt handelt, jede Reise hat das Potenzial, uns zu verändern und uns neue Einsichten zu geben. Die Erinnerungen, die wir sammeln, begleiten uns ein Leben lang und bereichern unser Dasein.",
    "userID": "2209c7a52cd806b1ea4bb70aa60010fd",
    "type": 0,
    "tags": [],
    "likes": [],
    "dislikes": [],
    "comments": [],
    "forwardedPostID": "",
    "progress": 0,
    "timestamp": 1739279725055,
    "imgNames": [
        "187pscpal98.i_1739279725056_0.jpg"
    ]
    */


    let ln = lang[settings.lang];

    // const parent = modal();
    const parent = elements.content;
    parent.innerHTML = '';

    const payload = new ContentElement({
        title: randomTexts[helpers.createNumber(0, randomTexts.length - 1)].substring(0, 20),
        text: randomTexts[helpers.createNumber(0, randomTexts.length - 1)],
        userID: settings.user._id,
    })




    console.log(payload);

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

    const elShowID = dom.create({
        parent,
        cssClassName: 'info',
        content: `ID: ${payload._id}`
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
                    res => console.log('uploaded', res)
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
                /*
                 "_id": "2209c7a52cd806b1ea4bb70aa600229f",
                "_rev": "1-aecb53f53b3e0ed224214c37d4ca356e",
                "title": "Die alte Brücke über",
                "text": "Reisen ist eine der bereicherndsten Erfahrungen, die man im Leben machen kann. Es eröffnet neue Perspektiven, Kulturen und Traditionen, die unser Verständnis von der Welt erweitern. Wenn wir neue Orte besuchen, treffen wir Menschen mit unterschiedlichen Lebensweisen und Geschichten, die uns inspirieren und zum Nachdenken anregen. Ob es sich um eine Reise in die Berge, an den Strand oder in eine pulsierende Stadt handelt, jede Reise hat das Potenzial, uns zu verändern und uns neue Einsichten zu geben. Die Erinnerungen, die wir sammeln, begleiten uns ein Leben lang und bereichern unser Dasein.",
                "userID": "2209c7a52cd806b1ea4bb70aa60010fd",
                "type": 0,
                "tags": [],
                "likes": [],
                "dislikes": [],
                "comments": [],
                "forwardedPostID": "",
                "progress": 0,
                "timestamp": 1739279725055,
                "imgNames": [
                    "187pscpal98.i_1739279725056_0.jpg"
                ]
                    */
                let files = [...elInpImage.files];

                files.forEach((file, index) => {
                    if (file) {
                        // console.log(index);

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

    const rngProgress = inpRange({
        title: ln.progress,
        parent,
        value: payload.progress,
        listeners: {
            input(evt) {
                console.log('Eingabe von Wert', evt.detail);

            }
        }
    })

    /*
    const rngProgress = dom.create({
        type: 'input',
        parent,
        attr:{
            type:'range',
            min:0,
            max:1,
            step:.001,
        }
    })
    rngProgress.value = payload.progress;
    */

    const btnSaveContent = button({
        parent: formAddMedia,
        legend: 'Save',

    })
}

export default addMedia;