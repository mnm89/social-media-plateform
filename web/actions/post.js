"use server";
import { handleNonOkResponse } from "@/lib/api";
import { cookies } from "next/headers";

export async function addComment(postId, content) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
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
  );
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}
export async function replyToComment(postId, commentId, content) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
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
  );
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}

export async function likePost(postId, isLike = false) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
  }
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/likes/${postId}`,
    {
      method: isLike ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.ok) return isLike ? true : response.json();

  throw await handleNonOkResponse(response);
}

export async function createPost(title, content, visibility) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
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
  });
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}
