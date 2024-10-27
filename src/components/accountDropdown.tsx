import { signOut } from "@/app/login/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { type User } from "@supabase/auth-js";
import Link from "next/link";

/**
 * Account dropdown.
 * Contains the account dropdown component, with the username and sign out button (if applicable).
 * @constructor
 */
export default async function AccountDropdown() {
  const supabase = createClient();

  const {
    data: { user },
  } = (await supabase.auth.getUser()) as { data: { user: User | null } };

  return user ? (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={`${user.user_metadata.avatar_url}`} />
          <AvatarFallback>?</AvatarFallback>{" "}
        </Avatar>
        <b>{user?.user_metadata.name}</b>
      </div>
      <form>
        <Button variant="outline" formAction={signOut}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <Link href={"/login"}>
      <Button variant="outline">Sign in</Button>
    </Link>
  );
}
