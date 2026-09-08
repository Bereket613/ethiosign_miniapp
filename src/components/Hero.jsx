export default function Hero({ user }) {
  const firstName = user?.first_name;
  return (
    <header className="hero">
      <div className="brand-row">
        <div className="brand-logo" aria-hidden="true">
          🤟
        </div>
        <div>
          <div className="brand-name">EthioSign</div>
          <div className="brand-sub">Inclusive CTE Learning</div>
        </div>
      </div>
      <h1>{firstName ? `Welcome back, ${firstName} 👋` : "Welcome back 👋"}</h1>
      <p className="subtitle">
        Continue your learning journey with accessible CTE courses.
      </p>
    </header>
  );
}
