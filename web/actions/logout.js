"use server";

import { deleteTokens } from "@/lib/session";

export async function logoutAction() {
  await deleteTokens();
}
