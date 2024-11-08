"use client";

import { Card, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { formatDate } from "@/lib/date";

function FriendshipCardActions({ friendship }) {
  const { currentUser } = useAuth();
  const isCurrentUserSender = currentUser?.sub === friendship.userId;
  if (friendship.status === "pending") {
    if (isCurrentUserSender)
      return (
        <div className="justify-end items-center gap-1 flex">
          <Button variant="outline">View Profile</Button>
          <Button variant="destructive">Remove Request</Button>
        </div>
      );

    return (
      <div className="justify-end items-center gap-1 flex">
        <Button variant="outline">View Profile</Button>
        <Button>Accept</Button>
        <Button variant="destructive">Block</Button>
      </div>
    );
  }

  if (friendship.status === "accepted") {
    if (isCurrentUserSender)
      return (
        <div className="justify-end items-center gap-1 flex">
          <Button variant="outline">View Profile</Button>
          <Button variant="destructive">Remove Friend</Button>
        </div>
      );

    return (
      <div className="justify-end items-center gap-1 flex">
        <Button variant="outline">View Profile</Button>
        <Button variant="destructive">Block</Button>
      </div>
    );
  }

  if (friendship.status === "blocked") {
    if (isCurrentUserSender)
      return (
        <div className="justify-end items-center gap-1 flex">
          <Button variant="destructive">Remove Request</Button>
        </div>
      );

    return (
      <div className="justify-end items-center gap-1 flex">
        <Button>Accept</Button>
      </div>
    );
  }

  return <>Unknown status</>;
}

export default function FriendshipCard({ friendship }) {
  const { currentUser } = useAuth();

  const friend = {
    name:
      currentUser?.sub == friendship.userId
        ? friendship.friendName
        : friendship.senderName,
    avatar:
      currentUser?.sub == friendship.userId
        ? friendship.friendAvatar
        : friendship.senderAvatar,
  };
  const status =
    friendship.status !== "pending"
      ? friendship.status
      : `${
          friendship.userId === currentUser?.sub
            ? "request sent"
            : "send you a request"
        }`;
  return (
    <Card className="p-1 flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={friend.avatar} alt={friend.name} />
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
      <div className="flex-1">
        <p className="text-lg font-medium">{friend.name}</p>
        <p className="text-gray-500">{status}</p>
      </div>

      <CardFooter>
        <div className="flex-col flex gap-3">
          <p className="text-end">{formatDate(friendship.createdAt)}</p>
          <FriendshipCardActions friendship={friendship} />
        </div>
      </CardFooter>
    </Card>
  );
}
