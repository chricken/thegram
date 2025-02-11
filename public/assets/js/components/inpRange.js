'use strict';

import dom from '../dom.js';
import lang from '../languages/all.js';
import settings from '../settings.js';

const inpRange = ({
    parent = null,
    title = '',
    min = 0,
    max = 1,
    step = .001,
    value = .1,
    isEncapsuled = true,
} = {}) => {

    console.log(value);

    let ln = lang[settings.lang];

    if (isEncapsuled) {
        parent = dom.create({
            parent,
            cssClassName: 'container'
        })
    }

    dom.create({
        content: title,
        parent,
        type: 'h3',
    })

    const parentInputs = dom.create({
        parent,
    })

    const rng = dom.create({
        type: 'input',
        parent: parentInputs,
        attr: {
            type: 'range',
            min, max, step, value
        },
        listeners: {
            input() {
                input.value = rng.value;
                const myEvent = new CustomEvent('input', {
                    detail: { value: rng.value }
                })
                this.dispatchEvent(myEvent);
            }
        }
    })
    rng.value = value;

    const input = dom.create({
        type: 'input',
        parent: parentInputs,
        value,
        listeners: {
            input() {
                rng.value = input.value;
                const myEvent = new CustomEvent('input', {
                    detail: { value: input.value }
                })
                this.dispatchEvent(myEvent);

            },
        }
    })
    input.value = value;

}

export default inpRange;