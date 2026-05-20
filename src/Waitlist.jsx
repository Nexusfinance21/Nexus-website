import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  bg: "#0a0e1a",
  border: "#e8ecf5",
  ink: "#0a0e1a",
  inkMid: "#6b7280",
  inkLight: "#9ca3af",
  accent: "#0057ff",
  green: "#00c48c",
  greenBg: "#edfaf5",
  gold: "#f59e0b",
};

const COUNTRIES = [
  "🇵🇹 Portugal","🇧🇷 Brazil","🇪🇸 Spain","🇫🇷 France",
  "🇩🇪 Germany","🇬🇧 United Kingdom","🇮🇹 Italy","🇳🇱 Netherlands",
  "🇺🇸 United States","🇨🇦 Canada","🇦🇺 Australia","🌍 Other",
];

const AMOUNTS = [
  { label:"Just starting", sub:"€25–75/mo",  color:"#4361ee" },
  { label:"Building up",   sub:"€75–200/mo", color:C.accent  },
  { label:"Going hard",    sub:"€200–500/mo",color:C.green   },
  { label:"All in",        sub:"€500+/mo",   color:C.gold    },
];

const FOR_OPTIONS = [
  { id:"myself", emoji:"👤", label:"Myself",           sub:"Building my own path to financial freedom", color:C.accent },
  { id:"child",  emoji:"👶", label:"A newborn / child", sub:"Starting at birth = 18 extra years of compounding", color:C.green },
];

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setInView(true); }, { threshold:0.1 });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

export default function Waitlist() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name:"", investingFor:"", amount:"", country:"", email:"" });
  const [countryOpen, setCountryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const heroRef = useRef();
  const inView = useInView(heroRef);

  const canNext = [
    form.name.trim().length > 1,
    form.investingFor !== "",
    form.amount !== "",
    form.country !== "",
    form.email.includes("@") && form.email.includes("."),
  ];

  const next = () => { if(canNext[step]) setStep(s => s+1); };

  const submit = async () => {
    if(!canNext[4]) return;
    setSubmitting(true);
    try {
      await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          investingFor: form.investingFor,
          amount: form.amount,
          country: form.country,
          email: form.email,
        }),
      });
    } catch(e) { console.error(e); }
    setSubmitting(false);
    setStep(5);
  };

  const isChild = form.investingFor === "child";

  const input = {
    width:"100%", padding:"15px 18px", borderRadius:12, fontSize:15,
    border:`1.5px solid ${C.border}`, background:"#fff", color:C.ink,
    fontFamily:"inherit", outline:"none", boxSizing:"border-box",
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit','Trebuchet MS',sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        input:focus { border-color:#0057ff !important; outline:none; }
        .up { animation:up 0.4s ease forwards; }
        @keyframes up { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* NAV */}
      <div style={{ padding:"24px 32px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div onClick={()=>navigate("/")} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <div style={{ width:26, height:26, borderRadius:7, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:13, fontWeight:900 }}>N</span>
          </div>
          <span style={{ fontSize:16, fontWeight:800, color:"#fff", letterSpacing:-0.3 }}>nexus</span>
        </div>
        <button onClick={()=>navigate("/")} style={{ fontSize:12, color:"#ffffff40", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>← Back to site</button>
      </div>

      {/* HERO */}
      <div ref={heroRef} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 24px 60px", maxWidth:640, margin:"0 auto", width:"100%", textAlign:"center" }}>

        {/* STORY — condensed */}
        <div style={{ opacity:inView?1:0, transform:inView?"none":"translateY(16px)", transition:"all 0.8s ease", marginBottom:36 }}>
          <p style={{ fontSize:"clamp(16px,3vw,22px)", fontWeight:300, color:"#ffffff55", lineHeight:1.6, fontStyle:"italic", marginBottom:6 }}>
            "If you understand the power of compounding,
          </p>
          <p style={{ fontSize:"clamp(20px,4vw,32px)", fontWeight:900, color:"#fff", lineHeight:1.2, letterSpacing:-0.8, marginBottom:16 }}>
            you will create wealth<br/>
            <span style={{ color:C.accent }}>for generations."</span>
          </p>
          <p style={{ fontSize:13, color:"#ffffff40", lineHeight:1.8, maxWidth:420, margin:"0 auto 8px" }}>
            I started with <strong style={{ color:"#ffffff80" }}>€300</strong> and two bad years.{" "}
            <strong style={{ color:C.green }}>Year 3 changed everything.</strong>{" "}
            Nexus is the tool I wish I had from day one —
            and the one <strong style={{ color:"#ffffff80" }}>every newborn deserves to start with.</strong>
          </p>
          <p style={{ fontSize:11, color:"#ffffff25", letterSpacing:1.5, textTransform:"uppercase", marginTop:10 }}>
            Founder of Nexus · 25 · 🇵🇹 Portugal
          </p>
        </div>

        {/* FORM CARD */}
        <div style={{ width:"100%", maxWidth:440, background:"#fff", borderRadius:24, padding:"32px 28px", boxShadow:"0 24px 64px rgba(0,0,0,0.4)" }}>

          {step < 5 ? (
            <>
              {/* Step dots */}
              <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:28 }}>
                {[0,1,2,3,4].map(i=>(
                  <div key={i} style={{ width:i===step?20:6, height:6, borderRadius:3, transition:"all 0.3s", background:i<step?C.green:i===step?C.accent:C.border }}/>
                ))}
              </div>

              {/* STEP 0 — Name */}
              {step===0 && (
                <div className="up">
                  <h3 style={{ fontSize:20, fontWeight:800, color:C.ink, marginBottom:6 }}>Hey, what's your name? 👋</h3>
                  <p style={{ fontSize:13, color:C.inkMid, marginBottom:20, lineHeight:1.6 }}>Let's build wealth together.</p>
                  <input style={input} type="text" placeholder="Your first name" value={form.name}
                    onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                    onKeyDown={e=>e.key==="Enter"&&next()} autoFocus/>
                  <button onClick={next} disabled={!canNext[0]} style={{ width:"100%", marginTop:12, padding:"14px", borderRadius:12, fontSize:14, fontWeight:800, background:canNext[0]?C.accent:C.border, color:canNext[0]?"#fff":C.inkLight, border:"none", cursor:canNext[0]?"pointer":"not-allowed", fontFamily:"inherit" }}>
                    {canNext[0]?`Continue, ${form.name.split(" ")[0]} →`:"Enter your name"}
                  </button>
                </div>
              )}

              {/* STEP 1 — Who for */}
              {step===1 && (
                <div className="up">
                  <h3 style={{ fontSize:20, fontWeight:800, color:C.ink, marginBottom:6 }}>Who are you investing for? 🌱</h3>
                  <p style={{ fontSize:13, color:C.inkMid, marginBottom:20, lineHeight:1.6 }}>The best time to start was yesterday.<br/>The second best? Right now.</p>
                  <div style={{ display:"grid", gap:10 }}>
                    {FOR_OPTIONS.map(o=>(
                      <button key={o.id} onClick={()=>{ setForm(f=>({...f,investingFor:o.id})); setTimeout(()=>setStep(2),250); }} style={{ display:"flex", alignItems:"center", gap:16, padding:"18px 20px", borderRadius:14, cursor:"pointer", fontFamily:"inherit", border:`1.5px solid ${form.investingFor===o.id?o.color:C.border}`, background:form.investingFor===o.id?o.color+"08":"#fff", transition:"all 0.15s", textAlign:"left" }}>
                        <span style={{ fontSize:28, flexShrink:0 }}>{o.emoji}</span>
                        <div>
                          <div style={{ fontSize:14, fontWeight:800, color:C.ink, marginBottom:3 }}>{o.label}</div>
                          <div style={{ fontSize:11, color:o.color, fontWeight:600, lineHeight:1.4 }}>{o.sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop:14, padding:"10px 14px", background:"#f0fdf7", borderRadius:10, border:"1px solid #00c48c22" }}>
                    <p style={{ fontSize:11, color:C.inkMid, lineHeight:1.6 }}>
                      💡 <strong style={{ color:C.ink }}>Did you know?</strong> A child starting at birth with just €50/month could reach <strong style={{ color:C.green }}>$1M by age 34</strong> — before their parents retire.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2 — Amount */}
              {step===2 && (
                <div className="up">
                  <h3 style={{ fontSize:20, fontWeight:800, color:C.ink, marginBottom:6 }}>
                    {isChild?`Monthly goal for ${form.name.split(" ")[0]}'s child? 👶`:"Monthly investment goal?"}
                  </h3>
                  <p style={{ fontSize:13, color:C.inkMid, marginBottom:20, lineHeight:1.6 }}>
                    {isChild?"Even €25/month at birth compounds into something extraordinary.":"I started with €75. Every amount counts."}
                  </p>
                  <div style={{ display:"grid", gap:8 }}>
                    {AMOUNTS.map(a=>(
                      <button key={a.label} onClick={()=>{ setForm(f=>({...f,amount:a.label})); setTimeout(()=>setStep(3),250); }} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderRadius:12, cursor:"pointer", fontFamily:"inherit", border:`1.5px solid ${form.amount===a.label?a.color:C.border}`, background:form.amount===a.label?a.color+"08":"#fff", transition:"all 0.15s" }}>
                        <span style={{ fontSize:14, fontWeight:700, color:C.ink }}>{a.label}</span>
                        <span style={{ fontSize:12, color:a.color, fontWeight:700 }}>{a.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 — Country */}
              {step===3 && (
                <div className="up">
                  <h3 style={{ fontSize:20, fontWeight:800, color:C.ink, marginBottom:6 }}>Where are you building from?</h3>
                  <p style={{ fontSize:13, color:C.inkMid, marginBottom:20, lineHeight:1.6 }}>We'll tailor insights for your region.</p>
                  <div style={{ position:"relative" }}>
                    <button onClick={()=>setCountryOpen(o=>!o)} style={{ ...input, display:"flex", justifyContent:"space-between", alignItems:"center", border:`1.5px solid ${form.country?C.accent:C.border}`, color:form.country?C.ink:C.inkLight, cursor:"pointer", background:"#fff" }}>
                      <span>{form.country||"Select country"}</span>
                      <span style={{ color:C.inkLight, transition:"transform 0.2s", transform:countryOpen?"rotate(180deg)":"" }}>▾</span>
                    </button>
                    {countryOpen && (
                      <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:"#fff", border:`1.5px solid ${C.border}`, borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.1)", zIndex:10, maxHeight:200, overflowY:"auto" }}>
                        {COUNTRIES.map(c=>(
                          <button key={c} onClick={()=>{ setForm(f=>({...f,country:c})); setCountryOpen(false); setTimeout(()=>setStep(4),200); }} style={{ display:"block", width:"100%", padding:"11px 16px", textAlign:"left", background:"none", border:"none", fontSize:14, color:C.ink, cursor:"pointer", fontFamily:"inherit" }}
                            onMouseEnter={e=>e.currentTarget.style.background="#f8f9fc"}
                            onMouseLeave={e=>e.currentTarget.style.background="none"}
                          >{c}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  {form.country && (
                    <button onClick={next} style={{ width:"100%", marginTop:12, padding:"14px", borderRadius:12, fontSize:14, fontWeight:800, background:C.accent, color:"#fff", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Continue →</button>
                  )}
                </div>
              )}

              {/* STEP 4 — Email */}
              {step===4 && (
                <div className="up">
                  <h3 style={{ fontSize:20, fontWeight:800, color:C.ink, marginBottom:6 }}>Last one, {form.name.split(" ")[0]} 🎯</h3>
                  <p style={{ fontSize:13, color:C.inkMid, marginBottom:20, lineHeight:1.6 }}>Where should I send your early access?</p>
                  <div style={{ background:"#f8f9fc", borderRadius:10, padding:"10px 14px", marginBottom:16, display:"flex", gap:12, fontSize:12, color:C.inkMid, flexWrap:"wrap" }}>
                    <span>👤 {form.name}</span>
                    <span>{isChild?"👶 For a child":"🙋 For myself"}</span>
                    <span>💰 {AMOUNTS.find(a=>a.label===form.amount)?.sub}</span>
                    <span>🌍 {form.country.split(" ")[1]||form.country}</span>
                  </div>
                  <input style={input} type="email" placeholder="your@email.com" value={form.email}
                    onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                    onKeyDown={e=>e.key==="Enter"&&submit()}/>
                  <button onClick={submit} disabled={!canNext[4]||submitting} style={{ width:"100%", marginTop:12, padding:"14px", borderRadius:12, fontSize:14, fontWeight:800, background:canNext[4]?`linear-gradient(135deg,${C.accent},#0040cc)`:C.border, color:canNext[4]?"#fff":C.inkLight, border:"none", cursor:canNext[4]?"pointer":"not-allowed", fontFamily:"inherit", boxShadow:canNext[4]?"0 6px 20px rgba(0,87,255,0.25)":"none" }}>
                    {submitting?"Joining...":"Join Nexus →"}
                  </button>
                  <p style={{ fontSize:11, color:C.inkLight, textAlign:"center", marginTop:10 }}>🔒 No spam. Unsubscribe anytime.</p>
                </div>
              )}
            </>
          ) : (
            /* SUCCESS */
            <div className="up" style={{ textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>{isChild?"👶":"🎉"}</div>
              <h3 style={{ fontSize:22, fontWeight:900, color:C.ink, marginBottom:10 }}>You're in, {form.name.split(" ")[0]}.</h3>
              <p style={{ fontSize:14, color:C.inkMid, lineHeight:1.7, marginBottom:20 }}>
                {isChild
                  ? <>You're giving a child the greatest gift — <strong style={{ color:C.green }}>time in the market.</strong><br/>I'll reach out personally when we launch.</>
                  : <>You're among the first <strong style={{ color:C.accent }}>1,248</strong> on the journey.<br/>I'll reach out personally when we launch.</>
                }
              </p>
              {isChild && (
                <div style={{ background:"#f0fdf7", border:"1px solid #00c48c30", borderRadius:12, padding:"14px 16px", marginBottom:20, fontSize:12, color:C.inkMid, lineHeight:1.7 }}>
                  💡 A child starting today with <strong style={{ color:C.ink }}>€50/month</strong> reaches{" "}
                  <strong style={{ color:C.green }}>$1,000,000 by age 34</strong> — before most people even start saving.
                </div>
              )}
              <div style={{ background:"#0a0e1a", borderRadius:14, padding:"18px 20px", marginBottom:20 }}>
                <p style={{ fontSize:14, fontStyle:"italic", color:"#ffffff70", lineHeight:1.6, fontWeight:300 }}>
                  "If you understand the power of compounding, you will create wealth{" "}
                  <strong style={{ color:C.accent, fontStyle:"normal" }}>for generations.</strong>"
                </p>
              </div>
              <div style={{ display:"flex", gap:20, justifyContent:"center", fontSize:11, color:C.inkLight, marginBottom:20 }}>
                {[["🔒","No spam"],["📱","App 2027"],["🏦","Bank 2029"]].map(([ic,lb])=>(
                  <div key={lb} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                    <span style={{ fontSize:16 }}>{ic}</span>{lb}
                  </div>
                ))}
              </div>
              <button onClick={()=>navigate("/")} style={{ fontSize:13, color:C.accent, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>← Back to Nexus</button>
            </div>
          )}
        </div>

        {step<5 && (
          <p style={{ fontSize:11, color:"#ffffff20", marginTop:20, letterSpacing:0.5 }}>nexusapp.app · Portugal 🇵🇹</p>
        )}
      </div>
    </div>
  );
}
