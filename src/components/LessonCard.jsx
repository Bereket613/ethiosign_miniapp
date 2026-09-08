import { Link } from "react-router-dom";
import { useProgress } from "../progress";
import { CheckIcon, ChevronRightIcon } from "./icons";

export default function LessonCard({ lesson, sectionTitle, to }) {
  const progress = useProgress();
  const done = progress.isComplete(lesson.id);

  return (
    <Link to={to} className="lesson-row" aria-label={`${lesson.title}${done ? ", completed" : ""}`}>
      <span className={`lesson-check${done ? " done" : ""}`} aria-hidden="true">
        {done ? <CheckIcon size={15} /> : <span style={{ fontSize: 11, fontWeight: 700 }}>▶</span>}
      </span>
      <span className="lesson-info">
        <span className="lesson-title">{lesson.title}</span>
        <span className="lesson-meta">
          {sectionTitle} • {lesson.duration}
          {done ? " • Completed" : ""}
        </span>
      </span>
      <span className="lesson-arrow" aria-hidden="true">
        <ChevronRightIcon size={18} />
      </span>
    </Link>
  );
}
