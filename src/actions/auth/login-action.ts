"use server";

import { signIn } from "@/auth.config";
import { sleep } from "@/utils/sleep";
import { AuthError } from "next-auth";

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    //await sleep(2);

    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "CredentialsSignin";
        default:
          return "Something went wrong.";
      }
    }
  }
}
