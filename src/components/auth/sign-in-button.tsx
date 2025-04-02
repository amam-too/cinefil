"use client";

import { Button } from "@/components/ui/button";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { login } from "@/app/login/actions";

export default function SignInButton() {
  const onClick = async () => {
    await login("discord");
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 p-2"
      onClick={onClick}
    >
      <DiscordLogoIcon /> Sign in with Discord
    </Button>
  );
}
