import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const C = {
  bg: "#f8f9fc",
  bgDark: "#0a0e1a",
  card: "#ffffff",
  border: "#e8ecf5",
  ink: "#0a0e1a",
  inkMid: "#6b7280",
  inkLight: "#9ca3af",
  accent: "#0057ff",
  accentBg: "#eff4ff",
  green: "#00c48c",
  greenBg: "#edfaf5",
  gold: "#f59e0b",
};

function project(monthly, extraPerYear, years, rate = 0.155) {
  const mr = rate / 12;
  let bal = 300;
  const pts = [];
  for (let m = 0; m <= years * 12; m++) {
    if (m > 0) {
      const boost = m % 6 === 0;
      bal = bal * (1 + mr) + monthly + (boost ? extraPerYear / 2 : 0);
    }
    if (m % 12 === 0) pts.push({ year: m / 12, value: Math.round(bal) });
  }
  return pts;
}

function milestoneYear(pts, target) {
  const found = pts.find(p => p.value >= target);
  return found ? found.year : null;
}

function useCountUp(target, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

const PRESETS = [
  { id: "starter", label: "Starter", emoji: "📦", monthly: 75, extra: 400, desc: "Starter plan" },
  { id: "builder", label: "Builder", emoji: "🏗️", monthly: 150, extra: 800, desc: "Builder plan" },
  { id: "aggressive", label: "Aggressive", emoji: "🚀", monthly: 300, extra: 1500, desc: "Aggressive plan" },
  { id: "custom", label: "Custom", emoji: "⚙️", monthly: null, extra: null, desc: "Custom" },
];

const MILESTONES = [
  { label: "€10K", target: 10000, color: C.accent },
  { label: "€50K", target: 50000, color: C.green },
  { label: "€250K", target: 250000, color: C.gold },
  { label: "€1M", target: 1000000, color: "#e11d48" },
];

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.bgDark, borderRadius: 10, padding: "10px 14px", color: "#fff" }}>
      €{payload[0].value.toLocaleString()}
    </div>
  );
};

export default function App() {
  const [preset, setPreset] = useState("builder");
  const [monthly, setMonthly] = useState(150);
  const [extra, setExtra] = useState(800);
  const [years, setYears] = useState(30);

  const isCustom = preset === "custom";
  const am = isCustom ? monthly : PRESETS.find(p => p.id === preset)?.monthly;
  const ae = isCustom ? extra : PRESETS.find(p => p.id === preset)?.extra;

  const pts = project(am, ae, years);
  const finalVal = pts[pts.length - 1]?.value ?? 0;
  const displayed = useCountUp(finalVal, 900);

  const milData = MILESTONES.map(m => ({
    ...m,
    yr: milestoneYear(pts, m.target)
  }));

  return (
    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: C.bg, color: C.ink, minHeight: "100vh" }}>
      {/* Your full site code would go here - this is the cleaned base */}
      {/* Paste the rest of your sections (Hero, Calculator, Story, Waitlist, etc.) */}
      
      {/* Example Calculator Section */}
      <section id="calculator" style={{ padding: "
