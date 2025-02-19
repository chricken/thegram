'use strict';

import dom from '../dom.js';
import compInput from './input.js';
import languages from '../languages/all.js';
import settings from '../settings.js';
import foldOpener from './foldOpener.js';

const inpSocialMedia = (parent, socialMedia) => {

    let ln = languages[settings.lang];

    const container = dom.create({
        parent,
        cssClassName: 'container foldable',
    })

    const containerInputs = foldOpener({
        parent: container,
        legend: ln.socialMedia,
        toggleOpenHandler(value) {
            container.classList.remove('open', 'closed');
            container.classList.add(value ? 'open' : 'closed');
        }
    })
    
    compInput({
        parent: containerInputs,
        value: socialMedia.instagram,
        legend: 'Instagram',
        onInput(value) {
            socialMedia.instagram = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.facebook,
        legend: 'Facebook',
        onInput(value) {
            socialMedia.facebook = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.bluesky,
        legend: 'Bluesky',
        onInput(value) {
            socialMedia.bluesky = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.cara,
        legend: 'Cara',
        onInput(value) {
            socialMedia.cara = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.pinterest,
        legend: 'Pinterest',
        onInput(value) {
            socialMedia.pinterest = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.xing,
        legend: 'Xing',
        onInput(value) {
            socialMedia.xing = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.linkedin,
        legend: 'LinkedIn',
        onInput(value) {
            socialMedia.linkedin = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.artstation,
        legend: 'ArtStation',
        onInput(value) {
            socialMedia.artstation = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.deviantart,
        legend: 'DeviantArt',
        onInput(value) {
            socialMedia.deviantart = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.behance,
        legend: 'Behance',
        onInput(value) {
            socialMedia.behance = value;
        }
    })

    compInput({
        parent: containerInputs,
        value: socialMedia.dribble,
        legend: 'Dribble',
        onInput(value) {
            socialMedia.dribble = value;
        }
    })
}

export default inpSocialMedia;