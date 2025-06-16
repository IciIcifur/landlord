'use client';
import { User } from '@/app/lib/utils/definitions';

export default function UserCard({ user }: { user: User }) {
  return <div>{user.email}</div>;
}
