import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function MovieDetailPageLoading() {
    return (
        <main className="relative min-h-screen">
            {/* Blurred backdrop gradient */ }
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Skeleton className="w-full h-full"/>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/95 backdrop-blur-xl"/>
            </div>
            
            <div className="relative z-10 container max-w-6xl mx-auto px-4 py-12 pt-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Left column - Movie poster and actions */ }
                    <div className="md:col-span-1">
                        <div className="sticky top-8">
                            {/* Poster Skeleton */ }
                            <Skeleton className="relative aspect-[2/3] rounded-lg shadow-2xl"/>
                            
                            {/* Movie actions */ }
                            <div className="mt-8 space-y-6">
                                <Skeleton className="h-10 w-full"/>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-10 w-full"/>
                                    <Skeleton className="h-10 w-full"/>
                                </div>
                                
                                {/* External links */ }
                                <div className="pt-2">
                                    <Skeleton className="h-8 w-full"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right column - Movie details */ }
                    <div className="md:col-span-2 text-white">
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-3/4 mb-4"/>
                            <Skeleton className="h-6 w-1/2"/>
                        </div>
                        
                        {/* Movie metadata */ }
                        <div className="flex flex-wrap items-center gap-6 mt-6 text-gray-300">
                            <Skeleton className="h-6 w-24"/>
                            <Skeleton className="h-6 w-24"/>
                            <Skeleton className="h-6 w-32"/>
                        </div>
                        
                        {/* Genres */ }
                        <div className="flex flex-wrap gap-2 mt-6">
                            { [1, 2, 3].map((genre) => (
                                <Skeleton key={ genre } className="h-6 w-20"/>
                            )) }
                        </div>
                        
                        {/* Proposition status */ }
                        <Card className="mt-8 bg-white/5 border-0">
                            <CardContent className="p-4">
                                <Skeleton className="h-4 w-1/2 mb-2"/>
                                <Skeleton className="h-4 w-3/4"/>
                            </CardContent>
                        </Card>
                        
                        <Separator className="my-8 bg-white/10"/>
                        
                        {/* Overview */ }
                        <div className="space-y-3">
                            <Skeleton className="h-8 w-1/3 mb-4"/>
                            <Skeleton className="h-24 w-full"/>
                        </div>
                        
                        <Separator className="my-8 bg-white/10"/>
                        
                        {/* Cast and Crew */ }
                        <div className="space-y-8">
                            <Skeleton className="h-8 w-1/4 mb-4"/>
                            
                            {/* Director */ }
                            <div>
                                <Skeleton className="h-6 w-1/3 mb-4"/>
                                <div className="flex items-center">
                                    <Skeleton className="w-16 h-16 rounded-full mr-4"/>
                                    <div>
                                        <Skeleton className="h-6 w-48 mb-2"/>
                                        <Skeleton className="h-4 w-32"/>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Cast */ }
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <Skeleton className="h-6 w-1/4"/>
                                    <Skeleton className="h-8 w-24"/>
                                </div>
                                
                                <div className="flex space-x-4">
                                    { [1, 2, 3, 4, 5, 6].map((actor) => (
                                        <div key={ actor } className="w-28">
                                            <Skeleton className="w-28 h-40 mb-2"/>
                                            <Skeleton className="w-full h-4 mb-1"/>
                                            <Skeleton className="w-3/4 h-4"/>
                                        </div>
                                    )) }
                                </div>
                            </div>
                        </div>
                        
                        {/* Production companies */ }
                        <Separator className="my-8 bg-white/10"/>
                        <div>
                            <Skeleton className="h-6 w-1/4 mb-4"/>
                            <div className="flex flex-wrap gap-3">
                                { [1, 2, 3].map((company) => (
                                    <Skeleton key={ company } className="h-8 w-32"/>
                                )) }
                            </div>
                        </div>
                        
                        {/* Recommendations */ }
                        <Separator className="my-8 bg-white/10"/>
                        <div>
                            <Skeleton className="h-8 w-1/3 mb-6"/>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                { [1, 2, 3, 4].map((rec) => (
                                    <div key={ rec }>
                                        <Skeleton className="aspect-[2/3] rounded-lg mb-2"/>
                                        <Skeleton className="h-4 w-3/4 mb-1"/>
                                        <Skeleton className="h-4 w-1/2"/>
                                    </div>
                                )) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}