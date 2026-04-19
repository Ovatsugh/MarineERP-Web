import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/enviironment';
import type { UserResponse } from '../types/user.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly currentUserState = signal<UserResponse | null>(null);
    private currentUserRequest: Promise<UserResponse> | null = null;

    readonly currentUser = this.currentUserState.asReadonly();

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Promise<{ token: string }> {
        return lastValueFrom(
            this.http.post<{ token: string }>(`${environment.url}auth/login`, { email, password })
        );
    }

    loadCurrentUser(force = false): Promise<UserResponse> {
        const currentUser = this.currentUserState();

        if (!force && currentUser) {
            return Promise.resolve(currentUser);
        }

        if (!force && this.currentUserRequest) {
            return this.currentUserRequest;
        }

        this.currentUserRequest = lastValueFrom(
            this.http.get<UserResponse | { data?: UserResponse }>(this.buildUrl('admin/users/me'))
        )
            .then((response) => {
                const user = this.normalizeUserResponse(response);
                this.currentUserState.set(user);
                return user;
            })
            .finally(() => {
                this.currentUserRequest = null;
            });

        return this.currentUserRequest;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    logout(): void {
        localStorage.removeItem('token');
        this.currentUserState.set(null);
    }

    private buildUrl(path: string): string {
        return `${environment.url.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    }

    private normalizeUserResponse(response: UserResponse | { data?: UserResponse }): UserResponse {
        return 'data' in response && response.data ? response.data : response as UserResponse;
    }
}
