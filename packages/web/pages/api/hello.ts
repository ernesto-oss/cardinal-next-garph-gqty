import type { NextApiRequest, NextApiResponse } from "next";

import { auth } from "@acme/auth";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

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

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    response.status(200).json({ message: "Done!" });

    console.log(session);
  } catch (error) {
    console.error(error);
  }
}
