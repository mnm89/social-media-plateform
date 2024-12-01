"use server"

import { cookies } from "next/headers"

import { handleNonOkResponse } from "@/lib/api"

export async function addComment(postId: string, content: string) {
  const accessToken = (await cookies()).get("access_token")?.value

  if (!accessToken) {
    throw new Error("No access token found")
  }
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/comments/${postId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ content }),
    }
  )
  if (response.ok) return response.json()

  throw await handleNonOkResponse(response)
}
export async function replyToComment(
  postId: string,
  commentId: string,
  content: string
) {
  const accessToken = (await cookies()).get("access_token")?.value

  if (!accessToken) {
    throw new Error("No access token found")
  }
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/comments/${postId}/${commentId}/replies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ content }),
    }
  )
  if (response.ok) return response.json()

  throw await handleNonOkResponse(response)
}

export async function likePost(postId: string, isLiked = false) {
  const accessToken = (await cookies()).get("access_token")?.value

  if (!accessToken) {
    throw new Error("No access token found")
  }
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/likes/${postId}`,
    {
      method: isLiked ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  )
  if (response.ok) return isLiked ? true : response.json()

  throw await handleNonOkResponse(response)
}

export async function createPost(
  title: string,
  content: string,
  visibility: string
) {
  const accessToken = (await cookies()).get("access_token")?.value

  if (!accessToken) {
    throw new Error("No access token found")
  }
  const response = await fetch(`${process.env.API_GATEWAY_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify({
      title,
      content,
      visibility,
    }),
  })
  if (response.ok) return response.json()

  throw await handleNonOkResponse(response)
}
