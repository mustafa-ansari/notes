"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

function LogOutButton() {

    const {toast} = useToast();
    const [loading, setLoading] = useState(false);

    const handleLogOut = async () => {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const errorMessage = null;

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
