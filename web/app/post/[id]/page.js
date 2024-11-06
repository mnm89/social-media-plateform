import { getAccessToken } from "@/lib/session";
import { UnauthorizedCard } from "@/components/fragments/unauthorized";
import { getPost } from "@/lib/api";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { parseToken } from "@/lib/token";

export default async function Page({ params }) {
  const id = (await params).id;
  const token = await getAccessToken();

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <UnauthorizedCard />
      </div>
    );
  }
  const { sub } = parseToken(token);
  const { authorName, userId, createdAt, title, content } = await getPost(
    token,
    id
  );
  const likesCount = 5;
  const comments = [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="shadow-md rounded-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar
              src="https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
              alt={authorName}
              size="lg"
            />
            <div>
              <h2 className="text-lg font-semibold">{authorName}</h2>
              <p className="text-sm text-gray-500">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="mt-2 text-gray-700 leading-relaxed">{content}</p>
        </CardContent>

        <CardFooter className="flex items-center space-x-2">
          <ThumbsUp className="text-blue-600" />
          <span>{likesCount} Likes</span>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>

        {comments.map((comment) => (
          <Card key={comment.id} className="p-4 shadow-sm rounded-md border">
            <div className="flex items-start space-x-4">
              <Avatar
                src={comment.author.avatar}
                alt={comment.author.name}
                size="sm"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-semibold">
                    {comment.author.name}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{comment.content}</p>
                {sub === userId && (
                  <button
                    /* onClick={() => handleReply(comment.id)} */ className="text-sm text-blue-500 mt-2"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sub !== userId && (
        <Card className="p-4 shadow-md rounded-md">
          <CardContent>
            <h4 className="text-md font-medium mb-2">Add a Comment</h4>
            <Textarea placeholder="Write your comment..." rows="4" />
            <Button
              /*  onClick={handleAddComment} */
              className="mt-2 w-full bg-blue-500 text-white"
            >
              Post Comment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
