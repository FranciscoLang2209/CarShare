import Cookies from 'js-cookie';

const COOKIE_OPTIONS = {
  expires: 1, // 1 día
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

export const cookieService = {
  setUser(userId: string): void {
    Cookies.set('user', userId, COOKIE_OPTIONS);
  },

  setName(name: string): void {
    Cookies.set('name', name, COOKIE_OPTIONS);
  },

  getUser(): string | null {
    return Cookies.get('user') || null;
  },

  getName(): string | null {
    return Cookies.get('name') || null;
  },

  clearAuth(): void {
    Cookies.remove('user');
    Cookies.remove('name');
  },

  setAuthData(userId: string, name: string): void {
    this.setUser(userId);
    this.setName(name);
  },
};
