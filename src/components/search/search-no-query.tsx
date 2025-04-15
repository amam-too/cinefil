export default async function SearchNoQuery() {
    const movieQuotes = [
        "I'm gonna make him an offer he can't refuse. — The Godfather",
        "What are you waiting for? — Scream",
        "Adventure is out there! — Up",
        "The answer's out there, Neo. It's looking for you. — The Matrix",
        "Why don't you try a query, Neo? — The Matrix",
        "All we have to decide is what to do with the time that is given us. — The Lord of the Rings",
        "You have questions, I have answers... but you have to ask. — I, Robot",
        "Houston, we have a problem. — Apollo 13",
        "It's alive! — Frankenstein",
        "May the Force be with you. — Star Wars",
        "Just keep swimming. — Finding Nemo",
        "To infinity... and beyond! — Toy Story",
        "Life is like a box of chocolates. — Forrest Gump",
        "This is the beginning of a beautiful friendship. — Casablanca",
        "Where we're going, we don't need roads. — Back to the Future",
    ];

    const randomQuote =
        movieQuotes[Math.floor(Math.random() * movieQuotes.length)] ?? "";

    const [quoteText, movieTitle] = randomQuote.split(" — ");

    return (
        <div className="flex min-h-[50vh] w-full flex-col items-center justify-center text-center text-white">
            <h2 className="animate-fade-in text-xl sm:text-4xl font-bold text-gray-100 max-w-2xl px-6 leading-tight">
                “{quoteText}”
            </h2>
            <p className="text-md sm:text-lg mt-2 italic text-gray-400">
                — {movieTitle}
            </p>
            <p className="mt-6 text-sm text-gray-500">Try searching for a movie!</p>
        </div>
    );
}
