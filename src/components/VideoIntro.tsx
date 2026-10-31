import React, { useEffect, useRef, useState } from 'react';
import { CoupleNames, NAMES_ANIMATION_MS } from './CoupleNames';
import { setNamesOwner } from '../utils/namesHandoff';
import { ScrollHint } from './Hero';

// The intro is the envelope opening followed by the butterflies, in one video.
// The envelope part ends here; the music starts from this point.
const ENVELOPE_END_SECONDS = 7.5;
// The gold names start appearing at this point in the intro video
const NAMES_START_SECONDS = 7;
// Show the scroll down hint this many seconds before the intro video ends
const SCROLL_HINT_LEAD_SECONDS = 5;

interface VideoIntroProps {
  onComplete: () => void;
  onExited?: () => void;
  onMusicStart?: () => void;
  readyToTransition?: boolean;
}

export function VideoIntro({ onComplete, onExited, onMusicStart, readyToTransition = true }: VideoIntroProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startVideo = () => {
    if (!readyToTransition) return;
    
    if (!hasStarted) {
      setHasStarted(true);
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    }
  };

  const [ended, setEnded] = useState(false);
  const [namesStartedAt, setNamesStartedAt] = useState<number | null>(null);
  const musicStartedRef = useRef(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const startMusic = () => {
    if (musicStartedRef.current) return;
    musicStartedRef.current = true;
    onMusicStart?.();
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const t = e.currentTarget.currentTime;
    if (namesStartedAt === null && !ended && t >= NAMES_START_SECONDS) {
      setNamesStartedAt(performance.now());
      setNamesOwner('intro');
    }
    if (t >= ENVELOPE_END_SECONDS) startMusic();
    const d = e.currentTarget.duration;
    if (!showScrollHint && d && d - t <= SCROLL_HINT_LEAD_SECONDS) setShowScrollHint(true);
  };

  const handleVideoEnded = () => {
    if (ended) return;
    setEnded(true);
    startMusic();
    // Mount the invitation underneath while the last intro frame stays on screen
    onComplete();
  };

  // Crossfade into the hero only once its butterfly video is actually playing
  useEffect(() => {
    if (!ended) return;
    const reveal = () => setExiting(true);
    window.addEventListener('hero-video-playing', reveal, { once: true });
    const fallback = setTimeout(reveal, 2500);
    return () => {
      window.removeEventListener('hero-video-playing', reveal);
      clearTimeout(fallback);
    };
  }, [ended]);

  useEffect(() => {
    if (!exiting) return;
    // Wait for the fade out and for the names to finish, then hand them to the hero
    const namesLeft = namesStartedAt === null ? 0 : namesStartedAt + NAMES_ANIMATION_MS - performance.now();
    const t = setTimeout(() => {
      if (namesStartedAt !== null) setNamesOwner('handedOff');
      onExited?.();
    }, Math.max(800, namesLeft));
    return () => clearTimeout(t);
  }, [exiting, onExited, namesStartedAt]);

  return (
    <>
      <style>{`
        .video-scene {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #f3eef0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .video-scene.is-exiting {
          background: transparent;
          pointer-events: none;
        }
        .video-scene.is-exiting .intro-video {
          opacity: 0;
        }
        .intro-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.8s ease;
        }
        .play-button-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fdf9fb url('/bg/tap-page-bg.jpeg') center / cover no-repeat;
          color: white;
          cursor: pointer;
          font-family: "Cormorant Garamond", serif;
          z-index: 10;
        }
        .play-button {
          padding: 16px 32px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          background: rgba(138, 106, 156, 0.85);
          color: white;
          font-size: 20px;
          cursor: pointer;
          border-radius: 4px;
          font-family: inherit;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }
        .play-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: white;
        }
        .play-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .skip-button {
          position: absolute;
          bottom: 40px;
          right: 40px;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.4);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          cursor: pointer;
          font-family: "Montserrat", sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          z-index: 10;
          transition: all 0.3s ease;
        }
        .skip-button:hover {
          background: rgba(0, 0, 0, 0.6);
          border-color: rgba(255, 255, 255, 0.6);
        }
        @media (max-width: 600px) {
          .skip-button {
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>
      <div className={`video-scene ${exiting ? 'is-exiting' : ''}`}>
        <video 
          ref={videoRef}
          className="intro-video"
          src="/intro-full.mp4#t=0.001"
          poster="/intro-envelope-poster.jpg"
          preload="auto"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
        />

        {namesStartedAt !== null && (
          // Same box as the hero (top of a full-height screen) so the handoff lines up exactly
          <div className="absolute top-0 inset-x-0 h-screen flex items-center justify-center pointer-events-none z-[5]">
            <CoupleNames delay={-0.4} />
          </div>
        )}

        {showScrollHint && (
          <div className="absolute top-0 inset-x-0 h-screen pointer-events-none z-[6] [&>*]:pointer-events-auto">
            <ScrollHint
              onClick={() => {
                handleVideoEnded();
                setTimeout(() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' }), 900);
              }}
            />
          </div>
        )}
        
        {!hasStarted && (
          <div className="play-button-overlay" onClick={startVideo}>
            <button 
              className="play-button" 
              onClick={(e) => { e.stopPropagation(); startVideo(); }}
              disabled={!readyToTransition}
            >
              {readyToTransition ? "Tap to View Our Special Day" : "Loading..."}
            </button>
          </div>
        )}

        {hasStarted && !ended && (
          <button className="skip-button" onClick={handleVideoEnded}>
            Skip Intro
          </button>
        )}
      </div>
    </>
  );
}
