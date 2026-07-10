import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "🏠 Dashboard" },
  { to: "/case/FA-2026-1000/customer360", label: "👤 Customer 360" },
  { to: "/case/FA-2026-1000/identity-intel", label: "🛰️ Identity Intel" },
  { to: "/case/FA-2026-1000/login-history", label: "🔑 Login History" },
  { to: "/case/FA-2026-1000/device-intel", label: "📱 Device Intel" },
  { to: "/case/FA-2026-1000/financial", label: "💰 Financial" },
  { to: "/case/FA-2026-1000/evidence", label: "📄 Evidence" },
  { to: "/case/FA-2026-1000/timeline", label: "🗓️ Timeline" },
  { to: "/case/FA-2026-1000/review", label: "⚖️ Review" },
];

export default function WorkspaceNav() {
  return (
    <nav className="p-4 flex flex-col gap-2 text-sm">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-lg hover:bg-fuchsia-800/20 transition ${
              isActive ? "bg-fuchsia-600/20" : ""
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
