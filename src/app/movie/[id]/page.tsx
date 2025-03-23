interface MovieDetailProps {
    params: {
        id: string
    }
}

export default async function MovieDetail({params}: MovieDetailProps) {
    const {id} = await params;
    
    return (
        <main>
            <h1>Movie Detail</h1>
            
            {id}
        </main>
    )
}