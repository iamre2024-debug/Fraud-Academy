import { useParams } from "react-router-dom";
import { makeCase } from "../data/caseGenerator";

/**
 * Customer 360 – design‑locked layout
 * -------------------------------------------------------------
 * • Dark neon cards, purple/pink accents, readable on mobile.
 * • Evidence‑only language – no auto‑fraud conclusions.
 * • Placeholder data uses makeCase(idx) until real case context wiring.
 */
export default function Customer360() {
  const { caseId } = useParams();
  // Extract numeric index from FA‑2026‑<n>
  const idx = caseId ? parseInt(caseId.split("-")[2], 10) - 1000 : 0;
  const c = makeCase(idx >= 0 && Number.isFinite(idx) ? idx : 0);

  const riskClass =
    c.priority === "Critical"
      ? "bg-red-600/70"
      : c.priority === "High"
      ? "bg-orange-600/70"
      : "bg-yellow-600/50";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-[#1a062f] shadow-inner shadow-fuchsia-900/40">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-700/60 text-2xl font-bold uppercase">
            {c.customer[0]}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold truncate">{c.customer}</h2>
            <div className="text-sm text-white/60">Customer since April&nbsp;2019</div>
          </div>
          <span className={`ml-auto text-xs px-2 py-1 rounded-full ${riskClass}`}>
            {c.priority} Risk
          </span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {/* Contact & Identity */}
        <Card title="Contact & Identity">
          <KV k="Profile ID" v={c.id} />
          <KV k="DOB" v="1988‑04‑18" />
          <KV k="Email" v={`${c.customer.toLowerCase().replace(" ", ".")}@examplemail.com`} />
          <KV k="Phone" v="(214) 555‑1234" />
          <KV k="Address" v="7429 Violet Trace, Dallas, TX" long />
        </Card>

        {/* Relationship & Behavior */}
        <Card title="Relationship & Behavior">
          <KV k="Products" v="Checking, Savings, Credit Card" />
          <KV k="Account Age" v="7 years 3 months" />
          <KV k="Average Spend" v="$87" />
          <KV k="Largest Purchase" v="$1,240" />
          <KV k="Normal Login Hours" v="08:00 – 21:00" />
        </Card>

        {/* Account History */}
        <Card title="Account History">
          <KV k="Last Contact" v="3 days ago – password reset help" long />
          <KV k="Prior Fraud Claims" v="2 digital access, 1 card dispute" long />
          <KV k="Current Balance" v="$5,932" />
          <KV k="Credit Utilization" v="34%" />
        </Card>

        {/* Profile Change Summary */}
        <Card title="Profile Change Summary" highlight="bad">
          <KV k="Password" v="Changed 3 days ago" />
          <KV k="Recovery Email" v="Updated same session" long />
          <KV k="MFA Device" v="New SMS route" />
          <KV k="Address" v="No change" />
        </Card>

        {/* Devices & Locations */}
        <Card title="Devices & Locations">
          <KV k="Trusted Device" v="iPhone 15 – trusted" long />
          <KV k="New Device" v={`${c.device} – first seen during claim`} long />
          <KV k="Normal Region" v="Dallas, TX" />
          <KV k="VPN/Proxy" v="Possible proxy‑style signal" />
        </Card>
      </div>
    </div>
  );
}

/** Utility sub‑components */
function Card({ title, children, highlight }) {
  const border = highlight === "bad" ? "border-red-600/50" : "border-fuchsia-700/40";
  return (
    <div className={`card p-4 bg-[#1a062f] border ${border} rounded-xl space-y-2`}>
      <h3 className="text-cyan-300 font-semibold mb-1 truncate">{title}</h3>
      {children}
    </div>
  );
}

function KV({ k, v, long }) {
  return (
    <div className="flex text-sm">
      <div className="w-40 text-white/60 flex-shrink-0">{k}</div>
      <div className={`flex-1 ${long ? "whitespace-normal" : "truncate"}`}>{v}</div>
    </div>
  );
}
