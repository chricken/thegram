'use strict';

import dom from '../dom.js';
import settings from '../settings.js';
import btnClose from './buttonClose.js';
import btn from './button.js';
import languages from '../languages/all.js';
import ws from '../ws.js';
import timeline from '../views/posts.js';
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
    let x = 0, y = 0;
    let mouseDownX = 0, mouseDownY = 0;
    let mouseIsDown = false;

    // Base64 Bilddaten
    const base64Image = file.data;

    // Canvas und Kontext abrufen
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    container.append(c);

    const render = ({ forExport = false } = {}) => {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);

        if (!forExport) {
            ctx.setLineDash([5]);

            ctx.strokeStyle = '#000';
            ctx.strokeRect(x + .5, y + .5, size - .5, size - .5);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(x - .5, y - .5, size + .5, size + .5);
        }
    }

    // Bild erstellen
    const img = new Image();
    img.addEventListener('load', () => {
        // Bild auf das Canvas zeichnen
        c.height = settings.avatarSize;
        c.width = settings.avatarSize / img.naturalHeight * img.naturalWidth;
        render();
    });
    img.src = base64Image; // Setze die Quelle des Bildes


    // UI
    const rngSize = dom.create({
        type: 'input',
        parent: container,
        value: size,
        attr: {
            type: 'range',
            min: size / 10,
            max: size
        },
        listeners: {
            input(evt) {
                let maxSize = Math.min(c.width - x);
                maxSize = Math.min(maxSize, Math.min(c.height - y));

                size = Math.min(+evt.target.value, maxSize);

                render()
            }
        }
    })
    rngSize.value = size;

    btn({
        legend: ln.saveImage,
        parent: container,
        onClick() {
            // console.log('saveImage');
            const cNeu = document.createElement('canvas');
            const ctxNeu = cNeu.getContext('2d');
            cNeu.width = settings.avatarSize;
            cNeu.height = settings.avatarSize;

            // Ohne Rahmen rendern
            render({ forExport: true })

            ctxNeu.drawImage(
                c,
                x, y, size, size,
                0, 0, settings.avatarSize, settings.avatarSize
            )

            // Mit Rahmen rendern
            render()

            // container.append(cNeu);
            const imageData = cNeu.toDataURL('image/png');
            // console.log(imageData);
            const myEvent = new CustomEvent('selected', {
                detail: {
                    img: {
                        mime: 'image/png',
                        data: imageData
                    }
                }
            })
            container.dispatchEvent(myEvent);
            bg.remove();
        }
    })

    // MouseMove
    c.addEventListener('mousedown', evt => {
        mouseIsDown = true;
        mouseDownX = evt.layerX;
        mouseDownY = evt.layerY;
    })
    c.addEventListener('mouseup', evt => {
        mouseIsDown = false;
    })
    c.addEventListener('mousemove', evt => {
        if (mouseIsDown) {
            let deltaX = mouseDownX - evt.layerX;
            let deltaY = mouseDownY - evt.layerY;

            x -= deltaX;
            y -= deltaY;

            x = Math.max(x, 0);
            y = Math.max(y, 0);
            x = Math.min(x, c.width - size);
            y = Math.min(y, c.height - size);

            mouseDownX = evt.layerX;
            mouseDownY = evt.layerY;

            render();
        }
    })


    return container;

}

export default clipAvatar;