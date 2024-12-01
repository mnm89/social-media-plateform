import { cookies } from "next/headers"

import { getPublicProfile } from "@/lib/api"
import AuthorCard from "@/components/author-card"

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const id = (await params).id
  const store = await cookies()
  const token = store.get("access_token")?.value
  const profile = await getPublicProfile(token, id)
  return (
    <div className="container mx-auto px-4 py-8">
      <AuthorCard profile={profile} />
    </div>
  )
}
