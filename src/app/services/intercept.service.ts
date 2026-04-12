import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class InterceptService implements HttpInterceptor  {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJndXNAbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NzU5NTE1OTgsImV4cCI6MTc3NjAzNzk5OH0.A-d82DvX6Zr-OM7zzRzqzVpvfHMEEPeziCLytoObKf0';

        req = req.clone({
			setHeaders: {
				// Authorization: `Bearer ${localStorage.getItem(environment.token)}`,
				Authorization: `Bearer ${token}`,
			},
		});
        return next.handle(req);
    }

}