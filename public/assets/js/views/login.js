'use strict';

import dom from '../dom.js';
import compInput from '../components/input.js';
import compButton from '../components/button.js';
import ws from '../ws.js';

let username = 'chricken';
let password = 'abc';

const login = ({
    parent = null,
}) => {
    return new Promise((resolve, reject) => {
        // Erstmal Autologin versuchen
        let storedLogin = localStorage.getItem('credentials');

        if (storedLogin) {
            storedLogin = JSON.parse(storedLogin);
            resolve({
                username: storedLogin.username,
                password: storedLogin.password
            })
        } else {
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
                value: username,
                legend: 'Username',
                onInput(value) {
                    username = value;
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
                    resolve({ username, password })
                }
            })

        }
    })
}

export default login;