"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchMulti, getImage } from "@/lib/tmdb";
import { Movie, TVShow } from "@/types/tmdb";
import Image from "next/image";

function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<(Movie | TVShow)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Initial query sync
    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.trim()) {
                setIsLoading(true);
                try {
                    const data = await searchMulti(query);
                    setResults(data.results.slice(0, 5)); // Limit to 5 results
                    setShowResults(true);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(false);
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleResultClick = (item: Movie | TVShow) => {
        setShowResults(false);
        const type = item.media_type === "movie" ? "movies" : "tv";
        router.push(`/${type}/${item.id}`);
    };

    return (
        <div ref={searchRef} className="relative w-full md:w-[300px] lg:w-[400px]">
            <form onSubmit={handleSearch} className="relative">
                <Input
                    placeholder="Search movies & TV..."
                    className="h-9 w-full pr-10"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => {
                        if (query.trim() && results.length > 0) setShowResults(true);
                    }}
                />
                <Button
                    size="icon"
                    variant="ghost"
                    type="submit"
                    className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:bg-transparent"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                </Button>
            </form>

            {showResults && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md z-50">
                    <div className="p-1">
                        {results.map((item) => {
                            const title = "title" in item ? item.title : item.name;
                            const date = "release_date" in item ? item.release_date : item.first_air_date;
                            const year = date ? new Date(date).getFullYear() : "";

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleResultClick(item)}
                                    className="flex cursor-pointer items-center gap-3 rounded-sm p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    <div className="relative h-12 w-8 flex-shrink-0 overflow-hidden rounded-sm bg-muted">
                                        <Image
                                            src={getImage(item.poster_path, "w185")}
                                            alt={title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="truncate font-medium">{title}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {item.media_type === "movie" ? "Movie" : "TV"} {year && `• ${year}`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export function SearchBar() {
    return (
        <Suspense fallback={<div className="h-9 md:w-[300px] lg:w-[400px] bg-muted animate-pulse rounded-md" />}>
            <SearchInput />
        </Suspense>
    );
}
