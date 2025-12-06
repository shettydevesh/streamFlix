import axios from "axios";
import {
    Credits,
    Movie,
    MovieDetail,
    TMDBResponse,
    TVDetail,
    TVShow,
    VideoResponse,
    Season,
    Genre,
} from "@/types/tmdb";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

export const getTrendingMovies = async (timeWindow: "day" | "week" = "day") => {
    const { data } = await tmdbClient.get<TMDBResponse<Movie>>(
        `/trending/movie/${timeWindow}`
    );
    return data;
};

export const getTrendingTV = async (timeWindow: "day" | "week" = "day") => {
    const { data } = await tmdbClient.get<TMDBResponse<TVShow>>(
        `/trending/tv/${timeWindow}`
    );
    return data;
};

export const getPopularMovies = async () => {
    const { data } = await tmdbClient.get<TMDBResponse<Movie>>("/movie/popular");
    return data;
};

export const getTopRatedMovies = async () => {
    const { data } = await tmdbClient.get<TMDBResponse<Movie>>("/movie/top_rated");
    return data;
};

export const getUpcomingMovies = async () => {
    const { data } = await tmdbClient.get<TMDBResponse<Movie>>("/movie/upcoming");
    return data;
};

export const getPopularTV = async () => {
    const { data } = await tmdbClient.get<TMDBResponse<TVShow>>("/tv/popular");
    return data;
};

export const getTopRatedTV = async () => {
    const { data } = await tmdbClient.get<TMDBResponse<TVShow>>("/tv/top_rated");
    return data;
};

export const getMovieDetail = async (id: number) => {
    const { data } = await tmdbClient.get<MovieDetail>(`/movie/${id}`);
    return data;
};

export const getTVDetail = async (id: number) => {
    const { data } = await tmdbClient.get<TVDetail>(`/tv/${id}`);
    return data;
};

export const getMovieCredits = async (id: number) => {
    const { data } = await tmdbClient.get<Credits>(`/movie/${id}/credits`);
    return data;
};

export const getTVCredits = async (id: number) => {
    const { data } = await tmdbClient.get<Credits>(`/tv/${id}/credits`);
    return data;
};

export const getSimilarMovies = async (id: number) => {
    const { data } = await tmdbClient.get<TMDBResponse<Movie>>(
        `/movie/${id}/similar`
    );
    return data;
};

export const getSimilarTV = async (id: number) => {
    const { data } = await tmdbClient.get<TMDBResponse<TVShow>>(
        `/tv/${id}/similar`
    );
    return data;
};

export const getVideos = async (id: number, type: "movie" | "tv") => {
    const { data } = await tmdbClient.get<VideoResponse>(`/${type}/${id}/videos`);
    return data;
};

export const getSeasonDetails = async (
    seriesId: number,
    seasonNumber: number
) => {
    const { data } = await tmdbClient.get<Season>(
        `/tv/${seriesId}/season/${seasonNumber}`
    );
    return data;
};

export const searchMulti = async (query: string) => {
    const { data } = await tmdbClient.get<TMDBResponse<Movie | TVShow>>(
        "/search/multi",
        {
            params: { query },
        }
    );
    return data;
};

export const getImage = (path: string | null, size: "original" | "w185" | "w342" | "w500" | "w780" = "original") => {
    if (!path) return "/placeholder.jpg"; // Todo: Add a placeholder image
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const discoverMovies = async (page: number = 1, sortBy: string = "popularity.desc", withGenres?: string) => {
    const { data } = await tmdbClient.get<TMDBResponse<Movie>>("/discover/movie", {
        params: {
            page,
            sort_by: sortBy,
            with_genres: withGenres,
        },
    });
    return data;
};

export const discoverTV = async (page: number = 1, sortBy: string = "popularity.desc", withGenres?: string) => {
    const { data } = await tmdbClient.get<TMDBResponse<TVShow>>("/discover/tv", {
        params: {
            page,
            sort_by: sortBy,
            with_genres: withGenres,
        },
    });
    return data;
};

export const getMovieGenres = async () => {
    const { data } = await tmdbClient.get<{ genres: Genre[] }>("/genre/movie/list");
    return data;
};

export const getTVGenres = async () => {
    const { data } = await tmdbClient.get<{ genres: Genre[] }>("/genre/tv/list");
    return data;
};
