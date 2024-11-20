'use client';
import React from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DesktopNav } from './DesktopNav';
import Image from 'next/image';
import { Button } from '../ui/button';

export const Header = () => {
  return (
    <div className="bg-white shadow-md">
      <header className='container mx-auto flex items-center justify-between p-4 '>
        <div>
          <Image src='/images/logo-small.webp' width={120} height={65} alt='lifty-logo'/>
        </div>
        <div>
          <DesktopNav />
        </div>
        <div>
          <Button variant='outline'>
            login
          </Button>
        </div>
      </header>
    </div>
  );
};
