'use strict';

import dom from '../dom.js';
import compInput from '../components/input.js';
import compButton from '../components/button.js';
import settings from '../settings.js';
import lang from '../languages/all.js';
import elements from '../elements.js';
import User from '../classes/User.js';
import maskLogin from './maskLogin.js';
import loginout from '../loginout.js';
import helpers from '../helpers.js';

const maskRegister = () => {
    let ln = lang[settings.lang];

    let user = new User({
        username:helpers.createString(),
        password:'abc',
        email:'abd@def.gh'
    });

    elements.content.innerHTML = '';

    const container = dom.create({
        type: 'div',
        parent: elements.content,
        cssClassName: 'view viewRegister'
    })

    dom.create({
        type: 'h3',
        content: ln.register,
        parent: container,
    })

    compInput({
        parent: container,
        legend: ln.username,
        value: user.username,
        onInput(value) {
            console.log(value);
            user.username = value
        }
    })

    compInput({
        parent: container,
        legend: ln.password,
        value:user.password,
        onInput(value) {
            user.password = value
        }
    })

    compInput({
        parent: container,
        value:user.email,
        legend: ln.email,
        onInput(value) {
            user.email = value
        }
    })

    compButton({
        parent: container,
        legend: ln.register,
        isEncapsuled: false,
        onClick() {
            loginout.register(user).then(
                console.log
            ).catch(
                console.warn
            )
        }
    })

    compButton({
        parent: container,
        legend: ln.login,
        isEncapsuled: false,
        onClick() {
            maskLogin();
        }
    })

}

export default maskRegister;