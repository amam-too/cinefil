"use client"

import Image from "next/image";
import Link from "next/link";
import { type Movie } from "tmdb-ts";

interface MovieCardProps {
    movie: Movie
}

export default function MovieCard({movie}: MovieCardProps) {
    return (
        <Link
            href={ `/movie/${ movie.id }` }
            className="relative flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] w-[200px] z-10 h-[270px] cursor-pointer rounded-xl shadow-md hover:shadow-lg overflow-hidden flex hover:scale-105 mt-6"
        >
            <div className="relative aspect-[2/3] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] h-full">
                <div
                    className={ `
                       relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 group-hover:opacity-90 transition-opacity
                    ` }
                >
                    { movie.poster_path ? (
                        <Image
                            src={ `https://image.tmdb.org/t/p/w300${ movie.poster_path }` }
                            alt={ movie.title }
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                            No image
                        </div>
                    ) }
                </div>
            </div>
            
            {/* Title Overlay for Collapsed State */ }
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-sm font-medium text-white truncate w-[90%]">{ movie.title }</h3>
            </div>
        </Link>
    )
}