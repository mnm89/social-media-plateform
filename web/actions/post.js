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
      },
      body: JSON.stringify({ content }),
    }
  );
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}
