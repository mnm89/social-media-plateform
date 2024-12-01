export function isTokenExpired(token: string) {
  if (!token) return true
  const payload = parseToken(token)
  const isExpired = payload.exp * 1000 < Date.now()
  return isExpired
}

export function parseToken(token: string | undefined) {
  if (token)
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
  return null
}
