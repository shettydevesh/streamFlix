import {
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTrendingMovies,
  getTrendingTV,
  getUpcomingMovies,
} from "@/lib/tmdb";
import { HeroBanner } from "@/components/media/hero-banner";
import { MediaCarousel } from "@/components/media/media-carousel";
import { HomeAuthSection } from "@/components/home/home-auth-section";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  try {
    const [
      trendingMoviesDay,
      trendingMoviesWeek,
      trendingTV,
      popularMovies,
      topRatedMovies,
      upcomingMovies,
    ] = await Promise.all([
      getTrendingMovies("day"),
      getTrendingMovies("week"),
      getTrendingTV("day"),
      getPopularMovies(),
      getTopRatedMovies(),
      getUpcomingMovies(),
    ]);

    const featuredMovie = trendingMoviesDay.results[0];

    return (
      <div className="flex flex-col gap-8 pb-8">
        {featuredMovie && <HeroBanner media={featuredMovie} />}

        <div className="container space-y-8">
          <MediaCarousel
            title="Trending Movies"
            items={trendingMoviesWeek.results}
            viewAllLink="/movies"
          />


          <HomeAuthSection />

          <MediaCarousel
            title="Trending TV Series"
            items={trendingTV.results}
            viewAllLink="/tv"
          />
          <MediaCarousel
            title="Popular Movies"
            items={popularMovies.results}
            viewAllLink="/movies?sort=popularity.desc"
          />
          <MediaCarousel
            title="Top Rated Movies"
            items={topRatedMovies.results}
            viewAllLink="/movies?sort=vote_average.desc"
          />
          <MediaCarousel
            title="Upcoming Movies"
            items={upcomingMovies.results}
            viewAllLink="/movies?sort=release_date.desc"
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Unable to load content</h2>
        <p className="text-muted-foreground">
          Please check your API key configuration.
        </p>
      </div>
    );
  }
}
