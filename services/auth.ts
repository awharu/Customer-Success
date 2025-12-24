const ADMIN_KEY = 'pharma_admin_session';
const MOCK_PASSWORD = 'admin'; // In production, this would be a real hash check on a backend

export const authService = {
  login: (password: string): boolean => {
    if (password === MOCK_PASSWORD) {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 2); // 2 hour session
      localStorage.setItem(ADMIN_KEY, JSON.stringify({
        active: true,
        expires: expiry.toISOString()
      }));
      return true;
    }
    return false;
  },

  isAuthenticated: (): boolean => {
    const sessionRaw = localStorage.getItem(ADMIN_KEY);
    if (!sessionRaw) return false;
    
    try {
      const session = JSON.parse(sessionRaw);
      const isExpired = new Date(session.expires) < new Date();
      if (isExpired) {
        authService.logout();
        return false;
      }
      return session.active;
    } catch {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(ADMIN_KEY);
  }
};