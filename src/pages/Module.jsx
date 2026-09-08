import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LessonCard from "../components/LessonCard";
import ProgressBar from "../components/ProgressBar";
import {
  BookOpenIcon,
  ChevronRightIcon,
  HeadphonesIcon,
  PresentationIcon,
  UsersIcon,
} from "../components/icons";
import { getModule, moduleLessons } from "../data/modules";
import { useProgress } from "../progress";
import { hideBackButton, haptic, showBackButton } from "../telegram";

const SECTION_ICONS = {
  overview: BookOpenIcon,
  facilitator: PresentationIcon,
  peer: UsersIcon,
  "self-paced": HeadphonesIcon,
};

export default function Module() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const module = getModule(moduleId);
  const progress = useProgress();
  const percent = progress.modulePercent(moduleId);

  useEffect(() => {
    showBackButton(() => navigate("/courses"));
    return () => hideBackButton();
  }, [navigate]);

  if (!module) {
    return (
      <div className="notfound page-enter">
        <h2>We couldn't find this module</h2>
        <p className="hint">It may have been moved or renamed.</p>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: 14 }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  const openSection = (section) => {
    const nextLesson =
      section.lessons.find((l) => !progress.isComplete(l.id)) ||
      section.lessons[0];
    if (nextLesson) {
      haptic("light");
      navigate(`/module/${module.id}/${section.id}/${nextLesson.id}`);
    }
  };

  const lessons = moduleLessons(module);
  const doneCount = lessons.filter((l) => progress.isComplete(l.id)).length;

  return (
    <div className="page-enter">
      <header className="back-header">
        <Link to="/courses" className="back-btn" aria-label="Back to courses">
          ←
        </Link>
        <div className="back-titles">
          <p className="eyebrow">Module {module.number}</p>
          <h1>{module.title}</h1>
        </div>
      </header>

      <section className="card" aria-label="Module progress">
        <p style={{ marginTop: 0, color: "var(--text-secondary)" }}>
          {module.description}
        </p>
        <div className="card-title-row" style={{ margin: "10px 0 8px" }}>
          <h3>
            {percent}% complete
          </h3>
          <span className="hint">
            {doneCount} of {lessons.length} lessons
          </span>
        </div>
        <ProgressBar value={percent} large label={false} />

        <hr className="divider" />

        <h3 style={{ marginBottom: 8 }}>Learning support</h3>
        <p className="hint" style={{ marginTop: 0, marginBottom: 10 }}>
          Watch with captions or sign-language support.
        </p>
        <div className="access-chips">
          <span className="access-chip">🤟 Sign Language</span>
          <span className="access-chip">CC Captions</span>
          <span className="access-chip">📝 Transcript</span>
        </div>
      </section>

      {module.sections.map((section) => {
        const SectionIcon = SECTION_ICONS[section.id] || BookOpenIcon;
        const sectionDone = section.lessons.filter((l) =>
          progress.isComplete(l.id)
        ).length;
        return (
          <section key={section.id} className="card section-card">
            <button
              type="button"
              className="section-header"
              onClick={() => openSection(section)}
              aria-label={`Open ${section.title}, ${progress.sectionPercent(module.id, section.id)}% complete`}
            >
              <span className="section-icon" aria-hidden="true">
                <SectionIcon size={21} />
              </span>
              <span className="section-info">
                <span className="section-name">{section.title}</span>
                <span className="section-percent">
                  {progress.sectionPercent(module.id, section.id)}% complete
                </span>
              </span>
              <span className="section-chevron" aria-hidden="true">
                <ChevronRightIcon size={20} />
              </span>
            </button>
            {section.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                sectionTitle={section.title}
                to={`/module/${module.id}/${section.id}/${lesson.id}`}
              />
            ))}
            <p
              className="hint"
              style={{ fontSize: 12, padding: "8px 16px 12px", margin: 0 }}
            >
              {sectionDone} of {section.lessons.length} lessons completed
            </p>
          </section>
        );
      })}
    </div>
  );
}
