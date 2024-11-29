import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { replyToComment } from "@/actions/post";

export default function CommentReplyModal({
  commentId,
  postId,
  isOpen,
  onClose,
}) {
  const [replyText, setReplyText] = useState("");
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  async function handleReplySubmit() {
    if (!replyText.trim()) return;

    startTransition(async () => {
      try {
        await replyToComment(postId, commentId, replyText);
        setReplyText("");
        router.refresh();
        onClose();
      } catch (err) {
        console.error("Error adding comment:", err);
        // toast error
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to Comment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button disabled={isPending} onClick={handleReplySubmit}>
            {isPending ? "Submitting ..." : "Submit Reply"}
          </Button>
          <Button variant="outline" disabled={isPending} onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
