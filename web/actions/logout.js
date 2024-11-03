"use server";

import { cookies } from "next/headers";
import { sessionOptions } from "../lib/session";
import { getIronSession } from "iron-session/edge";

export async function logoutAction() {
  const session = await getIronSession({ cookies }, sessionOptions);
  await session.destroy();
}
