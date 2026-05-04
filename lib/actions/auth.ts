"use server";
import { signIn, signOut } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Credenciales inválidas" };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
