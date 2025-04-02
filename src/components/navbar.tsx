import AccountDropdown from "@/components/auth/account-dropdown";
import logo from "@/public/logo.svg";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LinearBlur } from "progressive-blur";
import { Suspense } from "react";
import CampaignInfo from "@/components/campaign/campaign-info";

export default function Navbar() {
  return (
    <div className="fixed top-0 z-20 flex w-full items-center justify-between px-12 py-6">
      <LinearBlur
        className="absolute inset-y-0 -mx-12 h-28 w-full"
        steps={8}
        strength={95}
        falloffPercentage={120}
        side="top"
      />
      <div className="z-30 flex items-center">
        <Link href="/" className="px-4">
          <Image src={logo} alt="cinéfil logo" width={75} height={75} />
        </Link>
      </div>
      <Suspense fallback={null}>
        <CampaignInfo />
      </Suspense>
      <div className="z-30 flex items-center gap-4">
        <Link
          href="/search"
          className="flex cursor-pointer select-none items-center gap-2 rounded-full p-2 transition-all hover:bg-white/10 hover:px-4"
        >
          <SearchIcon />
          Search
        </Link>
        <Suspense fallback={null}>
          <AccountDropdown />
        </Suspense>
      </div>
    </div>
  );
}