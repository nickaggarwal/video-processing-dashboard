import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
}

from '@angular/common/http';

import { UserService } from './user.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: UserService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if( request.url != "/api/users/"){
        request = request.clone({
          setHeaders: {
            Authorization: `JWT ` + localStorage.getItem('access_token')
          }
        });
    }
    return next.handle(request);
  }
}