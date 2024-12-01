import Link from "next/link"
import MarkdownIt from "markdown-it"

import { getPublicPosts } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const PostCard = ({ post }: any) => {
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

export default async function IndexPage() {
  const posts = await getPublicPosts()
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully stories <br className="hidden sm:inline" />
          written by awesome people.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Become a member of our community and benefit from more private content
        </p>
      </div>
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Public Posts
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
