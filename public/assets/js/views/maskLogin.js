'use strict';

import dom from '../dom.js';
import compInput from '../components/input.js';
import compButton from '../components/button.js';
import loginout from '../loginout.js';
import settings from '../settings.js';
import lang from '../languages/all.js';

let username = 'chricken';
let password = 'abc';

const maskLogin = ({
    parent = null,
}) => {
    // Erstmal Autologin versuchen
    let storedLogin = localStorage.getItem(settings.nameItemCredential);

    let ln = lang[settings.lang];

    if (storedLogin) {
        storedLogin = JSON.parse(storedLogin);
        loginout.login(storedLogin);
    } else {
        const container = dom.create({
            type: 'div',
            parent,
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

        compButton({
            legend: ln.login,
            parent: container,
            onClick() {
                loginout.login({
                    username,
                    password
                })
            }
        })

        compButton({
            legend: ln.register,
            parent: container,
            onClick() {
                loginout.login({
                    username,
                    password
                })
            }
        })

    }
}

export default maskLogin;