'use client';

import { usePathname } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import Loader from '@/components/Loader/Loader';

import useAuthStore from '@/stores/auth-store';

export default function AuthChecker() {
  const { checkAuth, setIsLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const check = async () => {
    setIsLoading(true);
    try {
      await checkAuth();
    } catch (error) {
      console.log('Ошибка при проверке авторизации:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const tokenExists = localStorage.getItem('pocketbase_auth');

    if (pathname !== '/login' && pathname !== "/profile" && pathname !== '/ask') {
      if (tokenExists) {
        check();
      } else {
        setIsLoading(false);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      {isLoading && <Loader />}
    </div>
  );
}