import FriendshipCard from "@/components/fragments/friendship-card";
import { UnauthorizedCard } from "@/components/unauthorized";
import { getFriends } from "@/lib/api";
import { isTokenExpired } from "@/lib/token";
import { cookies } from "next/headers";

export default async function FriendsList() {
  const token = (await cookies()).get("access_token")?.value;

  if (isTokenExpired(token)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <UnauthorizedCard />
      </div>
    );
  }

  const friendships = await getFriends(token);
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">
        Your Friends
        <br />
        <span className="text-xs font-light">
          People who can see and react to your friends-only content
        </span>
      </h1>
      <div className="space-y-2">
        {friendships.map((friendship) => (
          <FriendshipCard key={friendship.id} friendship={friendship} />
        ))}
      </div>
    </div>
  );
}
