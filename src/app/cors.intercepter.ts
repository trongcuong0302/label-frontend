import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const headers = req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    const authReq = req.clone({ headers });
    return next.handle(authReq);
  }
}