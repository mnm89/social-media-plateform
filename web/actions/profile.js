"use server";
import { handleNonOkResponse } from "@/lib/api";
import { cookies } from "next/headers";

export async function UpdateAvatar(file) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
  }
  const formData = new FormData();
  formData.append("file", file);

  let response = await fetch(`${process.env.API_GATEWAY_URL}/avatars`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    body: formData,
  });

  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}
export async function DeleteAvatar() {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  let response = await fetch(`${process.env.API_GATEWAY_URL}/avatars`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  if (response.ok) return true;

  throw await handleNonOkResponse(response);
}

export async function UpdateProfilePrivacy(profile, privacy) {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found");
  }
  const response = await fetch(
    `${process.env.API_GATEWAY_URL}/profiles/privacy`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ profile, privacy }),
    }
  );
  if (response.ok) return response.json();

  throw await handleNonOkResponse(response);
}
