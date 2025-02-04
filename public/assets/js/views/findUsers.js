'use strict';

import dom from '../dom.js';
import elements from '../elements.js';
import ws from '../ws.js';
import settings from '../settings.js';
import userOverview from '../components/userOverview.js';

const findUsers = {
    reset() {

        const parent = elements.content;

        parent.innerHTML = '';

        elements.parentSubbedUsers = dom.create({
            parent,
            cssClassName: 'containerSubbedUsers'
        })

        elements.parentNewUsers = dom.create({
            parent,
            cssClassName: 'containerNewUsers'
        })

        // Setzt alle lokalen Einstellungen zurück
        findUsers.init();
    },
    init() {
        // Bereitet den Render-Prozess vor
        ws.getSubbedUsers().then(
            findUsers.renderSubbedUsers
        );
        ws.getNewUsers(settings.numNewUsersToShow).then(
            findUsers.renderNewUsers
        );

    },
    renderSubbedUsers(payload) {
        // Stellt die Daten dar
        const parent = elements.parentSubbedUsers;

        parent.innerHTML = '';

        dom.create({
            content: 'Subbed Users',
            parent,
            type: 'h2'
        })

        payload.forEach(user => {
            userOverview(parent, user)
        })

    },
    renderNewUsers(payload) {
        // Stellt die Daten dar
        const parent = elements.parentNewUsers;

        parent.innerHTML = '';

        dom.create({
            content: 'New Users',
            parent,
            type: 'h2'
        })

        payload.forEach(user => {
            userOverview(parent, user)
        })
    }
}

export default findUsers;