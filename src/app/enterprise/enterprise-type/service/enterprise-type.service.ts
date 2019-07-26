import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { RestService } from 'app/shared/rest/rest.service';
import { EnterpriseType } from 'app/enterprise/enterprise-type/common/enterprise-type.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseTypeService {
  
  entTypes: EnterpriseType[];

  constructor(private restService: RestService) {
  }

  public getAll(): Observable<EnterpriseType[]> {
    let params: Map<string, string> = this.getSortingParams();
    return this.restService.executeGetList<EnterpriseType>(environment.enterpriseTypeModulePath + '/all', params);
  }

  private getSortingParams() {
    let params: Map<string, string> = new Map();
    params.set('sortBy', 'ENTERPRISE_TYPE_DISPLAY_ORDER');
    params.set('sortDirection', 'ASC');
    return params;
  }
}
