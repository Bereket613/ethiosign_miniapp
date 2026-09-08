import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { useProgress } from "../progress";

export default function ModuleCard({ module }) {
  const progress = useProgress();
  const percent = progress.modulePercent(module.id);

  return (
    <Link to={`/module/${module.id}`} className="card module-card">
      <span className="module-number">Module {module.number}</span>
      <h3>{module.title}</h3>
      <p className="module-desc">{module.description}</p>
      <ProgressBar value={percent} />
      <span className="btn btn-secondary">Open Module</span>
    </Link>
  );
}
