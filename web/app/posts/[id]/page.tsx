import { cookies } from "next/headers"
import Link from "next/link"
import MarkdownIt from "markdown-it"

import { getPost } from "@/lib/api"
import { formatDate } from "@/lib/date"
import { isTokenExpired, parseToken } from "@/lib/token"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import CommentCard from "@/components/comment-card"
import { CommentForm } from "@/components/comment-form"
import { LikeButton } from "@/components/like-button"

interface Props {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: Props) {
  const id = (await params).id
  const store = await cookies()
  const token = store.get("access_token")?.value
  const parsedToken = parseToken(token)
  const isTokenValid = !!parseToken && !isTokenExpired(token)
  const post = await getPost(token, id)

  const { authorName, createdAt, title, content, authorAvatar, likes } = post
  const md = new MarkdownIt()
  const htmlContent = md.render(content)
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="shadow-md rounded-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={authorAvatar} />
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
            <div>
              <Link
                href={"/profiles/" + post.userId}
                className="text-lg font-semibold hover:underline"
              >
                {authorName}
              </Link>

              <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <div
            className="mt-2 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          ></div>
        </CardContent>

        <CardFooter className="flex items-center justify-end space-x-2">
          <span>{likes.length} Likes</span>
          {isTokenValid && <LikeButton post={post} />}
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        {post.comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
      {isTokenValid && parsedToken?.sub !== post.userId && (
        <CommentForm postId={id} />
      )}
    </div>
  )
}
