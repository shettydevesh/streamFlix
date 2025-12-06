"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <h2 className="text-xl font-semibold">Something went wrong!</h2>
            <p className="text-sm text-muted-foreground max-w-md">
                {error.message || "An error occurred while fetching data."}
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default">
                    Try again
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Page
                </Button>
            </div>
        </div>
    );
}
