'use strict';

import dom from '../dom.js';
import ws from '../ws.js';
import elements from '../elements.js';
import postOverview from '../components/postOverview.js';
import languages from '../languages/all.js';
import observers from '../observers.js';
import settings from '../settings.js';
import compInput from '../components/input.js';
import compInpAddress from '../components/inpAddress.js';
import compInpContact from '../components/inpContact.js';
import compInpSocialMedia from '../components/inpSocialMedia.js';
import compInpShops from '../components/inpShops.js';
import button from '../components/button.js';

const userSettings = {
    reset() {
        elements.content.innerHTML = '';
        userSettings.init();
    },
    init() {
        userSettings.render();
    },
    render() {
        let ln = languages[settings.lang];
        // console.log('Render user settings');

        const user = settings.user;

        const parent = dom.create({
            cssClassName: 'container',
            parent: elements.content
        })

        compInput({
            parent,
            value: user.username,
            legend: ln.username,
            onInput(value) {
                user.username = value;
            }
        })

        compInput({
            parent,
            value: user.password,
            legend: ln.password,
            type: 'password',
            onInput(value) {
                user.password = value;
            }
        })

        compInput({
            parent,
            value: user.preName,
            legend: ln.preName,
            onInput(value) {

                user.preName = value;
            }
        })

        compInput({
            parent,
            value: user.surName,
            legend: ln.surName,
            onInput(value) {
                user.surName = value;
            }
        })

        compInpAddress(parent, user.address);
        compInpContact(parent, user.contact);
        compInpSocialMedia(parent, user.socialMedia);
        compInpShops(parent, user.shops)

        button({
            legend: ln.save,
            parent,
            onClick() {
                console.log(user);

                ws.saveCurrentUser().then(
                    console.log
                ).catch(
                    console.warn
                )
            }

        })

    }
}

export default userSettings;