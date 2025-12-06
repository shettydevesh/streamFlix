import axios from "axios";

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const OMDB_BASE_URL = "https://www.omdbapi.com";

export interface OMDBRating {
    Source: string;
    Value: string;
}

interface OMDBResponse {
    Ratings: OMDBRating[];
    imdbRating: string;
    imdbVotes: string;
    Response: "True" | "False";
}

export const getOMDBRatings = async (imdbId: string) => {
    if (!OMDB_API_KEY) return null;

    try {
        const { data } = await axios.get<OMDBResponse>(OMDB_BASE_URL, {
            params: {
                apikey: OMDB_API_KEY,
                i: imdbId,
            },
        });

        if (data.Response === "False") return null;

        return data;
    } catch (error) {
        console.error("Error fetching OMDB ratings:", error);
        return null;
    }
};
