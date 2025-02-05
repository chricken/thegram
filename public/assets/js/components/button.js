'use strict';

import dom from '../dom.js';

const button = ({
    legend = '',
    parent = null,
    isEncapsuled = true,
    onClick = () => { }
}) => {
    let container = parent;

    if (isEncapsuled) {
        container = dom.create({
            cssClassName: 'containerElement',
            parent,
        })
    }

    let btn = dom.create({
        parent: container,
        type: 'button',
        content: legend,
        cssClassName: 'transit',
        listeners: {
            click(evt) {
                onClick(evt);
            }
        }
    })

    return btn;
}

export default button;