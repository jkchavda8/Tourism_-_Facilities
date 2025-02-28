import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private user: any = null;
  private authToken: string | null = null;
  private userKey = 'user';
  private authTokenKey = 'authToken';

  setUser(user: any) {
    this.user = user;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser() {
    if (!this.user) {
      const storedUser = localStorage.getItem(this.userKey);
      this.user = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.user;
  }

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem(this.authTokenKey, token);
  }

  getAuthToken() {
    if (!this.authToken) {
      this.authToken = localStorage.getItem(this.authTokenKey);
    }
    return this.authToken;
  }

  clearSession() {
    this.user = null;
    this.authToken = null;
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.authTokenKey);
  }

  isLoggedIn() {
    return !!this.authToken; // Check if a token exists
  }
}
