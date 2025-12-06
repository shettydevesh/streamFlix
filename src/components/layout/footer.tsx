import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-8 md:py-12">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center space-x-2">
                        <Film className="h-6 w-6 text-primary" />
                        <span className="font-bold">StreamFlix</span>
                    </div>
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by <span className="font-medium underline underline-offset-4">StreamFlix Team</span>.
                        The source code is available on <Link href="#" className="font-medium underline underline-offset-4">GitHub</Link>.
                        Data provided by <Link href="https://www.themoviedb.org/" className="font-medium underline underline-offset-4">TMDB</Link>.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-sm text-muted-foreground hover:underline">Terms</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:underline">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
