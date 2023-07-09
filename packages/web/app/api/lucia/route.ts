import type { NextRequest } from "next/server";

import { auth } from "@acme/auth";

export const runtime = "nodejs";

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await auth.createUser({
      key: {
        providerId: "email", // auth method
        providerUserId: email, // unique id when using "username" auth method
        password, // hashed by Lucia
      },
      attributes: {
        email,
      },
    });

    console.log(user);
  } catch (error) {
  }
};
