'use strict';

import settings from '../settings.js';
import elements from '../elements.js';

// Views
import viewAddMediaBtn from './addMediaBtn.js';
import viewTimeline from './timeline.js';
import compNav from '../components/nav.js';

const app = {
    handleLogin() {
        elements.main.innerHTML = '';
        settings.viewMode = viewTimeline;

        compNav();
        viewAddMediaBtn({ parent: elements.main });
        settings.viewMode.init();
    }
}

export default app;