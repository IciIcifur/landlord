'use client';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar';
import Link from 'next/link';
import LandlordLogo from '@/public/logo.png';
import Image from 'next/image';
import userStore from '@/app/stores/userStore';
import { observer } from 'mobx-react-lite';
import { UserRole } from '@/app/lib/utils/definitions';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { User2Icon } from 'lucide-react';

const MainNavbar = observer(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const path = usePathname();

  useEffect(() => {
    if (path === '/') setActivePage(0);
    else if (path.includes('users')) setActivePage(2);
    else setActivePage(1);
  }, [path]);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered className="gap-2">
      <NavbarBrand>
        <Image src={LandlordLogo} alt="logo" className="w-16" />
        <p className="text-2xl font-semibold">LandLord</p>
      </NavbarBrand>

      <NavbarContent className="hidden gap-4 md:flex" justify="center">
        <NavbarItem isActive={activePage == 1}>
          <Link href="#">Детали объекта</Link>
        </NavbarItem>
        <NavbarItem isActive={activePage == 0}>
          <Link aria-current="page" href="/">
            Главная
          </Link>
        </NavbarItem>
        {
          (userStore.user?.role === UserRole.ADMIN ? (
            <NavbarItem isActive={activePage == 2}>
              <Link href="/users">Пользователи</Link>
            </NavbarItem>
          ) : null) as ReactNode
        }
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden items-center gap-1 lg:flex">
          <User2Icon className="w-4 stroke-default-500" />
          <p className="text-small text-default-500">{userStore.user?.email}</p>
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden"
        />
        <NavbarMenu>
          <NavbarMenuItem isActive={activePage == 1}>
            <Link href="#">Детали объекта</Link>
          </NavbarMenuItem>
          <NavbarMenuItem isActive={activePage == 0}>
            <Link aria-current="page" href="/">
              Главная
            </Link>
          </NavbarMenuItem>
          {
            (userStore.user?.role === UserRole.ADMIN ? (
              <NavbarMenuItem isActive={activePage == 2}>
                <Link href="/users">Пользователи</Link>
              </NavbarMenuItem>
            ) : null) as ReactNode
          }
        </NavbarMenu>
      </NavbarContent>
    </Navbar>
  );
});

export default MainNavbar;
