import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/token";
import { UnauthorizedCard } from "@/components/unauthorized";

export default async function Page({ params }) {
  const id = (await params).id;
  const token = (await cookies()).get("access_token")?.value;
  if (isTokenExpired(token)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <UnauthorizedCard />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile {id}</h1>
    </div>
  );
}
