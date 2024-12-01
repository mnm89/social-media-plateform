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
export interface Post {
  createdAt: string
  content: string
  title: string
  userId: string
  authorName: string
  authorAvatar: string
  id: string
  likes: Like[]
  comments: Comment[]
}
export interface Like {
  id: string
  userId: string
}
export interface Comment {
  createdAt: string
  content: string
  id: string
  userId: string
  postId: string
  replies: Comment[]
  authorName: string
  authorAvatar: string
}
