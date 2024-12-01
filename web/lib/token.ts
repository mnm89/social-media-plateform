import { TokenContent } from "@/types/token"

export function isTokenExpired(token: string | undefined) {
  if (!token) return true
  const payload = parseToken(token)
  if (!payload) return true
  const isExpired = payload.exp * 1000 < Date.now()
  return isExpired
}

export function parseToken(token: string | undefined): TokenContent | null {
  if (token)
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
  return null
}
