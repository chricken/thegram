'use strict';

class Contact {
    constructor(data) {
        this.phone1 = data.phone1 || '';
        this.phone2 = data.phone2 || '';
        this.phone3 = data.phone3 || '';

        this.email1 = data.email1 || '';
        this.email2 = data.email2 || '';
        this.email3 = data.email3 || '';

        this.website1 = data.website1 || '';
        this.website2 = data.website2 || '';

        this.agency = data.agency || '';
        this.agencyEMail = data.agencyEMail || '';
        this.agencyPhone = data.agencyPhone || '';

        this.management = data.management || '';
        this.managementEMail = data.managementEMail || '';
        this.managementPhone = data.managementPhone || '';
        this.managementWebsite = data.managementWebsite || '';
    }
}

export default Contact;