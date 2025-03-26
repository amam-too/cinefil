export default function SearchGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            { [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((movie) => (
                <div key={ movie } className="relative overflow-hidden rounded-lg bg-gray-800/50">
                    <div className="aspect-w-2 aspect-h-3"/>
                </div>
            )) }
        </div>
    )
}