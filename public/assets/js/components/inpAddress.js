'use strict';

import dom from '../dom.js';
import compInput from './input.js';
import languages from '../languages/all.js';
import settings from '../settings.js';

const inpAddress = (parent, address) => {

    let ln = languages[settings.lang];

    const container = dom.create({
        parent,
        cssClassName: 'container',
    })

    dom.create({
        type:'h2',
        content: ln.address,
        parent:container
    })

    compInput({
        parent:container,
        value: address.street,
        legend: ln.street,
        onInput(value) {
            address.street =value;
        }
    })

    compInput({
        parent:container,
        value: address.no,
        legend: ln.no,
        onInput(value) {
            address.no = value;
        }
    })

    compInput({
        parent:container,
        value: address.addition,
        legend: ln.addition,
        onInput(value) {
            address.addition = value;
        }
    })

    compInput({
        parent:container,
        value: address.zip,
        legend: ln.zip,
        onInput(value) {
            address.zip = value;
        }
    })

    compInput({
        parent:container,
        value: address.city,
        legend: ln.city,
        onInput(value) {
            address.city = value;
        }
    })

    compInput({
        parent:container,
        value: address.country,
        legend: ln.country,
        onInput(value) {
            address.country = value;
        }
    })


}

export default inpAddress;