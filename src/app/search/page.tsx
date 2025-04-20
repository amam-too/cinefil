import SearchInputs from "@/components/search/search-inputs";
import SearchMoviesResult from "@/components/search/search-movies-result";

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
    year?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query, year } = await searchParams;

  return (
    <main className="flex h-[calc(100svh-7rem)] min-h-[115vh] w-full flex-grow flex-col items-center gap-6 pt-24 *:rounded-xl">
      <h1 className="text-center text-4xl font-bold">Recherche</h1>
      <SearchInputs />
      <SearchMoviesResult query={query} year={year} />
    </main>
  );
}