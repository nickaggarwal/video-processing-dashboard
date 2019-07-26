export class EnterpriseType {
  id : number;
  name : string;
  description : string;

  constructor(id?: number, name?:string) {
    this.id = id;
    this.name = name;
  }
}