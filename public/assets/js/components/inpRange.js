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
    onChange=()=>{}
} = {}) => {

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
        type: 'h5',
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
                if (input.value != rng.value) {
                    input.value = rng.value;
                    onChange(rng.value );                    
                }
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
                // Dezimalzeichen korrigieren
                input.value = input.value.replaceAll(',', '.');

                // Nur übertragen, wenn der Wert nicht auf '.' endet (sonst Fehler)
                // Und wenn die Werte unterschiedelich sind (sonst Rekursion)
                if (
                    !input.value.endsWith('.')
                    && input.value != rng.value
                ) {
                    // Auf n Stellen runden
                    let dec = step.toString().split('.')[1].length;
                    input.value = +(+input.value).toFixed(dec);

                    rng.value = input.value;
                    onChange(rng.value );   
                   
                }
            }
        }
    })
    input.value = value;
    return parent;
}

export default inpRange;