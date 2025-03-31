'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calendar, 
  ChevronLeft,
  ChevronRight,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  // Check if a route is active (exactly matching)
  const isActive = (path: string) => pathname === path;
  
  // Check if a route is active (matching start of path)
  const isActiveSection = (path: string) => pathname.startsWith(path);
  
  return (
    <aside className={cn(
      "flex flex-col h-screen border-r bg-background sticky top-0 transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="flex h-16 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Heart className="h-6 w-6 text-rose-500" />
          {!collapsed && <span>Hajatan</span>}
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <div>
                  {item.implemented ? (
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                        (isActive(item.href) || isActiveSection(item.href))
                          ? "bg-muted font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground/60 cursor-not-allowed">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span>{item.label}</span>
                          <span className="text-xs ml-auto">Soon</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>{item.label} {!item.implemented && "(Coming Soon)"}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      
      <div className="mt-auto p-4 border-t">
        <Link href="/dashboard/weddings/new">
          <Button size="sm" className={cn(
            "bg-rose-500 hover:bg-rose-600 w-full",
            collapsed ? "justify-center p-2" : ""
          )}>
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">New Invitation</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
} 