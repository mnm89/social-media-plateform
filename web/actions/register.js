"use server";

export async function registerAction(firstName, lastName, email, password) {
  try {
    const response = await fetch(`${process.env.API_GATEWAY_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    if (response.status === 201) {
      return { success: true, message: "Account created successfully" };
    } else {
      throw new Error("Failed to create account");
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("An error occurred while creating the account");
  }
}
