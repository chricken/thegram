'use strict';

import dom from '../dom.js';
import compInput from './input.js';
import languages from '../languages/all.js';
import settings from '../settings.js';
import foldOpener from './foldOpener.js';

const inpShops = (parent, shops) => {

    let ln = languages[settings.lang];

    const container = dom.create({
        parent,
        cssClassName: 'container foldable',
    })

    const containerInputs = foldOpener({
        parent: container,
        legend: ln.shops,
        toggleOpenHandler(value) {
            container.classList.remove('open', 'closed');
            container.classList.add(value ? 'open' : 'closed');
        }
    })
    


    Object.values(shops).forEach(shop => {
        dom.create({
            type: 'input',
            parent: containerInputs,
            value: shop.name,
            attr: {
                placeholder: ln.shopname
            }, 
            listeners:{
                input(evt){
                    shop.name = evt.target.value;
                }
            }
        })
        
        dom.create({
            type: 'input',
            parent: containerInputs,
            value: shop.profileName,
            attr: {
                placeholder: ln.profileName
            }, 
            listeners:{
                input(evt){
                    shop.profileName = evt.target.value;
                }
            }
        })
        
        dom.create({
            type: 'input',
            parent: containerInputs,
            value: shop.profileURL,
            attr: {
                placeholder: ln.website
            }, 
            listeners:{
                input(evt){
                    shop.profileURL = evt.target.value;
                }
            }
        })
        
        dom.create({
            parent: containerInputs,
            type: 'br',
        })
    })

}

export default inpShops;