'use client';

import { useEffect, useState } from 'react';
import {useRouter} from '@/i18n/routing';
import Loader from '@/components/Loader/Loader';

import PocketBase from 'pocketbase';

import useAuthStore from '@/stores/auth-store'

import AskForm from '@/components/AskForm/AskForm'

const pb = new PocketBase("https://back.fatvo.saidoff.uz");

function AskPage() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);


  const checkAuth = async () => {
    try {
      const authData = await pb.collection('users').authRefresh();

      return true;
    } catch (error) {
      console.error('Ошибка при проверке аутентификации:', error);

      return false;
    }
  };

  const handleAuthCheck = async () => {
    const token = localStorage.getItem('pocketbase_auth');
    if (!token) {
      router.replace('/login');

      return;
    }

    const res = await checkAuth();

    if (!res) {
      router.replace('/login');
    } else {
      setTimeout(() => setIsLoading(false), 500);

      setIsLoggedIn(true)
    }
  };



  useEffect(() => {
    handleAuthCheck()
  }, []);

  if (isLoading) {
    return (
      <div>
        < Loader />
      </div>
    )
  }

  return (
    <AskForm />
  );
}

export default AskPage;
