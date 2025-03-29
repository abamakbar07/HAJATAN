"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

interface AuthContextType {
  user: any
  status: "loading" | "authenticated" | "unauthenticated"
  signIn: (provider?: string, options?: any) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  signIn,
  signOut,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        status: status,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

