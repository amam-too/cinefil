import AccountDropdown from "@/components/accountDropdown";
import Search from "@/components/search";

export default function Navbar() {
    return (
        <div className="flex items-center justify-between w-full h-16 px-12 text-white backdrop-blur-2xl">
            <div className="flex items-center">
                <h1 className="text-xl font-bold">cinéfil</h1>
            </div>
            <div className="flex items-center gap-4">
                <Search placeholder={ "Search movies..." }/>
                <AccountDropdown/>
            </div>
        </div>
    )
}