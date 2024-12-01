"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { replyToComment } from "@/actions/post"

import { Comment } from "@/types/commons"
import { formatDate } from "@/lib/date"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface ModalProps {
  commentId: string
  postId: string
  isOpen: boolean
  onClose: () => void
}

function ReplyModal({ commentId, postId, isOpen, onClose }: ModalProps) {
  const [replyText, setReplyText] = useState("")
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  async function handleReplySubmit() {
    if (!replyText.trim()) return

    startTransition(async () => {
      try {
        await replyToComment(postId, commentId, replyText)
        setReplyText("")
        router.refresh()
        onClose()
      } catch (err) {
        console.error("Error adding comment:", err)
        // toast error
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to Comment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button disabled={isPending} onClick={handleReplySubmit}>
            {isPending ? "Submitting ..." : "Submit Reply"}
          </Button>
          <Button variant="outline" disabled={isPending} onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface Props {
  comment: Comment
}

export default function CommentCard({ comment }: Props) {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)

  return (
    <>
      <Card key={comment.id} className="p-4 shadow-sm rounded-md border">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
            <AvatarFallback>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="8" r="4" fill="#fff" />
                <path
                  d="M4 20c0-3.5 4-5.5 8-5.5s8 2 8 5.5"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              </svg>
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-between">
              <Link
                href={"/profiles/" + comment.userId}
                className="text-sm font-semibold hover:underline"
              >
                {comment.authorName}
              </Link>

              <span className="text-xs text-gray-400">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{comment.content}</p>

            {/* comment replies */}
            {comment.replies?.length > 0 && (
              <div className="mt-3 space-y-2 pl-6 border-l-2 border-gray-200">
                {comment.replies.map((reply) => (
                  <Card
                    key={reply.id}
                    className="p-3 shadow-sm rounded-md bg-gray-50"
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                        />
                        <AvatarFallback>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="8" r="4" fill="#fff" />
                            <path
                              d="M4 20c0-3.5 4-5.5 8-5.5s8 2 8 5.5"
                              stroke="#fff"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Link
                            href={"/profiles/" + reply.userId}
                            className="text-xs font-semibold hover:underline"
                          >
                            {reply.authorName}
                          </Link>

                          <span className="text-xs text-gray-400">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1 text-sm">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        <CardFooter className="flex justify-end items-center p-6 pb-1">
          <Button variant="ghost" onClick={() => setIsReplyModalOpen(true)}>
            Reply
          </Button>
        </CardFooter>
      </Card>
      <ReplyModal
        commentId={comment.id}
        postId={comment.postId}
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
      />
    </>
  )
}
