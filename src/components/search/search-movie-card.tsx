"use client";

import Image from "next/image";
import Link from "next/link";
import { type Movie } from "tmdb-ts";
import { getYearOnly } from "@/utils/date";
import React from "react";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] relative z-10 mt-6 flex h-[270px] w-[200px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-md transition-all duration-500 hover:scale-105 hover:shadow-lg"
    >
      <div className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] relative aspect-[2/3] h-full overflow-hidden transition-all duration-500">
        <div
          className={`relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-opacity group-hover:opacity-90`}
        >
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>
      </div>

      {/* Title Overlay for Collapsed State */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <h3 className="w-[90%] truncate text-sm font-medium text-primary">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-400">
          {getYearOnly(movie.release_date)}
        </p>
      </div>
    </Link>
  );
}