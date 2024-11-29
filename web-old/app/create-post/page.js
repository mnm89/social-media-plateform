import { cookies } from "next/headers";
import { isTokenExpired } from "@/lib/token";
import { UnauthorizedCard } from "@/components/unauthorized";
import PostForm from "@/components/forms/post-form";

export default async function Page() {
  const token = (await cookies()).get("access_token")?.value;
  if (isTokenExpired(token)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <UnauthorizedCard />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Create a New Post</h1>
      <PostForm />
    </div>
  );
}
