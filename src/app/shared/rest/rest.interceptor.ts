import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
}
from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import { catchError, tap } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';

import { Header } from './header.model';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { CommonConstants } from '../shared.constants';
import { environment } from 'environments/environment';

@Injectable()
export class RestInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    private header: Header;

    constructor(private spinner: NgxSpinnerService, private notificationComponent: NotificationsComponent) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.totalRequests++;
        this.spinner.show();
        this.header = this.getHeader();

        let isFormData = false;
        if (request.body instanceof FormData) {
            isFormData = true;
        }
        request = request.clone({
            headers: this.prepareHeader(this.header, isFormData, request.headers)
        });

        return next.handle(request).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse) {
                    if(evt.body && evt.body.message) {
                        this.notificationComponent.showNotification('success', evt.body.message);
                    }
                }
            }),
            catchError((error: HttpErrorResponse) => {
                if (error && error.error) {
                    var errorObj = error.error;
                    if (errorObj.message) {
                        let errorMessage = errorObj.message;
                        return this.throwException(errorMessage);
                    } else {
                        if ((!!errorObj) && (errorObj.constructor === Object) ) {
                            let errorMessage = '';
                            for (var key in errorObj) {
                                errorMessage += key.charAt(0).toUpperCase() + key.slice(1) + ': ' + errorObj[key] + '<br>';
                            }
                            return this.throwException(errorMessage);
                        }
                    }
                }
                this.throwException('Something went wrong! Our engineers are looking into it!');
                return throwError('Error message handling is missing! Please check!');
            })
        ).finally( () => {
            this.totalRequests--;
            if (this.totalRequests === 0) {
                this.spinner.hide();
            }
        });
    }

    private throwException(errorMessage: any) {
        this.notificationComponent.showNotification('danger', errorMessage);
        return throwError(errorMessage);
    }

    private getHeader(): Header {
        let header: Header;
        let headerJson: string = localStorage.getItem(CommonConstants.CJ_HEADER_KEY);
        if (headerJson && headerJson.length > 0) {
            let headerObj = JSON.parse(headerJson);
            header = new Header(headerObj.deviceId, headerObj.sessionId);
        } else {
            header = new Header();
        }
        return header;
    }

    private prepareHeader(header: Header, isFormData: boolean, headers?: HttpHeaders | null): HttpHeaders {
        headers = headers || new HttpHeaders();
        if (!isFormData && !headers.has('noContent')) {
            headers = headers.set('Content-Type', 'application/json');
        }
        if (headers.has('noContent')) {
            headers = headers.delete('noContent');
        }
        if (!headers.has('Accept')) {
            headers = headers.set('Accept', 'application/json');
        }
        // headers = headers.set(CommonConstants.CJ_HEADER_KEY, JSON.stringify(header));
        return headers;
    }
}