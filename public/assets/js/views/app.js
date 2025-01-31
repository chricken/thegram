'use strict';

import elements from '../elements.js';

// Views
import viewAddMediaBtn from './addMediaBtn.js';
import viewTimeline from './timeline.js';

const app = {
    handleLogin() {
        elements.main.innerHTML = '';

        viewAddMediaBtn({ parent: elements.main });
        viewTimeline.init();
    }
}

export default app;