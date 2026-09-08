import { useEffect, useRef, useState } from "react";
import SignLanguagePlayer from "./SignLanguagePlayer";
import { haptic } from "../telegram";

function useMediaAvailable(url) {
  const [state, setState] = useState("checking");
  useEffect(() => {
    let active = true;
    if (!url) {
      setState("missing");
      return undefined;
    }
    setState("checking");
    fetch(url, { method: "HEAD" })
      .then((res) => {
        if (active) setState(res.ok ? "available" : "missing");
      })
      .catch(() => {
        if (active) setState("available");
      });
    return () => {
      active = false;
    };
  }, [url]);
  return state;
}

function MissingVideo({ icon, title, note }) {
  return (
    <div className="player">
      <div className="player-fallback" role="note">
        <span className="fallback-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="fallback-title">{title}</span>
        <span className="fallback-note">{note}</span>
      </div>
    </div>
  );
}

export default function VideoPlayer({ lesson, onEnded }) {
  const [mode, setMode] = useState("original");
  const [captionsOn, setCaptionsOn] = useState(true);
  const [originalFailed, setOriginalFailed] = useState(false);
  const videoRef = useRef(null);
  const resumeRef = useRef({ time: 0, playing: false });

  const originalState = useMediaAvailable(lesson.originalVideo);
  const signState = useMediaAvailable(lesson.signVideo);
  const captionsState = useMediaAvailable(lesson.captions);

  const isSign = mode === "sign";
  const signAvailable = signState === "available";
  const captionsAvailable = captionsState !== "missing";

  useEffect(() => {
    setOriginalFailed(false);
    setMode("original");
  }, [lesson.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const apply = () => {
      const track = video.textTracks?.[0];
      if (track) track.mode = captionsOn ? "showing" : "hidden";
    };
    apply();
    video.addEventListener("loadedmetadata", apply);
    return () => video.removeEventListener("loadedmetadata", apply);
  }, [captionsOn, mode, lesson.id]);

  const switchMode = (next) => {
    if (next === mode) return;
    if (next === "sign" && !signAvailable) {
      haptic("light");
      return;
    }
    const video = videoRef.current;
    if (video) {
      resumeRef.current = {
        time: video.currentTime,
        playing: !video.paused && !video.ended,
      };
    }
    setMode(next);
    haptic("selection");
  };

  const toggleCaptions = () => {
    setCaptionsOn((on) => !on);
    haptic("selection");
  };

  const handleLoadedMetadata = (event) => {
    if (resumeRef.current.time > 0) {
      event.currentTarget.currentTime = resumeRef.current.time;
      if (resumeRef.current.playing) {
        event.currentTarget.play().catch(() => {});
      }
      resumeRef.current = { time: 0, playing: false };
    }
  };

  if (originalState === "missing" && originalFailed) {
    return (
      <MissingVideo
        icon="📺"
        title="Video coming soon"
        note="This lesson is waiting for its course video. Everything else works already."
      />
    );
  }

  return (
    <div>
      {isSign ? (
        <SignLanguagePlayer
          ref={videoRef}
          src={lesson.signVideo}
          initialTime={resumeRef.current.time}
          onEnded={onEnded}
        />
      ) : originalState === "missing" ? (
        <MissingVideo
          icon="📺"
          title="Video coming soon"
          note="This lesson is waiting for its course video. Everything else works already."
        />
      ) : (
        <div className="player">
          <video
            ref={videoRef}
            className="player-video"
            src={lesson.originalVideo}
            playsInline
            preload="metadata"
            controls
            onEnded={onEnded}
            onError={() => setOriginalFailed(true)}
            onLoadedMetadata={handleLoadedMetadata}
          >
            <track
              kind="subtitles"
              src={lesson.captions}
              srcLang="en"
              label="English"
              default
            />
          </video>
          <span className="player-label">Original lesson video</span>
        </div>
      )}

      <div
        className="segmented"
        role="group"
        aria-label="Video accessibility options"
      >
        <button
          type="button"
          className={`segment${!isSign ? " active" : ""}`}
          aria-pressed={!isSign}
          onClick={() => switchMode("original")}
        >
          Original
        </button>
        <button
          type="button"
          className={`segment${isSign ? " active" : ""}`}
          aria-pressed={isSign}
          onClick={() => switchMode("sign")}
        >
          🤟 Sign
        </button>
        <button
          type="button"
          className={`segment${captionsOn && captionsAvailable ? " active" : ""}`}
          aria-pressed={captionsOn}
          disabled={!captionsAvailable}
          title={captionsAvailable ? "Toggle captions" : "Captions coming soon"}
          onClick={toggleCaptions}
        >
          CC
        </button>
      </div>

      {isSign && !signAvailable && (
        <p className="media-note">🤟 Sign-language version coming soon.</p>
      )}
      {!captionsAvailable && (
        <p className="media-note">CC Captions for this lesson are coming soon.</p>
      )}
    </div>
  );
}
