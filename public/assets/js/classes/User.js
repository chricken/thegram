'use strict';

class User {
    constructor({
        username = '',
        password = '',
        email = '',
    }) {
        // Hier nur die Benutzereingaben verarbeiten.
        // Andere Daten werden auf dem Server eingetragen
        this.username = username;
        this.password = password;
        this.email = email;
    }
}

export default User;