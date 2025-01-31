'use strict';

import addMedia from './addMedia.js';
import btn from '../components/button.js';

const addMediaBtn = ({
    parent = null
}) => {
  
    btn({
        legend: 'Add Media',
        parent,
        onClick: addMedia
    })

}

export default addMediaBtn;