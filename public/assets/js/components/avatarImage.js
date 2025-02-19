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
        cssClassName: 'legend',
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

    const parentImg = dom.create({
        parent: container
    })

    const imgAvatar = dom.create({
        type: 'img',
        parent: parentImg,
        src: 'getImg/' + settings.user._id + '/' + value + '/' + 'isAvatar',
        cssClassName: 'imgInputImg active'
    })

    const containerPreviousAvatar = dom.create({
        parent: container,
    })

    if (settings.user.previousImgsAvatar) {
        settings.user.previousImgsAvatar.forEach(filename => {
            const imgPreviousAvatar = dom.create({
                parent: containerPreviousAvatar,
                type: 'img',
                src: 'getImg/' + settings.user._id + '/' + filename + '/' + 'isAvatar',
                cssClassName: 'imgInputImg',
                listeners: {
                    click() {
                        settings.user.imgAvatar = filename;
                        imgAvatar.src = imgPreviousAvatar.src;
                    }
                }
            })
        })
    }
    return { container, imgAvatar };

}

export default input;