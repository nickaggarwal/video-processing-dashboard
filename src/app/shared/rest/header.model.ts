import { environment } from "environments/environment";
import { UserDevice } from "../../auth/user/user.device.model";

export class Header {
  moduleId: number;
  deviceId: string;
  sessionId: string;

  constructor(deviceId?: string, sessionId?: string) {
    this.moduleId = environment.moduleId;
    this.deviceId = deviceId;
    this.sessionId = sessionId;
  }

  public static build(userDevice: UserDevice): Header {
    return new Header(userDevice.deviceId, userDevice.sessionId);
  }

  public static hasUserIdentificatonInfo(header: Header): boolean {
    return (Header.isValid(header.deviceId)) && (Header.isValid(header.sessionId));
  }

  private static isValid(str) {
    return str !== undefined && str !== null && str.length > 0;
  }
}