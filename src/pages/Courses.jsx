import ModuleCard from "../components/ModuleCard";
import { useProgress } from "../progress";
import { modules } from "../data/modules";

export default function Courses() {
  const progress = useProgress();

  return (
    <div className="page-enter">
      <header className="page-header">
        <h1>CTE Courses</h1>
        <p className="hint">
          Explore the six professional development modules.
        </p>
      </header>

      {modules.map((module) => (
        <ModuleCard key={module.id} module={module} />
      ))}

      <p className="footer-note">
        {progress.completedCount()} of{" "}
        {modules.reduce(
          (sum, m) =>
            sum + m.sections.reduce((s, sec) => s + sec.lessons.length, 0),
          0
        )}{" "}
        lessons completed so far
      </p>
    </div>
  );
}
