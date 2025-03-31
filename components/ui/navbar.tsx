"use client"

import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { Heart } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

export function Navbar() {
  const { user, status, signOut } = useAuth()
  const isAuthenticated = status === "authenticated"

  // Define navigation items with implementation status
  const navItems = [
    { href: "/dashboard", label: "Dashboard", implemented: true },
    { href: "/explore", label: "Explore Themes", implemented: false },
    { href: "/pricing", label: "Pricing", implemented: false },
  ]

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-rose-500">
            <Heart className="h-6 w-6" />
            <span className="ml-2 text-xl font-bold">Hajatan</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <TooltipProvider>
                {navItems.map((item) => (
                  item.implemented ? (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className="text-sm font-medium text-gray-700 hover:text-rose-500"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()} 
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-rose-500">
                Log in
              </Link>
              <Link href="/signup">
                <Button className="bg-rose-500 hover:bg-rose-600">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 