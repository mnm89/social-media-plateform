import { getPublicPosts } from "@/lib/api"
import { PostCard } from "@/components/post-card"

export default async function IndexPage() {
  const posts = await getPublicPosts()
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully stories <br className="hidden sm:inline" />
          written by awesome people.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Become a member of our community and benefit from more private content
        </p>
      </div>
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Public Posts
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
