'use strict';

import dom from '../dom.js';

const ta = ({
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

    const ta = dom.create({
        type: 'textarea',
        parent: container,
        attr: {
            type: type
        },
        listeners: {
            input(evt) {
                onInput(evt.target.value);
            }
        }
    })
    ta.value = value;

}

export default ta;