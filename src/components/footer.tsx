import Image from "next/image";
import tmdb_logo from "@/public/tmdb_attribution.svg";

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-0 flex min-h-64 w-full flex-row items-center justify-center gap-x-24 bg-secondary px-4 py-8 text-white">
      {/* TMDb Attribution */}
      <div className="flex flex-col items-center">
        <p className="mb-2 text-center text-sm text-gray-300">
          Made using the TMDb API.
        </p>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TMDb"
        >
          <Image src={tmdb_logo} alt="TMDB logo" height={40} />
        </a>
      </div>

      {/* Developer Attribution */}
      <div className="flex flex-col items-center">
        <p className="mb-4 text-sm text-gray-300">Directed by</p>
        <div className="flex gap-10">
          <a
            href="https://github.com/matisbyar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-sm transition-opacity hover:opacity-80"
          >
            <Image
              src="https://avatars.githubusercontent.com/u/86782053?v=4"
              alt="Matis"
              width={70}
              height={70}
              className="mb-2 h-20 w-20 rounded-full"
            />
            <span>
              <b>Matis</b>
            </span>
          </a>
          <a
            href="https://github.com/maxbodin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-sm transition-opacity hover:opacity-80"
          >
            <Image
              src="https://avatars.githubusercontent.com/u/159888863?v=4"
              alt="Maxime"
              width={70}
              height={70}
              className="mb-2 h-20 w-20 rounded-full"
            />
            <span>
              <b>Maxime</b>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
