import { isAdmin } from "@/app/login/actions";
import AccountSignOutButton from "@/components/auth/account-sign-out-button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {createClient} from "@/utils/supabase/server";
import {type User} from "@supabase/auth-js";
import SignInButton from "@/components/auth/sign-in-button";

/**
 * Account dropdown.
 * Contains the account dropdown component, with the username and sign out button (if applicable).
 * @constructor
 */
export default async function AccountDropdown() {
    const supabase = await createClient();
    
    const {data: {user}} = (await supabase.auth.getUser()) as { data: { user: User | null } };
    const isUserAdmin = await isAdmin();

    if (!user) {
        return <SignInButton />
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={ `${ user.user_metadata.avatar_url }` }/>
                    <AvatarFallback>?</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                <DropdownMenuLabel>{ user.user_metadata.custom_claims.global_name ?? user.user_metadata.name ?? "My account" }</DropdownMenuLabel>
                
                <DropdownMenuSeparator/>
                
                { isUserAdmin ? (
                    <p>Admin mode</p>
                ) : null}
                
                <AccountSignOutButton/>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
