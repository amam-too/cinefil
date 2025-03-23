import AccountDropdown from "@/components/auth/account-dropdown";
import logo from "@/public/logo.svg";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Navbar() {
    return (
        <div className="flex items-center justify-between w-full h-16 px-12 backdrop-blur-2xl">
            <div className="flex items-center">
                <Link href="/" className="px-4">
                    <Image src={ logo } alt="cinéfil logo" width={ 75 } height={ 75 }/>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/search" className="flex items-center gap-2">
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