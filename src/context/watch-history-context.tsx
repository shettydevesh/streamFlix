"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MediaItem } from "@/types/tmdb";

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

    useEffect(() => {
        const stored = localStorage.getItem("streamflix-watch-history");
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse watch history", e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("streamflix-watch-history", JSON.stringify(history));
        }
    }, [history, isInitialized]);

    const addToHistory = (item: HistoryItem) => {
        setHistory((prev) => {
            // Remove existing entry for this ID if it exists, so we can move it to the top
            const filtered = prev.filter((i) => i.id !== item.id);
            // Add new item to the beginning
            return [item, ...filtered];
        });
    };

    const removeFromHistory = (id: number) => {
        setHistory((prev) => prev.filter((i) => i.id !== id));
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
