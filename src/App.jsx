import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const C = {
  bg: "#0a0e1a",
  bgDark: "#05070f",
  card: "#111827",
  border: "#1e2a44",
  ink: "#f1f5f9",
  inkMid: "#94a3b8",
  inkLight: "#cbd5e1",
  accent: "#3b82f6",
  accentDark: "#1e40af",
  green: "#22c55e",
  gold: "#fbbf24",
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
  { id: "starter", label: "Starter", emoji: "📦", monthly: 75, extra: 400, desc: "€75/mo + €400 yearly boost" },
  { id: "builder", label: "Builder", emoji: "🏗️", monthly: 150, extra: 800, desc: "€150/mo + €800 yearly boost" },
  { id: "aggressive", label: "Aggressive", emoji: "🚀", monthly: 300, extra: 1500, desc: "€300/mo + €1,500 yearly boost" },
  { id: "custom", label: "Custom", emoji: "⚙️", monthly: null, extra: null, desc: "Set your own pace" },
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
    <div style={{ background: "#0a1428", borderRadius: 10, padding: "12px 16px", color: "#fff" }}>
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
      
      {/* HERO */}
      <section style={{ background: "linear-gradient(to bottom, #0a1428, #05070f)", padding: "140px 24px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h1 style={{ fontSize: "4.5rem", fontWeight: 900, lineHeight: 1.05, marginBottom: 20 }}>
            Your path to <span style={{ color: C.accent }}>€1 Million</span>
          </h1>
          <p style={{ fontSize: 24, color: C.inkMid, maxWidth: 720, margin: "0 auto" }}>
            Starting with just <strong>€300</strong>.<br />
            The best time to invest was 20 years ago.<br />
            The second best time is <strong>today</strong>.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" style={{ padding: "90px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 48 }}>
            
            {/* Left Controls */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
              <h3 style={{ marginBottom: 28, fontSize: 22 }}>Choose your investing pace</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p.id)}
                    style={{
                      padding: "24px 18px",
                      borderRadius: 16,
                      background: preset === p.id ? C.accentDark : C.card,
                      border: `2px solid ${preset === p.id ? C.accent : C.border}`,
                      color: preset === p.id ? "#fff" : C.ink,
                      textAlign: "left"
                    }}
                  >
                    <div style={{ fontSize: 34, marginBottom: 12
