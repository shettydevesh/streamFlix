"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative">
            <Input
                placeholder="Search movies & TV..."
                className="h-9 md:w-[300px] lg:w-[400px]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button
                size="icon"
                variant="ghost"
                type="submit"
                className="absolute right-0 top-0 h-9 w-9 text-muted-foreground"
            >
                <Search className="h-4 w-4" />
            </Button>
        </form>
    );
}

export function SearchBar() {
    return (
        <Suspense fallback={<div className="h-9 md:w-[300px] lg:w-[400px] bg-muted animate-pulse rounded-md" />}>
            <SearchInput />
        </Suspense>
    );
}
