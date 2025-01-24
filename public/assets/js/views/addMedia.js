'use strict';

import dom from '../dom.js';
import modal from '../components/modal.js';
import button from '../components/button.js';
import settings from '../settings.js';

// Classes
import ContentElement from '../classes/ContentElement.js';

const addMedia = () => {

    const parent = modal();

    let contentElement = new ContentElement(settings.user);


    const elInpText = dom.create({
        parent,
        content: 'Dummy Inhalt',
        attr: {
            'contenteditable': true
        },
        listeners: {
            input(evt) {
                contentElement.text = evt.target.innerHTML
                console.log(contentElement);
            }
        }
    })

    const elInpImage = dom.create({
        parent,
        type: 'input',
        attr: {
            type: 'file'
        }
    })

    const btnSaveContent = button({
        parent,
        legend: 'Save',
        onClick() {
            let contentElement = {
                text: elInpText
            }
        }
    })
}

export default addMedia;