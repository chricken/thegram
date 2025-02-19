'use strict';

import dom from '../dom.js';
import compInput from './input.js';
import languages from '../languages/all.js';
import settings from '../settings.js';
import foldOpener from './foldOpener.js';

const inpAddress = (parent, address) => {

    let ln = languages[settings.lang];

    const container = dom.create({
        parent,
        cssClassName: 'container foldable',
    })

    const containerInputs = foldOpener({
        parent: container,
        legend: ln.address,
        toggleOpenHandler(value) {
            container.classList.remove('open', 'closed');
            container.classList.add(value ? 'open' : 'closed');
        }
    })

    compInput({
        parent: containerInputs,
        value: address.street,
        legend: ln.street,
        onInput(value) {
            address.street = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.no,
        legend: ln.no,
        onInput(value) {
            address.no = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.addition,
        legend: ln.addition,
        onInput(value) {
            address.addition = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.zip,
        legend: ln.zip,
        onInput(value) {
            address.zip = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.city,
        legend: ln.city,
        onInput(value) {
            address.city = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.country,
        legend: ln.country,
        onInput(value) {
            address.country = value;
        }
    })


}

export default inpAddress;