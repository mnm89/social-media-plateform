"use server";

export async function loginAction(username, password) {
  const response = await fetch(`${process.env.API_GATEWAY_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const { access_token, refresh_token } = await response.json();
  return { access_token, refresh_token };
}
