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
        input(evt) {
            socialMedia.instagram = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.facebook,
        legend: 'Facebook',
        input(evt) {
            socialMedia.facebook = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.bluesky,
        legend: 'Bluesky',
        input(evt) {
            socialMedia.bluesky = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.cara,
        legend: 'Cara',
        input(evt) {
            socialMedia.cara = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.pinterest,
        legend: 'Pinterest',
        input(evt) {
            socialMedia.pinterest = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.xing,
        legend: 'Xing',
        input(evt) {
            socialMedia.xing = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.linkedin,
        legend: 'LinkedIn',
        input(evt) {
            socialMedia.linkedin = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.artstation,
        legend: 'ArtStation',
        input(evt) {
            socialMedia.artstation = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.deviantart,
        legend: 'DeviantArt',
        input(evt) {
            socialMedia.deviantart = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.behance,
        legend: 'Behance',
        input(evt) {
            socialMedia.behance = evt.target.value;
        }
    })

    compInput({
        parent: container,
        value: socialMedia.dribble,
        legend: 'Dribble',
        input(evt) {
            socialMedia.dribble = evt.target.value;
        }
    })
}

export default inpSocialMedia;