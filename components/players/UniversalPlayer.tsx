"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
  loading: () => <PlayerLoader message="Đang tải trình phát..." />
});

interface UniversalPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  className?: string;
  onReady?: () => void;
  onError?: (error: any) => void;
}

// Helper to detect URL type
const getVideoType = (url: string): string => {
  if (!url) return "unknown";
  
  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }
  
  // Vimeo
  if (url.includes("vimeo.com")) {
    return "vimeo";
  }
  
  // Facebook
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    return "facebook";
  }
  
  // HLS
  if (url.includes(".m3u8")) {
    return "hls";
  }
  
  // DASH
  if (url.includes(".mpd")) {
    return "dash";
  }
  
  // Standard video files
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.ogv', '.mov'];
  if (videoExtensions.some(ext => url.includes(ext))) {
    return "video";
  }
  
  // Audio files
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.oga', '.m4a'];
  if (audioExtensions.some(ext => url.includes(ext))) {
    return "audio";
  }
  
  return "unknown";
};

const PlayerLoader = ({ message = "Đang tải..." }: { message?: string }) => (
  <div className="flex items-center justify-center h-full bg-black">
    <div className="text-center p-4">
      <div className="h-8 w-8 border-4 border-t-primary border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-white">{message}</p>
    </div>
  </div>
);

const UnsupportedMessage = ({ url }: { url: string }) => (
  <div className="flex items-center justify-center h-full bg-black">
    <div className="text-center p-4 max-w-md">
      <p className="text-white mb-4">Định dạng video này không được hỗ trợ.</p>
      <Button
        variant="outline"
        className="bg-transparent text-white hover:bg-white/10"
        asChild
        size="sm"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 mr-2" />
          Xem trực tiếp
        </a>
      </Button>
    </div>
  </div>
);

// HLS specific configuration for React Player
const HLSConfig = {
  file: {
    forceHLS: true,
    hlsOptions: {
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      enableWorker: true,
      startLevel: -1, // Auto level selection
      fragLoadingTimeOut: 20000,
      manifestLoadingTimeOut: 20000,
      levelLoadingTimeOut: 20000
    }
  }
};

const UniversalPlayer: React.FC<UniversalPlayerProps> = ({
  url,
  poster,
  title,
  className = "",
  onReady,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<string>("unknown");
  const playerRef = useRef<any>(null);
  
  useEffect(() => {
    // Reset state when URL changes
    setIsLoading(true);
    setPlayerError(null);
    
    // Detect video type
    const type = getVideoType(url);
    setVideoType(type);
    
    console.log(`Video type detected: ${type} for URL: ${url}`);
    
    // Simulate loading for consistent UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [url]);
  
  // Handle player ready
  const handleReady = () => {
    setIsLoading(false);
    if (onReady) onReady();
  };
  
  // Handle player error
  const handleError = (error: any) => {
    console.error("Player error:", error);
    setPlayerError("Không thể phát video. Vui lòng thử lại sau.");
    setIsLoading(false);
    if (onError) onError(error);
  };
  
  // If URL is empty
  if (!url) {
    return (
      <div className={`relative overflow-hidden bg-black ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white">Không có URL video.</p>
        </div>
      </div>
    );
  }
  
  // When loading
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden bg-black ${className}`}>
        <PlayerLoader />
      </div>
    );
  }
  
  // If there's an error or unsupported format
  if (playerError || videoType === "unknown") {
    return (
      <div className={`relative overflow-hidden bg-black ${className}`}>
        <UnsupportedMessage url={url} />
      </div>
    );
  }
  
  // For YouTube, Vimeo, etc. ReactPlayer handles these automatically
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        controls={true}
        playsinline={true}
        light={poster}
        playing={false}
        onReady={handleReady}
        onError={handleError}
        config={videoType === "hls" ? HLSConfig : undefined}
        style={{ position: 'absolute', top: 0, left: 0 }}
        progressInterval={1000}
        // Additional features
        pip={true}
        stopOnUnmount={true}
        // Display title for accessibility
        playbackRate={1.0}
        volume={1}
        muted={false}
      />
    </div>
  );
};

export default UniversalPlayer;
