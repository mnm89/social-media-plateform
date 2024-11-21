"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DeleteAvatar, UpdateAvatar } from "@/actions/profile";
import { UploadCloud, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const AvatarForm = ({ currentAvatarUrl }) => {
  const [avatar, setAvatar] = useState(currentAvatarUrl);

  const [isPending, startTransition] = useTransition(false);
  const inputRef = useRef();
  const router = useRouter();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setAvatar(URL.createObjectURL(selectedFile));
      startTransition(async () => {
        try {
          const { url } = await UpdateAvatar(selectedFile);
          setAvatar(url);
          router.refresh();
        } catch (err) {
          console.error("Error uploading avatar:", err);
          // toast error
        }
        inputRef.current.value = "";
      });
    }
  };

  const handleDelete = async () => {
    if (!currentAvatarUrl || isPending) {
      return;
    }
    startTransition(async () => {
      try {
        await DeleteAvatar();
        setAvatar(null);
        router.refresh();
      } catch (err) {
        console.error("Error deleting avatar:", err);
        // toast error
      }
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-medium">Public Avatar</h2>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col gap-2 items-center">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatar} alt="Current avatar" />
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
        <div className="flex gap-2">
          <Button
            disabled={isPending}
            size="icon"
            onClick={() => inputRef.current.click()}
          >
            <UploadCloud />
          </Button>

          <Button
            disabled={isPending || !currentAvatarUrl}
            variant="destructive"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 />
          </Button>
        </div>
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isPending}
          ref={inputRef}
        />
      </CardContent>
      <CardFooter className="justify-end">
        {isPending && "Uploading ..."}
      </CardFooter>
    </Card>
  );
};

export default AvatarForm;
