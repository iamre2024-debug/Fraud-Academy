import { Outlet } from "react-router-dom";

export default function InvestigationWorkspace() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-fuchsia-300">Investigation Workspace</h2>
      <p>This is the shell for nested investigation workspaces. Select a tool or section from the sidebar.</p>
      <Outlet />
    </div>
  );
}
