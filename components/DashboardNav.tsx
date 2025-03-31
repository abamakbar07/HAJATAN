'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Heart, 
  Home,
  Plus, 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Link className="flex items-center gap-2 font-semibold" href="/">
        <Heart className="h-6 w-6 text-rose-500" />
        <span>Hajatan</span>
      </Link>
      
      <div className="w-full flex-1">
        <nav className="flex items-center gap-6 text-sm">
          <Link 
            href="/dashboard"
            className={pathname.startsWith('/dashboard') ? "font-medium" : "text-muted-foreground hover:text-foreground"}
          >
            Dashboard
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-2">
        <Link href="/dashboard/weddings/new">
          <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
            <Plus className="mr-2 h-4 w-4" />
            New Invitation
          </Button>
        </Link>
      </div>
    </header>
  );
} 