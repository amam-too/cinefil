interface SearchPageProps {
    searchParams: Promise<{
        query?: string;
    }>
}

export default async function SearchPage({searchParams}: SearchPageProps) {
    const {query} = await searchParams;
    
    return (
        <main>
            <h1>Search Page</h1>
            
            {query ?? "No query"}
        </main>
    )
}