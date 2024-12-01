import { cookies } from "next/headers"

import { getPosts } from "@/lib/api"
import { PostCard } from "@/components/post-card"

export default async function Page() {
  const store = await cookies()
  const token = store.get("access_token")?.value

  const posts = await getPosts(token)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Posts ({posts.length})</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
