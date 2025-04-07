"use client";

import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

export default function SignInButton() {
    const onClick = async () => {
        await login("discord");
    };
    
    return (
        <Button variant="ghost" onClick={ onClick } className="flex items-center gap-2 cursor-pointer select-none hover:bg-white/10 p-2 rounded-full transition-all hover:px-4">
            <DiscordLogoIcon/>
            Sign in with Discord
        </Button>
    );
}
