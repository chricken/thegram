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
import viewPosts from './posts.js';

const addMedia = (post = null) => {
    let ln = lang[settings.lang];

    // const parent = modal();
    const parent = elements.content;
    parent.innerHTML = '';

    let payload;
    console.log('Übergebene Daten für Contentelement', post);

    if (post) {
        payload = new ContentElement(post)
    } else {
        payload = new ContentElement({
            title: randomTexts[helpers.createNumber(0, randomTexts.length - 1)].substring(0, 20),
            text: randomTexts[helpers.createNumber(0, randomTexts.length - 1)],
            userID: settings.user._id,
        })
    }

    selector({
        parent,
        options: settings.postTypes,
        title: 'Type of Post',
        onChange(value) {
            // console.log('Type', value);
            payload.contentType = value;
        }
    })


    const elInpTitle = dom.create({
        // parent: parent.modal,
        parent,
        content: payload.title,
        type: 'h3',
        attr: {
            'contenteditable': true
        },
        listeners: {
            input(evt) {
                payload.title = evt.target.innerHTML;
            }
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

    // Text-Eingabe
    dom.create({
        // parent: parent.modal,
        parent,
        content: payload.text,
        attr: {
            'contenteditable': true
        },
        listeners: {
            input(evt) {
                payload.text = evt.target.innerHTML;
            }
        }
    })

    const formAddMedia = dom.create({
        type: 'form',
        // parent: parent.modal,
        parent,
        listeners: {
            submit(evt) {
                evt.preventDefault();
                // payload.text = elInpText.innerHTML;
                // payload.title = elInpTitle.innerHTML;
                console.log('abzusendende Daten', payload);

                ws.uploadMedia(payload).then(
                    res => console.log('uploaded', res)
                ).then(
                    () => {
                        viewPosts.reset()
                    }
                ).catch(
                    console.warn
                )
            }
        }
    })

    dom.create({
        parent: formAddMedia,
        type: 'h4',
        content: ln.imgNew
    })

    // Objekt, das die Daten des Content-Elementes enthält
    const elImagePreview = dom.create({
        cssClassName: 'parentImagePreview',
        // parent: parent.modal,
        parent: formAddMedia,
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
                            const containerSingleImage = dom.create({
                                parent: elImagePreview,
                                cssClassName: 'containerSingleImage'
                            })

                            // Bild an Daten anhängen
                            let myImgData = {
                                mime: file.type,
                                data: evt.target.result
                            }
                            payload.imgs.push(myImgData);

                            // Bild in FE anzeigen
                            let imgPreview = dom.create({
                                type: 'img',
                                parent: containerSingleImage,
                                cssClassName: 'imagePreview',
                                attr: {
                                    src: evt.target.result,
                                },
                            })

                            dom.create({
                                cssClassName: 'btnRemoveImg transit',
                                parent: containerSingleImage,
                                content: '✖',
                                listeners: {
                                    click() {
                                        console.log(payload.imgs);
                                        payload.imgs = payload.imgs.filter(img => {
                                            console.log(img, myImgData);
                                            console.log(img != myImgData);
                                            return (img != myImgData)
                                        });
                                        containerSingleImage.remove();
                                    }
                                }
                            })
                        }

                        reader.readAsDataURL(file); // Bild als Data URL lesen
                    }
                })
            }
        }
    })

    // Schon vorhandene Bilder
    const parentImageAlreadyIn = dom.create({
        parent: formAddMedia,
        cssClassName: 'parentImagePreview'
    })

    dom.create({
        parent: parentImageAlreadyIn,
        type: 'h4',
        content: ln.imgLoaded
    })

    if (post && post.imgNames) {
        post.imgNames.forEach(imgName => {
            let path = `/getImg/${post.userID}/${imgName}`;

            const containerSingleImage = dom.create({
                parent: parentImageAlreadyIn,
                cssClassName: 'containerSingleImage'
            })

            const img = dom.create({
                type: 'img',
                cssClassName: 'imagePreview',
                src: path,
                parent: containerSingleImage
            })

            dom.create({
                cssClassName: 'btnRemoveImg transit',
                parent: containerSingleImage,
                content: '✖',
                listeners: {
                    click() {
                        post.imgNames = post.imgNames.filter(el => imgName != el);
                        containerSingleImage.remove();
                    }
                }
            })
        })
    }

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