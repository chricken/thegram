'use strict';

import settings from './settings.js';
import app from './views/app.js';

const ajax = {
    login({
        userName = '',
        password = ''
    }) {

        fetch('/login', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                userName, password
            })
        }).then(
            res => res.json()
        ).then(
            res => {
                console.log(res);

                if (res.status == 'success') {
                    settings.user = res.payload;
                    localStorage.setItem(
                        'credentials',
                        JSON.stringify(res.payload)
                    );
                    app.handleLogin()

                } else {
                    console.log('Nicht erfolgreich');
                }
            }
        ).catch(
            console.warn
        )
    },

    loadTimeline() {
    },

    uploadMedia(payload){
        
        return fetch('/uploadMedia', {
            method: 'post',
            body:payload
        }).then(
            res => res.json()
        )
    },
}

export default ajax;