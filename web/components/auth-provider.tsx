"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react"
import { useRouter } from "next/navigation"
import { logoutAction } from "@/actions/auth"

import { parseToken } from "@/lib/token"
import useTokenManagement from "@/hooks/use-token-management"

interface IAuthContext {
  currentUser?: Record<string, string> | null
  logout?: () => void
}

const AuthContext = createContext<IAuthContext>({})

interface AuthProviderProps {
  user?: Record<string, string> | null
  children: React.ReactNode
}

export function AuthProvider({ children, user }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState(user)
  const { accessToken, clearTokens } = useTokenManagement()
  const [, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    setCurrentUser(accessToken ? parseToken(accessToken) : null)
  }, [accessToken])

  function logout() {
    router.replace("/")
    startTransition(async () => {
      await logoutAction()
      clearTokens()
      setCurrentUser(null)
      router.refresh()
    })
  }

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
