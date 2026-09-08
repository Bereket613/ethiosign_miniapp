import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { modules, moduleLessons } from "./data/modules";

const STORAGE_KEY = "ethiosign.progress.v1";

const emptyProgress = { completed: {}, lastLessonId: null };

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw);
    return {
      completed: parsed.completed ?? {},
      lastLessonId: parsed.lastLessonId ?? null,
    };
  } catch {
    return emptyProgress;
  }
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable */
    }
  }, [progress]);

  const value = useMemo(() => {
    const complete = (lessonId) =>
      setProgress((p) =>
        p.completed[lessonId]
          ? p
          : { ...p, completed: { ...p.completed, [lessonId]: Date.now() } }
      );

    const setLastLesson = (lessonId) =>
      setProgress((p) =>
        p.lastLessonId === lessonId ? p : { ...p, lastLessonId: lessonId }
      );

    const isComplete = (lessonId) => Boolean(progress.completed[lessonId]);

    const sectionPercent = (moduleId, sectionId) => {
      const module = modules.find((m) => String(m.id) === String(moduleId));
      const section = module?.sections.find(
        (s) => s.id === sectionId
      );
      if (!section || section.lessons.length === 0) return 0;
      const done = section.lessons.filter((l) => progress.completed[l.id]).length;
      return Math.round((done / section.lessons.length) * 100);
    };

    const modulePercent = (moduleId) => {
      const module = modules.find((m) => String(m.id) === String(moduleId));
      if (!module) return 0;
      const lessons = moduleLessons(module);
      if (lessons.length === 0) return 0;
      const done = lessons.filter((l) => progress.completed[l.id]).length;
      return Math.round((done / lessons.length) * 100);
    };

    const overallPercent = () => {
      const all = modules.flatMap((m) => moduleLessons(m));
      const done = all.filter((l) => progress.completed[l.id]).length;
      return all.length === 0 ? 0 : Math.round((done / all.length) * 100);
    };

    const completedCount = () => Object.keys(progress.completed).length;

    const lastLesson = () => {
      if (!progress.lastLessonId) return null;
      for (const module of modules) {
        for (const section of module.sections) {
          for (const lesson of section.lessons) {
            if (lesson.id === progress.lastLessonId) {
              return { module, section, lesson };
            }
          }
        }
      }
      return null;
    };

    const reset = () => setProgress(emptyProgress);

    return {
      complete,
      setLastLesson,
      isComplete,
      sectionPercent,
      modulePercent,
      overallPercent,
      completedCount,
      lastLesson,
      reset,
    };
  }, [progress]);

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
