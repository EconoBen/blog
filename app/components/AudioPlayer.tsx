'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  className?: string;
}

function formatTime(value: number) {
  const time = Number.isFinite(value) ? Math.max(0, value) : 0;
  return `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ audioUrl, title = 'Listen to this post', className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playRequest = useRef(0);
  const pending = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(false); setIsLoading(false); setDuration(0); setCurrentTime(0); setError(null); setPlaybackRate(1);
    audio.playbackRate = 1;
    const metadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setCurrentTime(audio.currentTime);
      setIsLoading(false);
    };
    const time = () => setCurrentTime(audio.currentTime);
    const playing = () => { pending.current = false; setIsPlaying(true); setIsLoading(false); setError(null); };
    const pause = () => {
      pending.current = false; playRequest.current += 1;
      setIsPlaying(false); setIsLoading(false);
    };
    const waiting = () => { if (!audio.paused) setIsLoading(true); };
    const failed = () => {
      pending.current = false; playRequest.current += 1;
      setError('Audio could not load. Try again.'); setIsPlaying(false); setIsLoading(false);
    };
    const listeners = { loadedmetadata: metadata, durationchange: metadata, timeupdate: time, play: playing, playing, pause, ended: pause, waiting, error: failed };
    Object.entries(listeners).forEach(([name, listener]) => audio.addEventListener(name, listener));
    if (audio.readyState >= 1) metadata();
    return () => {
      playRequest.current += 1; pending.current = false;
      Object.entries(listeners).forEach(([name, listener]) => audio.removeEventListener(name, listener));
      audio.pause();
    };
  }, [audioUrl]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying || pending.current) {
      playRequest.current += 1; pending.current = false;
      audio.pause(); setIsPlaying(false); setIsLoading(false);
      return;
    }
    const request = ++playRequest.current;
    pending.current = true;
    setIsLoading(true);
    if (error) audio.load();
    setError(null);
    try {
      await audio.play();
      if (request === playRequest.current) { pending.current = false; setIsPlaying(true); setIsLoading(false); }
    } catch {
      if (request === playRequest.current) {
        pending.current = false; setError('Audio could not play. Try again.'); setIsPlaying(false); setIsLoading(false);
      }
    }
  };

  const seek = (value: number) => {
    if (!audioRef.current || !Number.isFinite(value) || duration <= 0) return;
    const next = Math.max(0, Math.min(duration, value));
    audioRef.current.currentTime = next;
    setCurrentTime(next);
  };

  const changeSpeed = () => {
    if (!audioRef.current) return;
    const speeds = [1, 1.25, 1.5, 1.75, 2];
    const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    audioRef.current.playbackRate = next; setPlaybackRate(next);
  };

  return (
    <div className={`audio-player ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="audio-player-header">
        <span className="audio-player-title">{title}</span>
        {error && <span className="audio-player-error" role="alert">{error}</span>}
      </div>
      <div className="audio-player-controls">
        <button type="button" className="audio-player-play-btn" onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause audio' : isLoading ? 'Cancel audio loading' : error ? 'Retry audio' : 'Play audio'}>
          {isLoading ? <span className="audio-player-spinner" aria-hidden="true">⊙</span> : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d={isPlaying ? 'M4 3h3v10H4zm5 0h3v10H9z' : 'M4 2.5 13 8l-9 5.5z'} />
            </svg>
          )}
        </button>
        <span className="audio-player-time" aria-hidden="true">{formatTime(currentTime)} / {formatTime(duration)}</span>
        <input type="range" className="audio-player-seek" min={0} max={duration || 0} step={1}
          value={Math.min(currentTime, duration)} disabled={duration <= 0} aria-label="Seek audio"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          onInput={event => seek(Number(event.currentTarget.value))} />
        <button type="button" className="audio-player-speed-btn" onClick={changeSpeed}
          aria-label={`Playback speed ${playbackRate} times. Change speed.`}>{playbackRate}×</button>
      </div>
    </div>
  );
}
