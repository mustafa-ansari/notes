"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logOutAction } from "@/actions/users";

function LogOutButton() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogOut = async () => {
        setLoading(true);

        const {errorMessage} = await logOutAction();

        if (!errorMessage) {
            toast.success("Logged out", {
                description: "You have been successfully logged out",
            });
            router.push("/");
        } else {
            toast.error("Error", {
                description: errorMessage
            });
        }

        setLoading(false);
    }

    return (
        <Button 
        variant="outline" 
        className="w-24"
        onClick={handleLogOut}
        disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Log out"}
        </Button>
    )
}

export default LogOutButton
