'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  Gift, 
  Heart, 
  Home, 
  Menu, 
  MessageSquare, 
  PieChart,
  Plus, 
  QrCode, 
  Settings,
  Users, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define navigation items with their implementation status
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, implemented: true },
  { href: '/dashboard/guest-management', label: 'Guests', icon: Users, implemented: true },
  { href: '/dashboard/check-in', label: 'QR Check-in', icon: QrCode, implemented: true },
  { href: '/dashboard/rsvp', label: 'RSVP', icon: MessageSquare, implemented: false },
  { href: '/dashboard/gifts', label: 'Gifts', icon: Gift, implemented: false },
  { href: '/dashboard/analytics', label: 'Analytics', icon: PieChart, implemented: false },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, implemented: true },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if a route is active (exactly matching)
  const isActive = (path: string) => pathname === path;
  
  // Check if a route is active (matching start of path)
  const isActiveSection = (path: string) => pathname.startsWith(path);
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Link className="flex items-center gap-2 font-semibold" href="/">
        <Heart className="h-6 w-6 text-rose-500" />
        <span className="hidden md:inline">Hajatan</span>
      </Link>
      
      <div className="w-full flex-1">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <TooltipProvider>
            {navItems.map((item) => (
              item.implemented ? (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={
                    isActive(item.href) || isActiveSection(item.href)
                      ? "font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <span className="text-muted-foreground/60 cursor-not-allowed">
                      {item.label}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming soon</p>
                  </TooltipContent>
                </Tooltip>
              )
            ))}
          </TooltipProvider>
        </nav>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[270px] sm:w-[300px]">
            <SheetHeader className="text-left border-b pb-5 mb-4">
              <SheetTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                <span>Hajatan</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <div key={item.href}>
                  {item.implemented ? (
                    <Link 
                      href={item.href}
                      className={`flex items-center gap-3 px-2 py-2 rounded-md ${
                        isActive(item.href) || isActiveSection(item.href)
                          ? "bg-muted font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-2 py-2 rounded-md text-muted-foreground/60 cursor-not-allowed">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                      <span className="text-xs ml-auto text-muted-foreground">Soon</span>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        
        {/* Action buttons */}
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex"
          disabled
        >
          <PieChart className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
        
        <Link href="/dashboard/weddings/new">
          <Button size="sm" className="hidden md:flex bg-rose-500 hover:bg-rose-600">
            <Plus className="mr-2 h-4 w-4" />
            New Invitation
          </Button>
        </Link>
      </div>
    </header>
  );
} 