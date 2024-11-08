"use client";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createPost } from "@/actions/post";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the Markdown editor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    startTransition(async () => {
      try {
        const { id } = await createPost(title, content, visibility);
        router.push("/post/" + id);
      } catch (err) {
        console.error("Error creating a post", err);
        // toast error
      }
    });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Post Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the title"
          required
        />
      </div>
      <div>
        <label
          htmlFor="visibility"
          className="block text-sm font-medium text-gray-700"
        >
          Post Visibility
        </label>
        <Select value={visibility} onValueChange={setVisibility}>
          <SelectTrigger className="w-full">
            <span>
              {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="friends-only">Friends-only</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Post Content
        </label>
        <MDEditor
          value={content}
          onChange={setContent}
          height={400}
          placeholder="Write your content in Markdown..."
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button disabled={isPending} type="submit">
          {isPending ? "Creating post ..." : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
