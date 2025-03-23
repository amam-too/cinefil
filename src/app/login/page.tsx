"use client"

import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

export default function LoginPage() {
    const onClick = async () => {
        await login("discord");
    }
    
    return (
        <div className="flex h-screen items-center justify-center pt-20">
            <Card className="flex w-[500px] flex-col items-center">
                <CardHeader className="items-center">
                    <CardTitle className="text-xl font-bold">cinéfil</CardTitle>
                    <CardDescription>Hi! Sign in to continue</CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 p-2"
                        onClick={ onClick }
                    >
                        <DiscordLogoIcon/> Sign in with Discord
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
