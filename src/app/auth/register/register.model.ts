import { EnterpriseType } from "app/enterprise/enterprise-type/common/enterprise-type.model";

export class Register {
    firstName : string;
    lastName : string;
    email : string;
    password : string; 
    entType : EnterpriseType;
    entName : string;

    constructor(firstName?: string, lastName?: string, email?: string, password?: string, entType?: EnterpriseType, entName?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.entType = entType;
        this.entName = entName;
    }
}