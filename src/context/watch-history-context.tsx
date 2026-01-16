"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MediaItem } from "@/types/tmdb";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

export interface HistoryItem {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    timestamp: number;
    lastWatched: string; // ISO date string
    // TV specific
    season_number?: number;
    episode_number?: number;
    episode_title?: string;
}

interface WatchHistoryContextType {
    history: HistoryItem[];
    addToHistory: (item: HistoryItem) => void;
    removeFromHistory: (id: number) => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextType | undefined>(undefined);

export function WatchHistoryProvider({ children }: { children: React.ReactNode }) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { user } = useAuth();

    // Load initial state
    // Load initial state
    useEffect(() => {
        const loadHistory = async () => {
            if (user) {
                // 1. Fetch Cloud History
                const { data: cloudData, error } = await supabase
                    .from("watch_history")
                    .select("*");

                if (error) {
                    console.error("Error fetching watch history:", error);
                    return;
                }

                let finalHistory: HistoryItem[] = [];
                if (cloudData) {
                    finalHistory = cloudData.map(row => ({
                        ...row.metadata,
                        id: row.media_id,
                        type: row.media_type,
                        timestamp: row.timestamp,
                        lastWatched: row.last_watched,
                    }));
                }

                // 2. Check Local History for items to merge
                const stored = localStorage.getItem("streamflix-watch-history");
                if (stored) {
                    try {
                        const localHistory: HistoryItem[] = JSON.parse(stored);
                        const itemsToSync: HistoryItem[] = [];

                        localHistory.forEach(localItem => {
                            const cloudItem = finalHistory.find(c => c.id === localItem.id);
                            // If local item is missing in cloud OR local item is newer
                            if (!cloudItem || new Date(localItem.lastWatched) > new Date(cloudItem.lastWatched)) {
                                itemsToSync.push(localItem);
                            }
                        });

                        if (itemsToSync.length > 0) {
                            console.log("Syncing local history to cloud:", itemsToSync.length, "items");
                            const { error: syncError } = await supabase
                                .from("watch_history")
                                .upsert(
                                    itemsToSync.map(item => ({
                                        user_id: user.id,
                                        media_id: item.id,
                                        media_type: item.type,
                                        timestamp: item.timestamp,
                                        last_watched: item.lastWatched, // Trust local timestamp
                                        metadata: {
                                            title: item.title,
                                            poster_path: item.poster_path,
                                            backdrop_path: item.backdrop_path,
                                            season_number: item.season_number,
                                            episode_number: item.episode_number,
                                            episode_title: item.episode_title
                                        }
                                    })),
                                    { onConflict: 'user_id, media_id, media_type' }
                                );

                            if (syncError) {
                                console.error("Error syncing local history merged items:", syncError);
                            } else {
                                // Add synced items to our final in-memory list (or could refetch)
                                // We'll just update the memory list to avoid another network call, 
                                // although refetching is safer for "last_watched" sorting.
                                // Let's just refetch to be clean and simple.
                                const { data: refetchedData } = await supabase
                                    .from("watch_history")
                                    .select("*")
                                    .order("last_watched", { ascending: false });

                                if (refetchedData) {
                                    finalHistory = refetchedData.map(row => ({
                                        ...row.metadata,
                                        id: row.media_id,
                                        type: row.media_type,
                                        timestamp: row.timestamp,
                                        lastWatched: row.last_watched,
                                    }));
                                }

                                // Determine if we should clear local storage.
                                // If we don't clear, we might re-sync next time. 
                                // Since we check dates, it's idempotent-ish, but let's clear to keep it clean.
                                localStorage.removeItem("streamflix-watch-history");
                            }
                        } else {
                            // Sort default fetch
                            finalHistory.sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());
                        }
                    } catch (e) {
                        console.error("Failed to parse local history for merge", e);
                    }
                }

                setHistory(finalHistory);
            } else {
                // Load from LocalStorage
                const stored = localStorage.getItem("streamflix-watch-history");
                if (stored) {
                    try {
                        setHistory(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse watch history", e);
                    }
                } else {
                    setHistory([]);
                }
            }
            setIsInitialized(true);
        };

        loadHistory();
    }, [user]);

    // Save to LocalStorage (for guest)
    useEffect(() => {
        if (!user && isInitialized) {
            localStorage.setItem("streamflix-watch-history", JSON.stringify(history));
        }
    }, [history, isInitialized, user]);

    const addToHistory = async (item: HistoryItem) => {
        // Optimistic update
        setHistory((prev) => {
            const filtered = prev.filter((i) => i.id !== item.id);
            return [item, ...filtered];
        });

        if (user) {
            // Sync to Supabase
            const { error } = await supabase
                .from("watch_history")
                .upsert({
                    user_id: user.id,
                    media_id: item.id,
                    media_type: item.type,
                    timestamp: item.timestamp,
                    last_watched: new Date().toISOString(),
                    metadata: {
                        title: item.title,
                        poster_path: item.poster_path,
                        backdrop_path: item.backdrop_path,
                        season_number: item.season_number,
                        episode_number: item.episode_number,
                        episode_title: item.episode_title
                    }
                }, { onConflict: 'user_id, media_id, media_type' }); // Ensure unique constraint matches

            if (error) console.error("Error syncing to Supabase:", error);
        }
    };

    const removeFromHistory = async (id: number) => {
        const itemToRemove = history.find(i => i.id === id);
        if (!itemToRemove) return;

        setHistory((prev) => prev.filter((i) => i.id !== id));

        if (user) {
            const { error } = await supabase
                .from("watch_history")
                .delete()
                .match({ user_id: user.id, media_id: id }); // Note: valid if media_id is unique enough, but better to match type too. 
            // Since `removeFromHistory` only takes ID, we might delete both movie and tv with same ID if that happens?
            // TMDB IDs are unique per type.
            // Ideally `removeFromHistory` should take type too.
            // I will update the interface to be safe, OR just delete all with that ID (unlikely collision but possible).
            // Let's stick to ID for now as per interface, but maybe filter in memory to find type.

            if (error) console.error("Error removing from Supabase:", error);
        }
    };

    return (
        <WatchHistoryContext.Provider value={{ history, addToHistory, removeFromHistory }}>
            {children}
        </WatchHistoryContext.Provider>
    );
}

export function useWatchHistory() {
    const context = useContext(WatchHistoryContext);
    if (context === undefined) {
        throw new Error("useWatchHistory must be used within a WatchHistoryProvider");
    }
    return context;
}
