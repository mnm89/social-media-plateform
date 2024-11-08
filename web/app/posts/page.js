import { cookies } from "next/headers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/api";
import { isTokenExpired } from "@/lib/token";
import Link from "next/link";
import MarkdownIt from "markdown-it";
import { UnauthorizedCard } from "@/components/unauthorized";

const PostCard = ({ post }) => {
  const content = post.content.slice(0, 600);
  const md = new MarkdownIt();
  const htmlContent = md.render(content);
  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <p className="text-sm text-gray-500">By {post.authorName}</p>
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
  const token = (await cookies()).get("access_token")?.value;
  if (isTokenExpired(token)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <UnauthorizedCard />
      </div>
    );
  }
  const posts = await getPosts(token);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Posts ({posts.length})</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
