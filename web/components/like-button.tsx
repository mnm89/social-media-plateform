"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { likePost } from "@/actions/post"
import { Loader2, ThumbsUp } from "lucide-react"

import { Post } from "@/types/commons"
import { useAuth } from "@/components/auth-provider"

import { Button } from "./ui/button"

interface Props {
  post: Post
}
export function LikeButton({ post }: Props) {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [isPending, startTransition] = useTransition()

  const isLiked = post.likes
    .map((l) => l.userId)
    .includes(currentUser ? currentUser.sub : "not-found")
  const handleLike = () => {
    startTransition(async () => {
      try {
        await likePost(post.id, isLiked)
        router.refresh()
      } catch (err) {
        console.error("Error adding comment:", err)
        // toast error
      }
    })
  }
  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="icon"
      className="border-primary"
      onClick={handleLike}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className={`animate-spin text-primary`} />
      ) : (
        <ThumbsUp
          className={isLiked ? "text-primary-foreground" : "text-primary"}
        />
      )}
    </Button>
  )
}
