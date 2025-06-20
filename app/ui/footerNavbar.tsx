'use client';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/navbar';
import Link from 'next/link';
import { BotMessageSquareIcon, GithubIcon } from 'lucide-react';
import { Button } from '@heroui/button';

export default function FooterNavbar() {
  // TODO: add telegram link
  return (
    <Navbar isBordered className="relative bottom-0 gap-2">
      <NavbarContent justify="start">
        <p className="text-sm text-default-500">©LandLord 2025.</p>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            isIconOnly
            as={Link}
            variant="light"
            href="https://t.me/landlord_assistant_hse_bot"
          >
            <BotMessageSquareIcon className="stroke-default-500" />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            isIconOnly
            as={Link}
            variant="light"
            href="https://github.com/IciIcifur/landlord"
          >
            <GithubIcon className="stroke-default-500" />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
