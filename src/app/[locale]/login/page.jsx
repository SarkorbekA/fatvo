'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { LoginForm } from '@/components/login-form';
import Loader from '@/components/Loader/Loader';
import useAuthStore from '@/stores/auth-store';
import PocketBase from 'pocketbase';

const pb = new PocketBase("https://back.fatvo.saidoff.uz");
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations();
  const { isLoggedIn } = useAuthStore();

  const checkAuth = async () => {
    try {
      const authData = await pb.collection('users').authRefresh();

      return true;
    } catch (error) {
      console.error('Ошибка при проверке аутентификации:', error);

localStorage.removeItem('pocketbase_auth');

      return false;
    }
  };


  const handleAuthCheck = async () => {
    const token = localStorage.getItem('pocketbase_auth');
    if (token) {
      const res = await checkAuth();

      if (res) {
        router.back();
      } else {
        setTimeout(() => setIsLoading(false), 500);
      }
    } else {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    handleAuthCheck();
  }, []);

  if (isLoading) {
    return (
      <div>
        < Loader />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="w-full max-w-2xl max-md:px-1.5">
        <div className="mt-6 flex flex-col gap-2 items-center text-center mb-5">
          <h3 className="text-2xl font-bold">{t("welcome-back")}</h3>
          <p className="text-balance text-muted-foreground">
            {t("login-to-account")}
          </p>
        </div>
        <LoginForm />
      </div>

      {isLoggedIn && < Loader />}
    </div>
  );
}