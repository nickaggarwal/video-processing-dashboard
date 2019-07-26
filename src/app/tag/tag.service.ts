import { Injectable } from '@angular/core';
import { Tag } from './tag.model';
import { TagInfo, RelatedTagInfo } from './tag-type/tag-type.model';
import { RestService } from 'app/shared/rest/rest.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  attributes: TagInfo[];

  constructor(private restService: RestService) {
  }

  public getAllTags(): Observable<TagInfo[]> {
    let params: Map<string, string> = this.getAllTagsParams();
    return this.restService.executeGetList<TagInfo>(environment.tagModulePath + '/all', params);
  }

  public getTechnologyTagInfo(): Observable<TagInfo[]> {
    let params: Map<string, string> = this.getTechnologyTagInfoParams();
    return this.restService.executeGetList<TagInfo>(environment.tagModulePath + '/filter', params);
  }

  public getAllGroupedRelatedTags(): Observable<RelatedTagInfo[]> {
    return this.restService.executeGetList<RelatedTagInfo>(environment.tagModulePath + '/technologies/all', undefined);
  }

  private getAllTagsParams() {
    let params: Map<string, string> = new Map();
    params.set('sortBy', 'TAG_TYPE_DISPLAY_ORDER,TAG_DISPLAY_ORDER');
    params.set('sortDirection', 'ASC,ASC');
    return params;
  }

  private getTechnologyTagInfoParams() {
    let params: Map<string, string> = new Map();
    params.set('tagTypeNames', 'technology_attr');
    params.set('featureType', 'ATTRIBUTE');
    params.set('sortBy', 'TAG_TYPE_DISPLAY_ORDER,TAG_DISPLAY_ORDER');
    params.set('sortDirection', 'ASC,ASC');
    return params;
  }
}
