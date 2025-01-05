import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const getToken = () => localStorage.getItem('accessToken');
  const getRole = () => JSON.parse(localStorage.getItem('userRole')!);
  const getUser = () => JSON.parse(localStorage.getItem('user')!);
  const getUserID = () => JSON.parse(localStorage.getItem('userID')!);

  return { isAuthenticated, getToken, getUser, getRole, getUserID };
}
