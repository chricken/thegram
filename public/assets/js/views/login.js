'use strict';

import dom from '../dom.js';
import compInput from '../components/input.js';
import compButton from '../components/button.js';
import ws from '../ws.js';

let userName = 'chricken';
let password = 'abc';

const login = ({
    parent = null,
}) => {

    const container = dom.create({
        type: 'div',
        parent,
        cssClassName: 'view viewLogin'
    })

    dom.create({
        type: 'h3',
        content: 'Login',
        parent: container,
    })

    compInput({
        parent: container,
        value: userName,
        legend: 'Username',
        onInput(value) {
            userName = value;
        }
    })

    compInput({
        parent: container,
        value: password,
        type: 'password',
        legend: 'Password',
        onInput(value) {
            password = value;
        }
    })

    compButton({
        legend: 'Login',
        parent: container,
        onClick() {
            ws.login(userName, password);
        }
    })

}

export default login;