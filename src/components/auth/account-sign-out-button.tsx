"use client";

import { signOut } from "@/app/login/actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function AccountSignOutButton() {
  return <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>;
}