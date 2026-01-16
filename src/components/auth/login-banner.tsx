"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { MonitorPlay, List, History, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoginBanner() {
    const { signInWithGoogle, loading } = useAuth();

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center justify-between gap-6 p-6 sm:flex-row">
                <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-bold tracking-tight">
                        Unlock the full experience
                    </h3>
                    <p className="text-muted-foreground">
                        Sign in to sync your watchlist, track your history, and more.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground sm:justify-start pt-2">
                        <div className="flex items-center gap-2">
                            <List className="h-4 w-4" />
                            <span>My List</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            <span>Continue Watching</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MonitorPlay className="h-4 w-4" />
                            <span>Sync Devices</span>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={signInWithGoogle}
                    disabled={loading}
                    size="lg"
                    className="min-w-[140px]"
                >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                </Button>
            </CardContent>
        </Card>
    );
}
