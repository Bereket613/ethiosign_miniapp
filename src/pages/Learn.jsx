import { phrases } from "../data/phrases";

export default function Learn() {
  return (
    <div className="page-enter">
      <header className="page-header">
        <h1>Ethiopian Sign Language</h1>
        <p className="hint">
          Learn useful signs related to your CTE learning.
        </p>
      </header>

      <div className="phrase-grid">
        {phrases.map((phrase) => (
          <article key={phrase.id} className="phrase-card">
            {phrase.image ? (
              <img
                src={phrase.image}
                alt={`Sign for ${phrase.word}`}
                loading="lazy"
              />
            ) : (
              <div className="phrase-image-fallback" aria-hidden="true">
                🤟
              </div>
            )}
            <div className="phrase-body">
              <div className="phrase-word">{phrase.word}</div>
              <div className="phrase-amharic">{phrase.amharic}</div>
              <p className="phrase-desc">{phrase.meaning}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="card" style={{ marginTop: 14 }}>
        <h3>Why sign language matters</h3>
        <p className="hint">
          Ethiopian Sign Language makes CTE learning accessible to deaf and
          hard-of-hearing learners. Every lesson in EthioSign has a separate
          sign-language video, alongside captions and a transcript.
        </p>
      </section>

      <p className="footer-note">
        Demo images — replace with authentic Ethiopian Sign Language materials.
      </p>
    </div>
  );
}
