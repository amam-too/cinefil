import AccountDropdown from "@/components/auth/account-dropdown";
import logo from "@/public/logo.svg";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LinearBlur } from "progressive-blur";
import { Suspense } from "react";

export default function Navbar() {
    return (
        <div className="flex items-center fixed top-0 z-20 justify-between w-full px-12 py-6">
            <LinearBlur
                className="absolute inset-y-0 w-full -mx-12  h-28"
                steps={8}
                strength={95}
                falloffPercentage={120}
                side="top"
            />
            <div className="flex items-center z-30">
                <Link href="/" className="px-4">
                    <Image src={ logo } alt="cinéfil logo" width={ 75 } height={ 75 }/>
                </Link>
            </div>
            <div className="flex items-center gap-4 z-30">
                <Link href="/search" className="flex items-center gap-2 cursor-pointer select-none hover:bg-white/10 p-2 rounded-full transition-all hover:px-4">
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