'use client';
import { useEffect } from 'react';
import { User } from '@/app/lib/utils/definitions';
import userStore from '@/app/stores/userStore';

export default function UserLoader({ user }: { user: User | null }) {
  useEffect(() => {
    if (user?.id) userStore.setUser(user);
    else userStore.clearUser();
  }, [user]);

  return null;
}
