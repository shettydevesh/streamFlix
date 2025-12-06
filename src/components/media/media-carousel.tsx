"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { MediaCard } from "@/components/media/media-card";
import { Movie, TVShow } from "@/types/tmdb";
import { Button } from "@/components/ui/button";

interface MediaCarouselProps {
    title: string;
    items: (Movie | TVShow)[];
    viewAllLink?: string;
}

export function MediaCarousel({ title, items, viewAllLink }: MediaCarouselProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-4 py-8">
            <div className="flex items-center justify-between px-4 md:px-8">
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                {viewAllLink && (
                    <Button variant="ghost" size="sm" asChild className="group">
                        <Link href={viewAllLink}>
                            View All
                            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                )}
            </div>

            <div className="px-4 md:px-8">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {items.map((item) => (
                            <CarouselItem key={item.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                                <MediaCard media={item} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 -translate-x-1/2" />
                    <CarouselNext className="right-0 translate-x-1/2" />
                </Carousel>
            </div>
        </div>
    );
}
