import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPublicContent } from "@/lib/api";

import Link from "next/link";
import MarkdownIt from "markdown-it";

const PostCard = ({ post }) => {
  const content = post.content.slice(0, 600);
  const md = new MarkdownIt();
  const htmlContent = md.render(content);
  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <Link
          href={"/profiles/" + post.userId}
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
  );
};

export default async function Page() {
  const posts = await getPublicContent();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Public Posts </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
