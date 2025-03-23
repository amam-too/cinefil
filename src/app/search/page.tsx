interface SearchPageProps {
    searchParams: Promise<{
        query?: string;
    }>
}

export default async function SearchPage({searchParams}: SearchPageProps) {
    const {query} = await searchParams;
    
    return (
        <main className="pt-24">
            <h1>Search Page</h1>
            
            {query ?? "No query"}
        </main>
    )
}