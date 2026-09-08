import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import ProgressBar from "../components/ProgressBar";
import { findLesson, getModule, moduleLessons } from "../data/modules";
import { useProgress } from "../progress";
import { hideBackButton, haptic, showBackButton } from "../telegram";

export default function Lesson() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const progress = useProgress();

  const found = findLesson(lessonId);
  const module = found?.module ?? getModule(moduleId);

  useEffect(() => {
    showBackButton(() => navigate(-1));
    return () => hideBackButton();
  }, [navigate]);

  useEffect(() => {
    if (found) progress.setLastLesson(found.lesson.id);
  }, [found?.lesson.id]);

  if (!found || !module) {
    return (
      <div className="notfound page-enter">
        <h2>We couldn't find this lesson</h2>
        <p className="hint">It may have been moved or renamed.</p>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: 14 }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  const { section, lesson } = found;
  const flat = moduleLessons(module);
  const index = flat.findIndex((l) => l.id === lesson.id);
  const prev = index > 0 ? flat[index - 1] : null;
  const next = index < flat.length - 1 ? flat[index + 1] : null;
  const done = progress.isComplete(lesson.id);

  const goTo = (target) => {
    if (!target) return;
    const targetSection = module.sections.find((s) =>
      s.lessons.some((l) => l.id === target.id)
    );
    haptic("light");
    navigate(`/module/${module.id}/${targetSection.id}/${target.id}`);
  };

  const handleEnded = () => {
    if (!done) {
      progress.complete(lesson.id);
      haptic("success");
    }
  };

  const markComplete = () => {
    if (done) return;
    progress.complete(lesson.id);
    haptic("success");
  };

  return (
    <div className="page-enter">
      <header className="back-header">
        <Link
          to={`/module/${module.id}`}
          className="back-btn"
          aria-label="Back to module"
        >
          ←
        </Link>
        <div className="back-titles">
          <p className="eyebrow">{section.title}</p>
          <h2>{lesson.title}</h2>
        </div>
      </header>

      <VideoPlayer lesson={lesson} onEnded={handleEnded} />

      <section className="card" aria-label="About this lesson">
        <p style={{ marginTop: 0, color: "var(--text-secondary)" }}>
          {lesson.description}
        </p>
        {lesson.demo && <span className="badge badge-demo">Demo content</span>}
      </section>

      <section className="card transcript-block" aria-label="Lesson transcript">
        <h3>Lesson Transcript</h3>
        <p>{lesson.transcript}</p>
      </section>

      <section className="card" aria-label="Lesson progress">
        <div className="card-title-row" style={{ marginBottom: 8 }}>
          <h3>Module progress</h3>
          <span className="hint">
            {flat.filter((l) => progress.isComplete(l.id)).length} of{" "}
            {flat.length} lessons
          </span>
        </div>
        <ProgressBar value={progress.modulePercent(module.id)} label={false} />
        <button
          type="button"
          className={`btn complete-btn${done ? " done" : " btn-primary"}`}
          style={{ marginTop: 12 }}
          onClick={markComplete}
          disabled={done}
        >
          {done ? "✓ Lesson completed" : "Mark as Complete"}
        </button>
      </section>

      <div className="lesson-nav">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => goTo(prev)}
          disabled={!prev}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => goTo(next)}
          disabled={!next}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
