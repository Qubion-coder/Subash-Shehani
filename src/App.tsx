import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';

import { VideoIntro } from './components/VideoIntro';
import { InvitationContent } from './components/InvitationContent';
import { Admin } from './components/Admin';
import { INVITATION_IMAGE_URLS, preloadImages } from './utils/preloadImages';
import { EVENT_LABELS, guestDisplayName, parseEvent, readGuestName } from './utils/guest';

const isAdminRoute = () => window.location.pathname === '/admin';

export default function App() {
  const [showInvitation, setShowInvitation] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const params = new URLSearchParams(window.location.search);
  const titleParam = params.get('title') || '';
  const nameParam = readGuestName();
  const eventParam = parseEvent(params.get('event'));

  const fullInviteeName = guestDisplayName(titleParam, nameParam);

  const eventLabel = EVENT_LABELS[eventParam];

  // Reception-only guests count down to the reception instead of the church mass
  const weddingDate = new Date(eventParam === 'reception' ? '2026-12-11T17:00:00+05:30' : '2026-12-11T14:30:00+05:30');

  useEffect(() => {
    if (isAdminRoute()) return;

    let cancelled = false;

    preloadImages([...INVITATION_IMAGE_URLS]).then(() => {
      if (!cancelled) setAssetsReady(true);
    });
    
    // Preload video
    const videoLink = document.createElement('link');
    videoLink.rel = 'preload';
    videoLink.as = 'video';
    videoLink.href = '/intro-full.mp4';
    document.head.appendChild(videoLink);

    return () => {
      cancelled = true;
    };
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/in-gods-perfect-time.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.preload = 'none';
    }
    return audioRef.current;
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMusicStart = useCallback(() => {
    setIsMusicPlaying(true);
    const audio = ensureAudio();
    audio.play().catch(console.error);
  }, [ensureAudio]);

  const toggleMusic = useCallback(() => {
    const audio = ensureAudio();
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsMusicPlaying((playing) => !playing);
  }, [ensureAudio, isMusicPlaying]);

  const handleEnvelopeComplete = useCallback(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      setShowInvitation(true);
    });
  }, []);

  const handleIntroExited = useCallback(() => setIntroDone(true), []);

  if (isAdminRoute()) {
    return (
      <>
        <Toaster position="top-center" />
        <Admin />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <InvitationContent
        active={showInvitation}
        eventParam={eventParam}
        fullInviteeName={fullInviteeName}
        eventLabel={eventLabel}
        weddingDate={weddingDate}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
      />

      <AnimatePresence mode="wait">
        {!introDone && (
          <VideoIntro
            key="welcome"
            onComplete={handleEnvelopeComplete}
            onExited={handleIntroExited}
            onMusicStart={handleMusicStart}
            readyToTransition={assetsReady}
          />
        )}
      </AnimatePresence>
      
      {/* Hidden video to force preload across all devices */}
      <video src="/hero-butterflies.mp4" preload="auto" muted playsInline style={{ display: 'none' }} />
    </>
  );
}
