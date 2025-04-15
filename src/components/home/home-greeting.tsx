import { getUser } from "@/app/login/actions";
import { Gloock } from "next/font/google";

const gloock = Gloock({ subsets: ["latin"], weight: "400" });

export default async function HomeGreeting() {
  try {
    const user = await getUser();

    return (
      <h1 className={`${gloock.className} text-5xl`}>
        Bienvenue{" "}
        {user.user_metadata.custom_claims.global_name ??
          user.user_metadata.name ??
          ""}{" "}
        ! 🍿
      </h1>
    );
  } catch {
    return <EmptyHomeGreeting />;
  }
}

export function EmptyHomeGreeting() {
  return <h1 className={`${gloock.className} text-5xl`}>Bienvenue ! 🍿</h1>;
}