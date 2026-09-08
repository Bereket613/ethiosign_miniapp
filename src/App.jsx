import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Module from "./pages/Module";
import Lesson from "./pages/Lesson";
import Learn from "./pages/Learn";
import { initTelegram } from "./telegram";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="notfound page-enter">
      <h2>Page not found</h2>
      <p className="hint">Let's get you back to your learning.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 14 }}>
        Go Home
      </Link>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const telegram = initTelegram();

  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  const showNav = ["/", "/courses", "/learn"].includes(pathname);

  return (
    <div className="app">
      <ScrollToTop />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home telegram={telegram} />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/module/:moduleId" element={<Module />} />
          <Route
            path="/module/:moduleId/:sectionId/:lessonId"
            element={<Lesson />}
          />
          <Route path="/learn" element={<Learn />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showNav && <BottomNavigation />}
    </div>
  );
}
