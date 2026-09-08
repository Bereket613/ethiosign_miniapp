import { forwardRef, useEffect, useState } from "react";

const SignLanguagePlayer = forwardRef(function SignLanguagePlayer(
  { src, initialTime = 0, onEnded, onError },
  ref
) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  useEffect(() => {
    if (failed && onError) onError();
  }, [failed]);

  if (failed) {
    return (
      <div className="player">
        <div className="player-fallback" role="note">
          <span className="fallback-icon" aria-hidden="true">
            🤟
          </span>
          <span className="fallback-title">Sign-language version coming soon</span>
          <span className="fallback-note">
            We are preparing the Ethiopian Sign Language video for this lesson.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <video
        ref={ref}
        className="player-video"
        src={src}
        playsInline
        preload="metadata"
        controls
        onEnded={onEnded}
        onError={() => setFailed(true)}
        onLoadedMetadata={(event) => {
          if (initialTime > 0) event.currentTarget.currentTime = initialTime;
        }}
      />
      <span className="player-label">🤟 Sign Language</span>
    </div>
  );
});

export default SignLanguagePlayer;
