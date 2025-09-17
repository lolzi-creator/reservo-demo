// Simple admin authentication utilities
// Uses sessionStorage for demo purposes

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return sessionStorage.getItem('adminAuth') === 'true';
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return false;
  }
}

export function loginAdmin(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem('adminAuth', 'true');
  } catch (error) {
    console.error('Error setting admin auth:', error);
  }
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem('adminAuth');
  } catch (error) {
    console.error('Error removing admin auth:', error);
  }
}

// Get admin session status with SSR safety
export function useAdminAuth(): { isAuthenticated: boolean; login: () => void; logout: () => void } {
  return {
    isAuthenticated: isAdminAuthenticated(),
    login: loginAdmin,
    logout: logoutAdmin
  };
}

