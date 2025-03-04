import { useRef, useState, useEffect } from "react";
import { Pause } from "lucide-react";

const CustomAudioPlayer = ({ src, title, cover }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setProgress((audioRef.current.currentTime / duration) * 100);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="w-full aspect-[278/160] bg-white overflow-hidden">
      <div className="relative h-full">
        <img loading="lazy" src={cover} alt={title} className="w-full relative z-[8] h-full object-cover" />
        <div className="absolute w-full bottom-0 z-[10] p-4 gap-3 flex items-center">
          <button onClick={togglePlay} className="bg-[#FBB04C] w-12 h-12 flex items-center justify-center rounded-full">
            {isPlaying ? <Pause color="#ffffff" size={24} /> : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.1447 10.8665C19.5502 11.6788 19.5554 12.7005 18.1447 13.6189L7.24495 21.2422C5.87541 22.0001 4.94525 21.5526 4.84761 19.9126L4.80136 3.95714C4.77053 2.44644 5.97048 2.01962 7.1139 2.74392L18.1447 10.8665Z" fill="white" />
              </svg>
            )}
          </button>
          <div className="flex flex-col grow gap-0.5">
            <div className="flex items-center text-xs gap-1 text-white">
              <h3>{formatTime(currentTime)}</h3> / <h3>{formatTime(duration)}</h3>
            </div>
            <div className="relative w-full overflow-hidden rounded-md h-1.5 bg-[#FFFFFF8A]">
              <div className="absolute top-0 left-0 h-1.5 bg-orange-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Аудио-трек */}
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} src={src} />
    </div>
  );
};

const formatTime = (time) => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export default CustomAudioPlayer;
