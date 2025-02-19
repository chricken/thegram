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
        legend: ln.contact,
        toggleOpenHandler(value) {
            container.classList.remove('open', 'closed');
            container.classList.add(value ? 'open' : 'closed');
        }
    })
    
    compInput({
        parent: containerInputs,
        value: address.phone1,
        legend: ln.phone + 1,
        onInput(value) {
            address.phone1 = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.phone2,
        legend: ln.phone + 2,
        onInput(value) {
            address.phone2 = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.phone3,
        legend: ln.phone + 3,
        onInput(value) {
            address.phone3 = value;
        }
    })

    // Abstand
    dom.create({
        type: 'br',
        parent: containerInputs
    })

    compInput({
        parent: containerInputs,
        value: address.email1,
        legend: ln.email + 1,
        onInput(value) {
            address.email1 = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.email2,
        legend: ln.email + 2,
        onInput(value) {
            address.email2 = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.email3,
        legend: ln.email + 3,
        onInput(value) {
            address.email3 = value;
        }
    })

    // Abstand
    dom.create({
        type: 'br',
        parent: containerInputs
    })

    compInput({
        parent: containerInputs,
        value: address.website1,
        legend: ln.website + 1,
        onInput(value) {
            address.website1 = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.website2,
        legend: ln.website + 2,
        onInput(value) {
            address.website2 = value;
        }
    })

    // Abstand
    dom.create({
        type: 'br',
        parent: containerInputs
    })

    compInput({
        parent: containerInputs,
        value: address.agency,
        legend: ln.agency,
        onInput(value) {
            address.agency = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.agencyEMail,
        legend: ln.agencyEMail,
        onInput(value) {
            address.agencyEMail = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.agencyPhone,
        legend: ln.agencyPhone,
        onInput(value) {
            address.agencyPhone = value;
        }
    })

    // Abstand
    dom.create({
        type: 'br',
        parent: containerInputs
    })

    compInput({
        parent: containerInputs,
        value: address.management,
        legend: ln.management,
        onInput(value) {
            address.management = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.managementEMail,
        legend: ln.managementEMail,
        onInput(value) {
            address.managementEMail = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.managementPhone,
        legend: ln.managementPhone,
        onInput(value) {
            address.managementPhone = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: address.managementWebsite,
        legend: ln.managementWebsite,
        onInput(value) {
            address.managementWebsite = value;
        }
    })


}

export default inpAddress;