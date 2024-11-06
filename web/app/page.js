import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPosts, getPublicContent } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import Link from "next/link";

const PostCard = ({ post }) => {
  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <p className="text-sm text-gray-500">By {post.authorName}</p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{post.content.slice(0, 100)}...</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link">
          <Link href={`/post/${post.id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default async function Home() {
  const token = await getAccessToken();
  const posts = token ? await getPosts(token) : await getPublicContent();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Posts ({posts.length})</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
