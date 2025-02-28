'use strict';

import settings from '../settings.js';
import elements from '../elements.js';

// Views
import compAddMediaBtn from '../components/addMediaBtn.js';
import compLogoutBtn from '../components/logoutBtn.js';
import compBtnUserSettings from '../components/buttonUserSettings.js';
import viewTimeline from './timeline.js';
import compNav from '../components/nav.js';
import currentUser from '../components/currentUser.js';

const app = {
    handleLogin() {

        settings.loginTime = Date.now();

        elements.main.innerHTML = '';
        settings.viewMode = viewTimeline;

        compNav();
        compAddMediaBtn({ parent: elements.nav });
        settings.viewMode.init();

        // compLogoutBtn({ parent: elements.navAdditional });
        compBtnUserSettings({ parent: elements.navAdditional });

        elements.currentUser = currentUser();
    }
}

export default app;