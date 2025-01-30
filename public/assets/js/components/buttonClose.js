'use strict';

import dom from '../dom.js';
import button from './button.js';

const buttonClose = ({
    parent = null,
    onClick = () => { }
}) => {

    let container = button({
        legend: '✖',
        isEncapsuled: false,
        parent,
        onClick
    });

    container.classList.add('btnClose');

    return container;
}

export default buttonClose;