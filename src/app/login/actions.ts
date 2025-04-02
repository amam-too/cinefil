"use server";

import { createClient } from "@/utils/supabase/server";
import { type Provider, type User } from "@supabase/auth-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(provider: Provider) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://cinefil.byar.fr"}/api/auth/callback`,
    },
  });

  if (error) {
    console.error(
      `An error occurred while logging in the user. More info: ${JSON.stringify(error)}`,
    );
  } else {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return null;
  }

  return userData.user;
}