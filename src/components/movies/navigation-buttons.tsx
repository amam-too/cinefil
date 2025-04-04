"use client";

import React from "react";

interface NavigationButtonsProps {
  scrollPrevAction: () => void;
  scrollNextAction: () => void;
}

export default function NavigationButtons({
  scrollPrevAction,
  scrollNextAction,
}: NavigationButtonsProps) {
  return (
    <div className="absolute bottom-8 right-4 flex space-x-3">
      <button
        className="rounded-full border-2 border-white bg-black p-3 text-white hover:bg-gray-900 focus:outline-none"
        onClick={scrollPrevAction}
        aria-label="Previous Slide"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        className="rounded-full border-2 border-white bg-black p-3 text-white hover:bg-gray-900 focus:outline-none"
        onClick={scrollNextAction}
        aria-label="Next Slide"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
