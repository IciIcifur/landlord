'use client';
import { useEffect } from 'react';
import { User } from '@/app/lib/utils/definitions';
import userStore from '@/app/stores/userStore';

export default function UsersLoader({ users }: { users: User[] }) {
  useEffect(() => {
    userStore.setAllUsers(users);
    return () => userStore.setAllUsers([]);
  }, [users]);

  return null;
}
