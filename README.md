# 🎬 StreamFlix

**StreamFlix** is a modern, premium streaming platform built with Next.js 15. It aggregates content from TMDB and provides seamless streaming capabilities for Movies and TV Shows.

## ✨ Features

- **Discovery**: Trending, Popular, Top Rated, and Upcoming Movies & TV Shows.
- **Search**: Real-time multi-search for finding content.
- **Detailed Info**: Rich metadata including cast, genres, runtime, and ratings (IMDb & Rotten Tomatoes).
- **Streaming**: Integrated video player for instant playback of Movies and TV Episodes.
- **TV Series**: Full season and episode navigation.
- **Design**: Modern, responsive UI with Dark Mode, built using **shadcn/ui** and **Tailwind CSS**.
- **UX**: Loading skeletons, graceful error handling, and intuitive navigation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Provider**: [TMDB API](https://www.themoviedb.org/)
- **Ratings**: [OMDB API](https://www.omdbapi.com/)
- **Streaming Source**: VidLink

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js 18+ installed.
- API Keys for TMDB and OMDB.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shettydevesh/streamFlix.git
   cd streamFlix
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your API keys:

   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Build

To create a production build:

```bash
npm run build
```

## 📄 License

This project is for educational purposes. Content data provided by TMDB.
