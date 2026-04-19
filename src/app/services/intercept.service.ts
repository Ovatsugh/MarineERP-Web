import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { toast } from "@spartan-ng/brain/sonner";
import { Observable, tap } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class InterceptService implements HttpInterceptor  {

    constructor(private auth: AuthService, private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isAuthRequest = req.url.includes('/auth/');

        if (!isAuthRequest) {
            const token = this.auth.getToken();
            if (token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        }

        return next.handle(req).pipe(
            tap({
                error: (err) => {
                    if (!isAuthRequest && err instanceof HttpErrorResponse && err.status === 403) {
                        this.auth.logout();
                        toast.error('Sessão expirada. Faça login novamente.');
                        void this.router.navigate(['/auth']);
                    }
                    console.error('HTTP Error:', err);
                },
            })
        );
    }

}
