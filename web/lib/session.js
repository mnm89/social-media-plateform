import { cookies } from "next/headers";

export async function getAccessToken() {
  return (await cookies()).get("accessToken")?.value;
}
export async function getRefreshToken() {
  return (await cookies()).get("refreshToken")?.value;
}
export async function setTokens(access_token, refresh_token) {
  (await cookies()).set("accessToken", access_token);
  (await cookies()).set("refreshToken", refresh_token);
}
export async function deleteTokens() {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
}
