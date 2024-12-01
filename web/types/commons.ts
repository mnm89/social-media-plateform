export interface Profile {
  avatar: string
  firstName: string
  lastName: string
  socialLinks: { url: string; platform: string }[]
  bio: string
  address: string
  username: string
  isFriendshipExists: boolean
  isFriend: boolean
  id: string
}
