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
    const { email, password } = Object.fromEntries(formData);

    const resp = await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });

    return "Success";
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "CredentialsSignin";
        default:
          return "Something went wrong.";
      }
    }
    //throw the error to get redirected
    throw error;
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      //callbackUrl: "/",
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al iniciar sesión",
    };
  }
};
