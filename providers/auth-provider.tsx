"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (provider?: string, options?: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  signIn: nextAuthSignIn,
  signOut: nextAuthSignOut,
  refreshUserData: async () => {}
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as User)
    } else {
      setUser(null)
    }
  }, [session])

  const signIn = async (provider?: string, options?: any) => {
    const result = await nextAuthSignIn(provider, options)
    router.refresh()
    return result
  }

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: "/" })
    router.refresh()
    router.push("/")
  }

  const refreshUserData = async () => {
    if (status === "authenticated") {
      await update()
      router.refresh()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        signIn,
        signOut,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

