import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Header } from './header.model';
import { environment } from '../../../environments/environment';
import { forEach } from '@angular/router/src/utils/collection';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private httpOptions: any;
  private header: Header;
  private baseUrl: string;
  public errors: any = [];

  constructor(private http: HttpClient) {
    this.baseUrl = environment.coreApiUrl;
  }

  public executeGet<T>(path: string, params?: Map<string, string | string[]>): Observable<T> {
    let { url, httpOptions } = this.getUrlAndOptions<T>(path, params);
    return this.http.get<T>(url, httpOptions);
  }

  public executeGetList<T>(path: string, params?: Map<string, string | string[]>): Observable<T[]> {
    let { url, httpOptions } = this.getUrlAndOptions<T>(path, params);
    return this.http.get<T[]>(url, httpOptions);
  }

  public executePost<T>(path: string, body: object, params?: Map<string, string | string[]>): Observable<T> {
    let { url, httpOptions } = this.getUrlAndOptions<T>(path, params);
    return this.http.post<T>(url, body, httpOptions);
  }

  public executePut<T>(path: string, body: object, params?: Map<string, string | string[]>): Observable<T> {
    let { url, httpOptions } = this.getUrlAndOptions<T>(path, params);
    return this.http.put<T>(url, body, httpOptions);
  }

  public executeDelete<T>(path: string, params?: Map<string, string | string[]>): Observable<T> {
    let { url, httpOptions } = this.getUrlAndOptions<T>(path, params);
    return this.http.delete<T>(url, httpOptions);
  }

  private getHttpOptions(params?: Map<string, string | string[]>): Object {
    return {
      params: this.getHttpParams(params)
    };
  }

  private getHttpParams(params: Map<string, string | string[]>): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    if (params && params.size > 0) {
      params.forEach((value, key) => {
        httpParams = httpParams.append(key, this.getParamValue(value));
      });
    }
    return httpParams;
  }

  private getParamValue(value: string | string[]): string | undefined {
    let paramValue: string = undefined;
    if (typeof value === 'string') {
      paramValue = value;
    }
    else if (Array.isArray(value)) {
      paramValue = value.join(',');
    } else {
      paramValue = value;
    }
    return paramValue;
  }

  private getUrl(path: string) {
    return this.baseUrl + path;
  }

  private prepareHeader(header: Header, headers?: HttpHeaders | null): object {
    headers = headers || new HttpHeaders();

    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('cj-header', JSON.stringify(header));
    return {
        headers: headers
    }
  }

  private getUrlAndOptions<T>(path: string, params: Map<string, string | string[]>) {
    let url = this.getUrl(path);
    let httpOptions = this.getHttpOptions(params);
    return { url, httpOptions };
  }
}
