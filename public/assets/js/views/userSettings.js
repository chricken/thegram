'use strict';

import dom from '../dom.js';
import ws from '../ws.js';
import elements from '../elements.js';
import postOverview from '../components/postOverview.js';
import languages from '../languages/all.js';
import observers from '../observers.js';
import helpers from '../helpers.js';
import settings from '../settings.js';
import compInput from '../components/input.js';
import compTA from '../components/textarea.js';
import compImgInput from '../components/inpImage.js';
import compInpAddress from '../components/inpAddress.js';
import compInpContact from '../components/inpContact.js';
import compInpSocialMedia from '../components/inpSocialMedia.js';
import compInpShops from '../components/inpShops.js';
import button from '../components/button.js';
import clipAvatar from '../components/clipAvatar.js';

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

        const user = settings.user;

        const parent = dom.create({
            cssClassName: 'container',
            parent: elements.content
        })

        const { img: previewAvatar } = compImgInput({
            parent,
            legend: ln.imgAvatar,
            value: user.imgAvatar,
            onChange(value) {
                // Hier das Objekt mit den Bilddaten einhängen
                // Das wird auf dem Server dann in ein Bild verwandelt 
                // und in den Datensatz wird nur noch die URL geschrieben
                
                user.imgAvatar = value;
                clipAvatar(value).addEventListener('selected', evt => {
                    user.imgAvatar = evt.detail.img;
                    previewAvatar.src = evt.detail.img.data;
                })
            }
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

        dom.create({
            parent,
            content: ln.crDate + ': ' + new Date(user.crDate).toLocaleString(),
        })

        dom.create({
            parent,
            content: ln.chDate + ': ' + new Date(user.chDate).toLocaleString(),

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

        compTA({
            parent,
            value: user.description,
            legend: ln.description,
            onInput(value) {
                user.description = value;
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