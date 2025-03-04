import { create } from 'zustand';
import PocketBase from 'pocketbase';

const pb = new PocketBase("https://back.fatvo.saidoff.uz");

pb.autoCancellation(false);

const useUserStore = create((set) => ({
  user: null,
  setUser: (data) => {
    set({ user: data })
  },
}));

export default useUserStore;