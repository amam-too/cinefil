export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
            <video width="1080" height="720" autoPlay loop muted className="absolute">
                <source src="/loading-video.mov" type="video/mp4" />
                Votre navigateur ne supporte pas les vidéos HTML5.
            </video>
            
            <div className="flex flex-col items-center justify-center">
                <h1 className="font-black text-3xl text-white absolute top-3/4 animate-pulse">
                    Chuuuut... le film arrive !
                </h1>
            </div>
        </div>
    );
}