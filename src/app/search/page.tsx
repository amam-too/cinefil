import SearchInputs from "@/components/search/search-inputs";
import SearchMoviesResult from "@/components/search/search-movies-result";

interface SearchPageProps {
    searchParams: Promise<{
        query?: string;
    }>
}

export default async function SearchPage({searchParams}: SearchPageProps) {
    const {query} = await searchParams;
    
    return (
        <main className="flex flex-col w-full items-center flex-grow pt-24 h-[calc(100svh-7rem)] *:rounded-xl gap-6">
            <h1 className="text-4xl font-bold text-center">Recherche</h1>
            <SearchInputs/>
            
            <SearchMoviesResult query={ query }/>
        </main>
    )
}