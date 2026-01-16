"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "@/components/layout/search-bar";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, signInWithGoogle, signOut } = useAuth();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Film className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block">
                            StreamFlix
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/movies"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Movies
                        </Link>
                        <Link
                            href="/tv"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            TV Series
                        </Link>
                        {user && (
                            <Link
                                href="/watchlist"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                My List
                            </Link>
                        )}
                    </nav>
                </div>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                        <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                            <Film className="h-6 w-6 text-primary" />
                            <span className="font-bold">StreamFlix</span>
                        </Link>
                        <nav className="flex flex-col gap-4 mt-8">
                            <Link href="/movies" onClick={() => setIsOpen(false)}>Movies</Link>
                            <Link href="/tv" onClick={() => setIsOpen(false)}>TV Series</Link>
                            {user && <Link href="/watchlist" onClick={() => setIsOpen(false)}>My List</Link>}
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <SearchBar />
                    </div>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
                                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuItem className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.user_metadata.full_name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/watchlist">My List</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={signOut}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button onClick={signInWithGoogle} variant="secondary" size="sm" className="hidden md:flex">
                            Sign In
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
