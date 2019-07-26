import { Register } from "app/auth/register/register.model";
import { EnterpriseType } from "../enterprise-type/common/enterprise-type.model";

export class Enterprise {
  id : number;
  name : string;
  description : string;
  logo: string;
  enterpriseTypeId: number;
  enterpriseType: EnterpriseType;

  constructor(id?: number, name?:string, description?: string, enterpriseTypeId?: number, enterpriseType?: EnterpriseType) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.enterpriseTypeId = enterpriseTypeId;
    this.enterpriseType = enterpriseType;
  }

  static getEnterprise(register: Register): Enterprise {
    let enterprise = new Enterprise();
    enterprise.name = register.entName;
    enterprise.enterpriseTypeId = register && register.entType ? register.entType.id : undefined;
    return enterprise;
  }
}