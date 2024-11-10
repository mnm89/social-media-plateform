import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/token";
import { UnauthorizedCard } from "@/components/unauthorized";
import { getPublicProfile } from "@/lib/api";
import ProfileCard from "@/components/fragments/profile-card";

export default async function Page({ params }) {
  const id = (await params).id;
  const token = (await cookies()).get("access_token")?.value;
  const profile = await getPublicProfile(token, id);
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileCard profile={profile} />
    </div>
  );
}
