"use server";

import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

export default async function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center pt-20">
      <Card className="flex w-[500px] flex-col items-center">
        <CardHeader className="items-center">
          <CardTitle className="text-xl font-bold">cinéfil</CardTitle>
          <CardDescription>Hi! Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <form className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 p-2"
              formAction={() => {
                "use server";
                return login("discord");
              }}
            >
              <DiscordLogoIcon /> Sign in with Discord
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
