"use client";

import { Card, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { formatDate } from "@/lib/date";
import { useTransition } from "react";
import * as friendshipActions from "@/actions/friendship";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function FriendshipActions({ friendship, isCurrentUserSender }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const removeFriend = () => {
    startTransition(async () => {
      try {
        await friendshipActions.removeFriend(friendship.id);
        router.refresh();
      } catch (err) {
        console.error("Error removing friend:", err);
        // toast error
      }
    });
  };

  const acceptFriend = () => {
    startTransition(async () => {
      try {
        await friendshipActions.acceptFriend(friendship.id);
        router.refresh();
      } catch (err) {
        console.error("Error accepting friend:", err);
        // toast error
      }
    });
  };
  const blockFriend = () => {
    startTransition(async () => {
      try {
        await friendshipActions.blockFriend(friendship.id);
        router.refresh();
      } catch (err) {
        console.error("Error blocking friend:", err);
        // toast error
      }
    });
  };
  if (friendship.status === "pending") {
    if (isCurrentUserSender)
      return (
        <div className="justify-end items-center gap-1 flex">
          {isPending && <Loader2 className="animate-spin" />}
          <Button asChild disabled={isPending} variant="outline">
            <Link href={"/profiles/" + friendship.friendId}>View Profile</Link>
          </Button>
          <Button
            disabled={isPending}
            variant="destructive"
            onClick={removeFriend}
          >
            Remove Request
          </Button>
        </div>
      );

    return (
      <div className="justify-end items-center gap-1 flex">
        {isPending && <Loader2 className="animate-spin" />}
        <Button asChild disabled={isPending} variant="outline">
          <Link href={"/profiles/" + friendship.userId}>View Profile</Link>
        </Button>
        <Button disabled={isPending} onClick={acceptFriend}>
          Accept
        </Button>
        <Button
          disabled={isPending}
          variant="destructive"
          onClick={blockFriend}
        >
          Block
        </Button>
      </div>
    );
  }

  if (friendship.status === "accepted") {
    if (isCurrentUserSender)
      return (
        <div className="justify-end items-center gap-1 flex">
          {isPending && <Loader2 className="animate-spin" />}
          <Button asChild disabled={isPending} variant="outline">
            <Link href={"/profiles/" + friendship.friendId}>View Profile</Link>
          </Button>
          <Button
            disabled={isPending}
            variant="destructive"
            onClick={removeFriend}
          >
            Remove Friend
          </Button>
        </div>
      );

    return (
      <div className="justify-end items-center gap-1 flex">
        {isPending && <Loader2 className="animate-spin" />}
        <Button asChild disabled={isPending} variant="outline">
          <Link href={"/profiles/" + friendship.userId}>View Profile</Link>
        </Button>
        <Button
          disabled={isPending}
          variant="destructive"
          onClick={blockFriend}
        >
          Block
        </Button>
      </div>
    );
  }

  if (friendship.status === "blocked") {
    if (isCurrentUserSender)
      return (
        <div className="justify-end items-center gap-1 flex">
          {isPending && <Loader2 className="animate-spin" />}
          <Button
            disabled={isPending}
            variant="destructive"
            onClick={removeFriend}
          >
            Remove Request
          </Button>
        </div>
      );

    return (
      <div className="justify-end items-center gap-1 flex">
        {isPending && <Loader2 className="animate-spin" />}
        <Button disabled={isPending} onClick={acceptFriend}>
          Accept
        </Button>
      </div>
    );
  }

  return <>Unknown status</>;
}

function FriendShipStatus({ friendship, isCurrentUserSender }) {
  if (friendship.status === "pending") {
    if (isCurrentUserSender)
      return <p className="text-gray-500">Not yet answered</p>;
    return <p className="text-gray-500">Waiting for your answer</p>;
  }
  if (friendship.status === "blocked") {
    if (isCurrentUserSender)
      return <p className="text-gray-500">Blocked your request</p>;
    return <p className="text-gray-500">Was blocked by you</p>;
  }
  if (friendship.status === "accepted") {
    if (isCurrentUserSender)
      return <p className="text-gray-500">Accepted your request</p>;
    return <p className="text-gray-500">Was accepted by you</p>;
  }

  return <>Unknown status</>;
}

export default function FriendshipCard({ friendship }) {
  const { currentUser } = useAuth();

  const isCurrentUserSender = currentUser?.sub === friendship.userId;
  const friend = {
    name: isCurrentUserSender ? friendship.friendName : friendship.senderName,
    avatar: isCurrentUserSender
      ? friendship.friendAvatar
      : friendship.senderAvatar,
  };
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
        <FriendShipStatus
          isCurrentUserSender={isCurrentUserSender}
          friendship={friendship}
        />
      </div>

      <CardFooter>
        <div className="flex-col flex gap-3">
          <p className="text-end">{formatDate(friendship.createdAt)}</p>
          <FriendshipActions
            isCurrentUserSender={isCurrentUserSender}
            friendship={friendship}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
