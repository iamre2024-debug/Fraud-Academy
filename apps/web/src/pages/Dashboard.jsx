import { generateCases } from "../data/caseGenerator";

const cases = generateCases();

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-fuchsia-300">Open Case Queue</h2>
        <p className="text-sm text-white/80 mb-2">
          {cases.length} generated sample cases (demo data)
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cases.map((c) => (
            <div key={c.id} className="rounded-xl bg-[#1a062f] p-4 shadow-lg hover:shadow-fuchsia-800/50 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-sm text-fuchsia-300">{c.id}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    c.priority === "Critical"
                      ? "bg-red-600/60"
                      : c.priority === "High"
                      ? "bg-orange-600/60"
                      : "bg-yellow-600/40"
                  }`}
                >
                  {c.priority}
                </span>
              </div>
              <div className="text-sm font-medium leading-tight">
                {c.customer}
              </div>
              <div className="text-xs text-white/70 mb-2">{c.type}</div>
              <div className="text-xs text-white/50 flex justify-between">
                <span>{c.merchant}</span>
                <span>${c.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
