'use strict';

import dom from '../dom.js';
import btn from './button.js';

const modal = () => {

    const bgModal = dom.create({
        parent: document.body,
        cssClassName: 'bgModal',
        listeners: {
            click() {
                bgModal.remove();
            }
        }
    })
    
    const container = dom.create({
        parent: bgModal,
        cssClassName: 'modal',
        listeners: {
            click(evt) {
                evt.stopPropagation();
            }
        }

    })

    const btnClose = btn({
        parent: container,
        legend: '✖',
        onClick() {
            bgModal.remove();
        }
    })
    btnClose.classList.add('btn', 'btnClose');

    return container;
}

export default modal;