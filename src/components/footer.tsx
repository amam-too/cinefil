import Image from "next/image";
import tmdb_logo from "@/public/tmdb_attribution.svg";

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-0 bg-secondary px-4 py-8">
      <div className="flex w-full flex-col items-center justify-center gap-12 sm:flex-row">
        {/* TMDb Attribution */}
        <div className="flex flex-col items-center sm:items-start">
          <p className="mb-2 text-center text-sm text-gray-300 sm:text-left">
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
      </div>
    </footer>
  );
}