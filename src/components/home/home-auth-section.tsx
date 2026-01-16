"use client";

import { useAuth } from "@/context/auth-context";
import { ContinueWatchingRow } from "@/components/media/continue-watching-row";
import { LoginBanner } from "@/components/auth/login-banner";

export function HomeAuthSection() {
    const { user, loading } = useAuth();

    if (loading) return null; // or a skeleton

    return (
        <div className="space-y-8">
            {user ? <ContinueWatchingRow /> : <LoginBanner />}
        </div>
    );
}
