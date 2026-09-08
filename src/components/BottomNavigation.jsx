import { NavLink } from "react-router-dom";
import { BookIcon, HandIcon, HomeIcon } from "./icons";

const tabs = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/courses", icon: BookIcon, label: "Courses" },
  { to: "/learn", icon: HandIcon, label: "Sign Language" },
];

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => {
        const TabIcon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <TabIcon size={23} />
            {tab.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
