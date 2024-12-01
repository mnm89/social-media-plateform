import Link from "next/link"
import MarkdownIt from "markdown-it"

import { Post } from "@/types/commons"

import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

interface Props {
  post: Post
}

export const PostCard = ({ post }: Props) => {
  const content = post.content.slice(0, 600)
  const md = new MarkdownIt()
  const htmlContent = md.render(content)
  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <Link
          href={"/authors/" + post.userId}
          className="text-sm text-gray-500 hover:underline"
        >
          By {post.authorName}
        </Link>
      </CardHeader>
      <CardContent>
        <div
          className="text-gray-700 h-72 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
        <p> ... </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link">
          <Link href={`/posts/${post.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
