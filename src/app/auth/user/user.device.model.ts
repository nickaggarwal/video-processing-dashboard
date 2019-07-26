export class UserDevice {
    deviceId: string;
    sessionId: string;

    constructor(sessionId: string, deviceId: string) {
        this.sessionId = sessionId;
        this.deviceId = deviceId;
    }
}