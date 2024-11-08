import { cookies } from "next/headers";
import { UnauthorizedCard } from "@/components/unauthorized";
import { getPost } from "@/lib/api";
import { CommentForm } from "@/components/forms/comment-form";
import { isTokenExpired, parseToken } from "@/lib/token";
import CommentCard from "@/components/fragments/comment-card";
import PostCard from "@/components/fragments/post-card";

export default async function Page({ params }) {
  const id = (await params).id;
  const token = (await cookies()).get("access_token")?.value;

  if (isTokenExpired(token)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <UnauthorizedCard />
      </div>
    );
  }
  const { sub } = parseToken(token);
  const post = await getPost(token, id);
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PostCard post={post} />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        {post.comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} postId={id} />
        ))}
      </div>
      {sub !== post.userId && <CommentForm postId={id} />}
    </div>
  );
}
