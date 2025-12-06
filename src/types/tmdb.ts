export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface MediaItem {
    id: number;
    backdrop_path: string | null;
    poster_path: string | null;
    overview: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    media_type?: "movie" | "tv";
    adult?: boolean;
    imdb_id?: string;
    original_language?: string;
}

export interface Movie extends MediaItem {
    title: string;
    original_title: string;
    release_date: string;
    video: boolean;
    media_type: "movie";
}

export interface TVShow extends MediaItem {
    name: string;
    original_name: string;
    first_air_date: string;
    origin_country: string[];
    media_type: "tv";
}

export interface CastMember {
    id: number;
    name: string;
    original_name: string;
    character: string;
    profile_path: string | null;
    order: number;
}

export interface CrewMember {
    id: number;
    name: string;
    original_name: string;
    department: string;
    job: string;
    profile_path: string | null;
}

export interface Credits {
    id: number;
    cast: CastMember[];
    crew: CrewMember[];
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
}

export interface VideoResponse {
    id: number;
    results: Video[];
}

export interface Genre {
    id: number;
    name: string;
}

export interface MediaDetail {
    genres: Genre[];
    homepage: string | null;
    status: string;
    tagline: string | null;
    production_companies: {
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }[];
}

export interface MovieDetail extends MediaDetail, Movie {
    runtime: number | null;
    budget: number;
    revenue: number;
}

export interface TVDetail extends MediaDetail, TVShow {
    created_by: {
        id: number;
        credit_id: string;
        name: string;
        gender: number;
        profile_path: string | null;
    }[];
    episode_run_time: number[];
    number_of_episodes: number;
    number_of_seasons: number;
    seasons: Season[];
    last_episode_to_air: Episode | null;
    next_episode_to_air: Episode | null;
}

export interface Season {
    air_date: string | null;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
    episodes?: Episode[];
}

export interface Episode {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
    crew: CrewMember[];
    guest_stars: CastMember[];
}
