import React from "react";

export function DiscardMoviesSkeleton() {
  return Array(3)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        className="flex w-full max-w-[200px] flex-col items-center justify-between gap-4"
      >
        <div className="h-[300px] w-full animate-pulse bg-stone-800"></div>
        <div className="h-8 w-full animate-pulse bg-stone-800"></div>
        <div className="h-8 w-full animate-pulse bg-stone-800"></div>
      </div>
    ));
}