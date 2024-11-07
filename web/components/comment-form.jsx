"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { addComment } from "@/actions/post";

export const CommentForm = ({ postId }) => {
  const [commentText, setCommentText] = useState("");

  const [isPending, startTransition] = useTransition();

  async function handleAddComment() {
    if (!commentText.trim() || isPending) return; // Prevent empty comments

    startTransition(async () => {
      try {
        const comment = await addComment(postId, commentText);
        console.log({ comment });
        setCommentText("");
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
          className="mt-2 w-full bg-blue-500 text-white"
          disabled={isPending}
        >
          {isPending ? "Posting comment ..." : "Post Comment"}
        </Button>
      </CardContent>
    </Card>
  );
};
