export interface Tokens {
  access_token: string
  refresh_token: string
}
export interface TokenContent {
  sub: string
  aud: string[]
  exp: number
  iat: number
  iss: string
  [key: string]: unknown // Add other possible properties dynamically if needed
}
