'use strict';

import dom from '../dom.js';
import addMedia from './addMedia.js';
import btn from '../components/button.js';

const addMediaBtn = ({
    parent = null
}) => {
    /* 
    dom.create({
        parent,
        content: 'Add Media',
        type:'h2'
    })
    */

    btn({
        legend: 'Add Media',
        parent,
        onClick: addMedia
    })


}

export default addMediaBtn;