Art Sphere

Damit das ganze funktioniert, braucht es eine Datei namens credentials.js nach dem folgenden Schema.

```
const credentials = {
    db:{
        url: 'URL zur Couch DB',
        user: 'Benutzername',
        pw: 'Passwort',
    }
}

export default credentials;
```