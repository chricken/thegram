'use strict';

import dom from '../dom.js';

const foldOpener = ({
    parent = null,
    legend = '',
    toggleOpenHandler = null,
} = {}) => {

    let isOpen = false;

    const container = dom.create({
        parent,
        cssClassName: 'header headerFoldable',
        listeners: {
            click: () => {
                isOpen = !isOpen;
                iconOpen.classList.remove('open', 'closed');
                iconOpen.classList.add(isOpen ? 'open' : 'closed');

                toggleOpenHandler(isOpen)

                let height = isOpen ? containerContent.offsetHeight + 'px' : '0px';
                containerFoldable.style.height = height;
            }
        }
    })

    const iconOpen = dom.create({
        parent: container,
        content: '⯈',
        cssClassName: `icon transit iconOpener ${isOpen ? 'open' : 'closed'}`
    })

    dom.create({
        content: legend,
        parent: container,
        type: 'h2',
        cssClassName: 'transit',
    })

    const containerFoldable = dom.create({
        parent: parent,
        cssClassName: 'containerFoldable transit'
    })

    const containerContent = dom.create({
        parent: containerFoldable,
        cssClassName: 'containerInputs',
        listeners: {
            click(evt) {
                evt.stopPropagation();
            }
        }
    })

    return containerContent;
}

export default foldOpener;