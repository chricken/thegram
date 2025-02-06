'use strict';

import dom from '../dom.js';
import compInput from './input.js';
import languages from '../languages/all.js';
import settings from '../settings.js';

const inpSocialMedia = (parent, socialMedia) => {

    let ln = languages[settings.lang];

    const container = dom.create({
        parent,
        cssClassName: 'container',
    })

    dom.create({
        type: 'h2',
        content: ln.socialMedia,
        parent: container
    })

    compInput({
        parent: container,
        value: socialMedia.instagram,
        legend: 'Instagram',
        onInput(value) {
            socialMedia.instagram = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.facebook,
        legend: 'Facebook',
        onInput(value) {
            socialMedia.facebook = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.bluesky,
        legend: 'Bluesky',
        onInput(value) {
            socialMedia.bluesky = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.cara,
        legend: 'Cara',
        onInput(value) {
            socialMedia.cara = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.pinterest,
        legend: 'Pinterest',
        onInput(value) {
            socialMedia.pinterest = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.xing,
        legend: 'Xing',
        onInput(value) {
            socialMedia.xing = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.linkedin,
        legend: 'LinkedIn',
        onInput(value) {
            socialMedia.linkedin = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.artstation,
        legend: 'ArtStation',
        onInput(value) {
            socialMedia.artstation = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.deviantart,
        legend: 'DeviantArt',
        onInput(value) {
            socialMedia.deviantart = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.behance,
        legend: 'Behance',
        onInput(value) {
            socialMedia.behance = value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.dribble,
        legend: 'Dribble',
        onInput(value) {
            socialMedia.dribble = value;
        }
    })
}

export default inpSocialMedia;