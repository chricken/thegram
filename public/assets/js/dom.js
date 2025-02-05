'use strict';

import elements from './elements.js';

const dom = {
    create({
        content = false,
        value = false,
        type = 'div',
        parent = false,
        name = false,
        src = false,
        href = false,
        id = false,
        target = false,
        cssClassName = false,
        cssClasses = [],
        attr = {},
        listeners = {},
        styles = {},
        insert = 'append',
    } = {}) {
    
        let neu = document.createElement(type);
        if (content) neu.innerHTML = content;
        if (name) neu.setAttribute('name', name);
        if (src) neu.setAttribute('src', src);
        if (href) neu.setAttribute('href', href);
        if (target) neu.setAttribute('target', target);
        if (id) neu.id = id;
        if (value) neu.setAttribute('value', value);
        if (cssClassName) neu.className = cssClassName;
        if (cssClasses.length) neu.classList.add(...cssClasses);
    
        
        Object.entries(attr).forEach(el => neu.setAttribute(...el));
        Object.entries(listeners).forEach(el => neu.addEventListener(...el));
        Object.entries(styles).forEach(style => neu.style[style[0]] = style[1]);
        
        if (parent) {
            if (insert == 'append') {
                parent.append(neu);
            } else if (insert == 'prepend') {
                parent.prepend(neu);
            } else if (insert == 'before') {
                parent.before(neu);
            } else if (insert == 'after') {
                parent.after(neu);
            }
        }
        
        return neu;
    },
    $(selector) {
        return document.querySelector(selector);
    },
    $$(selector) {
        return [...document.querySelectorAll(selector)];
    },
    mapping(){
        elements.main = dom.$('main');
        elements.messages = dom.$('messages');
        elements.content = dom.$('content');
        // elements.loadTrigger = dom.$('loadTrigger');
        elements.nav = dom.$('nav');
        elements.navAdditional = dom.$('navAdditional');
    }
}

export default dom;