import { Register } from "../register/register.model";
import { Login } from "../login/login.model";
import { UserDevice } from "./user.device.model";
import { Enterprise } from "app/enterprise/common/enterprise.model";

export class User {
    userId : number;
    firstName : string;
    lastName : string;
    email : string;
    password : string; 
    entId : number;
    enterprise: Enterprise;
    profileImageUrl: string;
    currentUserDevice: UserDevice;

    constructor(userId?: number, firstName?: string, lastName?: string, email?: string, password?: string, entId?: number, currentUserDevice?: UserDevice, enterprise?: Enterprise, profileImageUrl?: string) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.entId = entId;
        this.currentUserDevice = currentUserDevice;
        this.enterprise = enterprise;
        this.profileImageUrl = profileImageUrl;
    }

    static getUserForRegistration(register: Register): User {
        let user = new User();
        user.firstName = register.firstName;
        user.lastName = register.lastName;
        user.email = register.email;
        user.password = register.password;
        return user;
    }

    static getUserForLogin(login: Login): User {
        let user = new User();
        user.email = login.email;
        user.password = login.password;
        return user;
    }

    static getUserForUpdateProfile(profileUpdateUser: User): User {
        let user = new User();
        user.firstName = profileUpdateUser.firstName;
        user.lastName = profileUpdateUser.lastName;
        return user;
    }   
}