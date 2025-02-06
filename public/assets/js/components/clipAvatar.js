'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import btnClose from './buttonClose.js';
import btn from './button.js';
import languages from '../languages/all.js';
import ws from '../ws.js';
import timeline from '../views/timeline.js';
import modal from './modal.js';

const clipAvatar = (file) => {
    let ln = languages[settings.lang];

    const { bg, modal: parent } = modal();

    const container = dom.create({
        parent,
        cssClassName: 'clipAvatar',
        listeners: {
            scroll(evt) {
                evt.stopPropagation();
            }
        },
    })

    dom.create({
        parent: container,
        content: ln.clipAvatar,
        type: 'h3'
    })
    let size = settings.avatarSize;

    console.log(file);

    // Base64 Bilddaten
    const base64Image = file.data;

    // Canvas und Kontext abrufen
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    container.append(c);
    
    // Bild erstellen
    const img = new Image();
    img.addEventListener('load', () => {
        // Bild auf das Canvas zeichnen
        c.height = settings.avatarSize;
        c.width = settings.avatarSize / img.naturalHeight * img.naturalWidth
        ctx.drawImage(img, 0, 0, c.width, c.height);
    });
    img.src = base64Image; // Setze die Quelle des Bildes


    // UI
    dom.create({})

    return container;

}

export default clipAvatar;