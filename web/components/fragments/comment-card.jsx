"use client";
import CommentReplyModal from "@/components/modals/reply-modal";
import { Card, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatDate } from "@/lib/date";
import Link from "next/link";
export default function CommentCard({ comment, postId }) {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

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
      <CommentReplyModal
        commentId={comment.id}
        postId={postId}
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
      />
    </>
  );
}
