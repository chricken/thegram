'use strict';

import dom from '../dom.js';
import compInput from '../components/input.js';
import compButton from '../components/button.js';
import maskRegister from './maskRegister.js';
import loginout from '../loginout.js';
import settings from '../settings.js';
import lang from '../languages/all.js';
import elements from '../elements.js';

let username = 'chricken';
let password = 'abc';

const maskLogin = () => {
    let ln = lang[settings.lang];

    elements.content.innerHTML = '';

    const container = dom.create({
        type: 'div',
        parent: elements.content,
        cssClassName: 'view viewLogin'
    })

    dom.create({
        type: 'h3',
        content: ln.login,
        parent: container,
    })

    compInput({
        parent: container,
        value: username,
        legend: ln.username,
        onInput(value) {
            username = value;
        }
    })

    compInput({
        parent: container,
        value: password,
        type: 'password',
        legend: ln.password,
        onInput(value) {
            password = value;
        }
    })

    // Anmelden
    compButton({
        legend: ln.login,
        parent: container,
        isEncapsuled: false,
        onClick() {
            loginout.login({
                username,
                password
            })
        }
    })

    // Registrieren
    compButton({
        legend: ln.register,
        parent: container,
        isEncapsuled: false,
        onClick() {
            maskRegister();
        }
    })

}

export default maskLogin;