"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Genre } from "@/types/tmdb";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    genres: Genre[];
}

const SORT_OPTIONS = [
    { label: "Popularity Desc", value: "popularity.desc" },
    { label: "Popularity Asc", value: "popularity.asc" },
    { label: "Rating Desc", value: "vote_average.desc" },
    { label: "Rating Asc", value: "vote_average.asc" },
    { label: "Release Date Desc", value: "primary_release_date.desc" },
    { label: "Release Date Asc", value: "primary_release_date.asc" },
    { label: "Title A-Z", value: "original_title.asc" },
];

export function FilterBar({ genres }: FilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get("sort") || "popularity.desc";
    const currentGenres = searchParams.get("genres")?.split(",") || [];

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    const toggleGenre = (genreId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const newGenres = currentGenres.includes(genreId)
            ? currentGenres.filter((id) => id !== genreId)
            : [...currentGenres, genreId];

        if (newGenres.length > 0) {
            params.set("genres", newGenres.join(","));
        } else {
            params.delete("genres");
        }

        // Reset page when filtering
        params.delete("page");

        router.push(`?${params.toString()}`);
    };

    const handleSortChange = (value: string) => {
        router.push(`?${createQueryString("sort", value)}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                    <div className="flex w-max space-x-2">
                        <Button
                            variant={currentGenres.length === 0 ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete("genres");
                                params.delete("page");
                                router.push(`?${params.toString()}`);
                            }}
                            className="rounded-full"
                        >
                            All
                        </Button>
                        {genres.map((genre) => (
                            <Button
                                key={genre.id}
                                variant={currentGenres.includes(genre.id.toString()) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleGenre(genre.id.toString())}
                                className="rounded-full"
                            >
                                {genre.name}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
