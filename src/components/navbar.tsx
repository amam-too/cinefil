import AccountDropdown from "@/components/auth/account-dropdown";
import logo from "@/public/logo.svg";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Navbar() {
    return (
        <div className="flex items-center fixed top-0 z-10 justify-between w-full px-12 py-6">
            <div className="flex items-center">
                <Link href="/" className="px-4">
                    <Image src={ logo } alt="cinéfil logo" width={ 75 } height={ 75 }/>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/search" className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-full transition-all hover:px-4">
                    <SearchIcon/>
                    Search
                </Link>
                <Suspense fallback={ null }>
                    <AccountDropdown/>
                </Suspense>
            </div>
        </div>
    )
}