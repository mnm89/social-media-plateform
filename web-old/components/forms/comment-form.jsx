"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { addComment } from "@/actions/post";
import { useRouter } from "next/navigation";

export const CommentForm = ({ postId }) => {
  const [commentText, setCommentText] = useState("");

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleAddComment() {
    if (!commentText.trim() || isPending) return; // Prevent empty comments

    startTransition(async () => {
      try {
        await addComment(postId, commentText);
        setCommentText("");
        router.refresh();
      } catch (err) {
        console.error("Error adding comment:", err);
        // toast error
      }
    });
  }

  return (
    <Card className="p-4 shadow-md rounded-md">
      <CardContent>
        <h4 className="text-md font-medium mb-2">Add a Comment</h4>
        <Textarea
          placeholder="Write your comment..."
          rows="4"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          onClick={handleAddComment}
          className="mt-2 w-full"
          disabled={isPending}
        >
          {isPending ? "Posting comment ..." : "Post Comment"}
        </Button>
      </CardContent>
    </Card>
  );
};
