"use client";

import { useCallback, useRef, useState } from "react";

export type Stage = "invite" | "video" | "final";
export type VideoStatus = "idle" | "loading" | "playing" | "ended" | "error";

export interface UseIntroSequenceResult {
  stage: Stage;
  videoStatus: VideoStatus;
  soundOn: boolean;
  start: () => void;
  skip: () => void;
  onVideoEnded: () => void;
  onVideoError: () => void;
  toggleSound: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function useIntroSequence(): UseIntroSequenceResult {
  const [stage, setStage] = useState<Stage>("invite");
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("idle");
  const [soundOn, setSoundOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const start = useCallback(() => {
    if (stage !== "invite") return;
    setStage("video");
    setVideoStatus("loading");

    const video = videoRef.current;
    if (video) {
      video.muted = false;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => setVideoStatus("playing"))
          .catch(() => setVideoStatus("error"));
      } else {
        setVideoStatus("playing");
      }
    } else {
      setVideoStatus("error");
    }
  }, [stage]);

  const skip = useCallback(() => {
    if (stage !== "video") return;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = video.duration || 0;
    }
    setVideoStatus("ended");
    setStage("final");
  }, [stage]);

  const onVideoEnded = useCallback(() => {
    if (stage !== "video") return;
    setVideoStatus("ended");
    setStage("final");
  }, [stage]);

  const onVideoError = useCallback(() => {
    if (stage !== "video") return;
    setVideoStatus("error");
  }, [stage]);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = !soundOn;
    video.muted = !next;
    setSoundOn(next);
  }, [soundOn]);

  return {
    stage,
    videoStatus,
    soundOn,
    start,
    skip,
    onVideoEnded,
    onVideoError,
    toggleSound,
    videoRef,
  };
}
