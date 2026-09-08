import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProgressBar from "../components/ProgressBar";
import { BookIcon, BookOpenIcon, HandIcon } from "../components/icons";
import { useProgress } from "../progress";
import { getModule, moduleLessons } from "../data/modules";

export default function Home({ telegram }) {
  const progress = useProgress();
  const last = progress.lastLesson();
  const overall = progress.overallPercent();

  const continueTarget = last
    ? `/module/${last.module.id}/${last.section.id}/${last.lesson.id}`
    : null;

  const firstModule = getModule(1);
  const firstSection = firstModule?.sections[0];
  const firstLesson = firstSection?.lessons[0];

  return (
    <div className="page-enter">
      <Hero user={telegram?.user} />

      <section className="card progress-hero" aria-label="Your learning progress">
        <p className="progress-hero-title">Your Learning Progress</p>
        <p className="progress-hero-value">
          {overall}% <small>complete</small>
        </p>
        <ProgressBar value={overall} large label={false} light />
        {continueTarget ? (
          <Link to={continueTarget} className="btn btn-white">
            Continue Learning
          </Link>
        ) : (
          <Link
            to={`/module/1/${firstSection.id}/${firstLesson.id}`}
            className="btn btn-white"
          >
            Start Learning
          </Link>
        )}
      </section>

      <section className="quick-access" aria-label="Quick access">
        <h2>Quick access</h2>
        <div className="quick-grid">
          <Link to="/courses" className="quick-card">
            <span className="quick-icon">
              <BookIcon size={21} />
            </span>
            <span className="quick-title">Courses</span>
            <span className="quick-desc">The six CTE modules</span>
          </Link>
          <Link to="/learn" className="quick-card">
            <span className="quick-icon">
              <HandIcon size={21} />
            </span>
            <span className="quick-title">Sign Language</span>
            <span className="quick-desc">Learn useful signs</span>
          </Link>
        </div>
      </section>

      <section aria-label="Continue learning">
        <h2 className="section-title">Continue learning</h2>
        {last ? (
          <Link
            to={continueTarget}
            className="card continue-card"
          >
            <p className="continue-eyebrow">
              Module {last.module.number} • {last.section.title}
            </p>
            <h3>{last.lesson.title}</h3>
            <p className="hint" style={{ margin: "4px 0 10px" }}>
              Pick up where you left off.
            </p>
            <ProgressBar value={progress.modulePercent(last.module.id)} />
          </Link>
        ) : (
          <div className="card empty-state">
            <div className="empty-icon" aria-hidden="true">
              📖
            </div>
            <h3>Start your first lesson</h3>
            <p className="hint">
              Open Module 1 to begin your learning journey.
            </p>
            {firstModule && firstLesson && (
              <Link
                to={`/module/${firstModule.id}/${firstSection.id}/${firstLesson.id}`}
                className="btn btn-secondary"
                style={{ marginTop: 10 }}
              >
                <BookOpenIcon size={18} /> Open Module 1
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
