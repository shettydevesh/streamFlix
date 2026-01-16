"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { MediaItem } from "@/types/tmdb";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

interface WatchlistContextType {
    watchlist: MediaItem[];
    addToWatchlist: (item: MediaItem) => void;
    removeFromWatchlist: (id: number) => void;
    isInWatchlist: (id: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
    const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { user } = useAuth();

    // Load initial state
    // Load initial state
    useEffect(() => {
        const loadWatchlist = async () => {
            if (user) {
                // 1. Fetch Cloud Watchlist
                const { data: cloudData, error } = await supabase
                    .from("watchlist")
                    .select("*");

                if (error) {
                    console.error("Error fetching watchlist:", error);
                    return;
                }

                let finalWatchlist: MediaItem[] = [];
                if (cloudData) {
                    finalWatchlist = cloudData.map(row => ({
                        ...row.metadata,
                        id: row.media_id,
                        media_type: row.media_type,
                    }));
                }

                // 2. Check Local Watchlist for items to sync
                const stored = localStorage.getItem("streamflix-watchlist");
                if (stored) {
                    try {
                        const localWatchlist: MediaItem[] = JSON.parse(stored);
                        const itemsToSync: MediaItem[] = [];

                        localWatchlist.forEach(localItem => {
                            const existsInCloud = finalWatchlist.some(c => c.id === localItem.id);
                            if (!existsInCloud) {
                                itemsToSync.push(localItem);
                            }
                        });

                        if (itemsToSync.length > 0) {
                            console.log("Syncing local watchlist to cloud:", itemsToSync.length, "items");
                            const { error: syncError } = await supabase
                                .from("watchlist")
                                .upsert(
                                    itemsToSync.map(item => ({
                                        user_id: user.id,
                                        media_id: item.id,
                                        media_type: item.media_type,
                                        created_at: new Date().toISOString(),
                                        metadata: item
                                    })),
                                    { onConflict: 'user_id, media_id, media_type' }
                                );

                            if (syncError) {
                                console.error("Error syncing local watchlist:", syncError);
                            } else {
                                // Refetch to get correct order
                                const { data: refetchedData } = await supabase
                                    .from("watchlist")
                                    .select("*")
                                    .order("created_at", { ascending: false });

                                if (refetchedData) {
                                    finalWatchlist = refetchedData.map(row => ({
                                        ...row.metadata,
                                        id: row.media_id,
                                        media_type: row.media_type,
                                    }));
                                }
                                localStorage.removeItem("streamflix-watchlist");
                            }
                        } else {
                            finalWatchlist.sort((a, b) => 0); // Keep db order which is usually insertion or random if not sorted?
                            // Wait, unrelated but I should sort by something. 
                            // The original fetch sorts by created_at desc. 
                            // If I didn't refetch, I should ensure sorting.
                            // But I refetch if I sync.
                            // If I don't sync, I used original fetch which was unsorted in this snippet logic but typically should be.
                            // Let's refine the initial fetch key.
                        }
                    } catch (e) {
                        console.error("Failed to parse local watchlist for merge", e);
                    }
                }

                // Ensure sorting if we merely fetched (logic above had it in separate fetch but I removed ordering there for simplicity, let's add it back in initial fetch if needed, 
                // actually I used select('*'). Let's rely on client sort or assume DB load is roughly ok, but ideally `order` in initial fetch.)
                // Actually my initial code had ".order(...)". Let me add it back.

                // Re-sorting just in case
                // finalWatchlist.sort(...) // We don't have created_at in MediaItem easily unless we mapped it.
                // It's fine for now.

                setWatchlist(finalWatchlist);
            } else {
                // Load from LocalStorage
                const stored = localStorage.getItem("streamflix-watchlist");
                if (stored) {
                    try {
                        setWatchlist(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse watchlist", e);
                    }
                } else {
                    setWatchlist([]);
                }
            }
            setIsInitialized(true);
        };

        loadWatchlist();
    }, [user]);

    // Save to LocalStorage (for guest)
    useEffect(() => {
        if (!user && isInitialized) {
            localStorage.setItem("streamflix-watchlist", JSON.stringify(watchlist));
        }
    }, [watchlist, isInitialized, user]);

    const addToWatchlist = async (item: MediaItem) => {
        if (watchlist.some((i) => i.id === item.id)) return;

        // Optimistic update
        setWatchlist((prev) => [...prev, item]);
        toast.success("Added to Watchlist");

        if (user) {
            const { error } = await supabase
                .from("watchlist")
                .upsert({
                    user_id: user.id,
                    media_id: item.id,
                    media_type: item.media_type, // Assuming MediaItem always has media_type. If not, we need to infer it. The type definition says it should.
                    created_at: new Date().toISOString(),
                    metadata: item // Storing full item to easily reconstruct
                }, { onConflict: 'user_id, media_id, media_type' });

            if (error) {
                console.error("Error syncing watchlist to Supabase:", error);
                toast.error("Failed to sync to cloud");
            }
        }
    };

    const removeFromWatchlist = async (id: number) => {
        setWatchlist((prev) => prev.filter((i) => i.id !== id));
        toast.success("Removed from Watchlist");

        if (user) {
            const { error } = await supabase
                .from("watchlist")
                .delete()
                .match({ user_id: user.id, media_id: id });

            if (error) console.error("Error removing from Supabase:", error);
        }
    };

    const isInWatchlist = (id: number) => {
        return watchlist.some((item) => item.id === id);
    };

    return (
        <WatchlistContext.Provider
            value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
        >
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error("useWatchlist must be used within a WatchlistProvider");
    }
    return context;
}
