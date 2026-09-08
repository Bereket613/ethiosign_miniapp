export default function ProgressBar({
  value,
  large = false,
  label = true,
  light = false,
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-row">
      <div
        className={`progress-track${large ? " progress-track-lg" : ""}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${clamped}% complete`}
      >
        <div
          className="progress-fill"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {label && (
        <span className={`progress-label${light ? " progress-label-light" : ""}`}>
          {clamped}%
        </span>
      )}
    </div>
  );
}
