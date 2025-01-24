'use strict';

import dom from '../dom.js';

const input = ({
    parent = null,
    value = '',
    onInput = () => { },
    legend = '',
    type = 'text'
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
        value,
        parent: container,
        attr: {
            type: type
        },
        listeners: {
            input(evt) {
                onInput(evt.target.value)
            }
        }
    })

}

export default input;