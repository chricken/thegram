'use strict';

import dom from '../dom.js';
import compInput from './input.js';
import languages from '../languages/all.js';
import settings from '../settings.js';

const inpShops = (parent, shops) => {

    let ln = languages[settings.lang];

    const container = dom.create({
        parent,
        cssClassName: 'container',
    })

    dom.create({
        type: 'h2',
        content: ln.shops,
        parent: container
    })

    Object.values(shops).forEach(shop => {
        dom.create({
            type: 'input',
            parent: container,
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
        /*
        dom.create({
            type: 'input',
            parent: container,
            value: shop.website,
            attr: {
                placeholder: ln.website
            }, 
            listeners:{
                input(evt){
                    shop.name = evt.target.value;
                }
            }
        })
        */
        dom.create({
            type: 'input',
            parent: container,
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
            parent: container,
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
            parent: container,
            type: 'br',
        })
    })

}

export default inpShops;