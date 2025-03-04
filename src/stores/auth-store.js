import { create } from 'zustand';
import PocketBase from 'pocketbase';

const pb = new PocketBase("https://back.fatvo.saidoff.uz");

pb.autoCancellation(false);

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  isRegisterOpen: false,
  isLoginOpen: false,
  setIsRegisterOpen: (status) => {
    set({ isRegisterOpen: status })
  },
  setIsLoginOpen: (status) => {
    set({ isLoginOpen: status })
  },
  setIsLoggedIn: (status) => {
    set({ isLoggedIn: status })
  },
  checkAuth: async () => {
    try {
      const authData = await pb.collection('users').authRefresh();

      set({
        isLoggedIn: true,
      });

      return true;
    } catch (error) {
      console.error('Ошибка при проверке аутентификации:', error);
      set({ isLoggedIn: false });

      return false;
    }
  },
}));

export default useAuthStore;