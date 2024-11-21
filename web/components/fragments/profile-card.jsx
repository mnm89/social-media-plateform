"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth-provider";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { requestFriend } from "@/actions/friendship";

export default function ProfileCard({ profile }) {
  const {
    avatar,
    firstName,
    lastName,
    socialLinks,
    bio,
    address,
    username,
    isFriendshipExists,
    isFriend,
    id,
  } = profile;
  const { currentUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const requestFriendship = () => {
    startTransition(async () => {
      try {
        await requestFriend(id);
        router.refresh();
      } catch (err) {
        console.error("Error requesting friend:", err);
        // toast error
      }
    });
  };
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card className="p-6 flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={avatar} alt={username} />
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
          <h1 className="text-2xl font-semibold">
            {firstName} {lastName}
          </h1>
          <p className="text-gray-500">{address}</p>
        </div>
      </Card>

      <div className="justify-end flex">
        {currentUser && !isFriendshipExists && (
          <Button disabled={isPending} onClick={requestFriendship}>
            {isPending ? "Sending request ..." : "Request friendship"}
          </Button>
        )}

        {currentUser && isFriend && (
          <Button variant="outline" disabled>
            A Friend
          </Button>
        )}
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">About Me</h2>
        <p className="text-gray-700">{bio || "No bio available"}</p>
      </Card>

      {socialLinks && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Social Links</h2>
          <div className="space-y-2">
            {socialLinks.map((link) => (
              <Button
                as="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                key={link.platform}
                className="w-full"
              >
                Follow on {link.platform}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
