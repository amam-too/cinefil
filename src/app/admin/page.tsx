import { isAdmin } from "@/app/login/actions";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    if (!(await isAdmin())) redirect("/");
    
    return (
        <div>
            <h1>Admin page</h1>
        </div>
    )
}