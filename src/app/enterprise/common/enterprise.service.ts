import { Injectable } from '@angular/core';
import { RestService } from 'app/shared/rest/rest.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  constructor(private restService: RestService) { }

  public getEnterprise(id: number) {
    const params: Map<string, string> = this.getEnterpriseParams(id);
    return this.restService.executeGet(environment.enterpriseModulePath + '/id', params);
  }

  public uploadEnterpriseLogo(formData: FormData) {
    return this.restService.executePost(environment.enterpriseModulePath + '/', formData);
  }

  private getEnterpriseParams(id: Number): Map<string, string> {
    const params: Map<string, string> = new Map();
    params.set('id', id.toString());
    return params;
  }  
}
