'use strict';

import dom from '../dom.js';
import helpers from '../helpers.js';
import settings from '../settings.js';

const input = ({
    parent = null,
    value = '',
    onChange = () => { },
    legend = ''
}) => {
    const container = dom.create({
        parent,
        cssClassName: 'containerElement',
    })

    dom.create({
        parent: container,
        content: legend + ': ',
        type: 'span',
    })

    dom.create({
        type: 'input',
        parent: container,
        attr: {
            type: 'file'
        },
        listeners: {
            change(evt) {
                const target = evt.target;
                helpers.getDataFromImgInput(target).then(
                    onChange
                )
            }
        }
    })

    dom.create({
        type: 'img',
        parent: container,
        src: 'getImg/' + settings.user._id + '/' + value + '/' + 'isAvatar',
        cssClassName: 'imgInputImg'
    })

    return container;

}

export default input;