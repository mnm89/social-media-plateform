"use client";
import { useTransition } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, Loader2 } from "lucide-react";
import MarkdownIt from "markdown-it";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { formatDate } from "@/lib/date";
import { useRouter } from "next/navigation";
import { likePost } from "@/actions/post";

export default function PostCard({ post }) {
  const { currentUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { authorName, createdAt, title, content, authorAvatar, likes } = post;
  const md = new MarkdownIt();
  const htmlContent = md.render(content);
  const isLiked = post.likes.map((l) => l.userId).includes(currentUser?.sub);

  const handleLike = () => {
    startTransition(async () => {
      try {
        await likePost(post.id, isLiked);
        router.refresh();
      } catch (err) {
        console.error("Error adding comment:", err);
        // toast error
      }
    });
  };
  return (
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
            <h2 className="text-lg font-semibold">{authorName}</h2>
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
        <Button
          variant={isLiked ? "" : "outline"}
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
      </CardFooter>
    </Card>
  );
}
