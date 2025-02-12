'use strict';

import dom from '../dom.js';
import languages from '../languages/all.js';
import settings from '../settings.js';

const selection = ({
    parent = null,
    options = {}, // erwartet ein eNum
    title = '',
    isEncapsuled = true,
    onChange = () => { }
}) => {

    let ln = languages[settings.lang];

    if (isEncapsuled) {
        parent = dom.create({
            parent,
            cssClassName: 'container'
        })
    }

    dom.create({
        type: 'h5',
        parent,
        content: title,
    })

    const elSelect = dom.create({
        type: 'select',
        parent,
        listeners: {
            change() {
                onChange(elSelect.value);
            }
        }
    })

    Object.entries(options).forEach(([key, val]) => {
        dom.create({
            type: 'option',
            parent: elSelect,
            content: ln[val],
            attr: {
                value: key
            }
        })
    })

}

export default selection