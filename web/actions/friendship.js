"use server";
import { handleNonOkResponse } from "@/lib/api";
import { cookies } from "next/headers";

export async function removeFriend(friendshipId) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
  }
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/friendships/${friendshipId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.ok) return true;

  throw await handleNonOkResponse(response);
}
export async function acceptFriend(friendshipId) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
  }
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/friendships/accept/${friendshipId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}
export async function blockFriend(friendshipId) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
  }
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/friendships/block/${friendshipId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}
export async function requestFriend(friendId) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
  }
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/friendships/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ friendId }),
    }
  );
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}
