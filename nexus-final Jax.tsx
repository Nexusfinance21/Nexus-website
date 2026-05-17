import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const C = {
  bg:"#f8f9fc", bgDark:"#0a0e1a", card:"#ffffff", border:"#e8ecf5",
  ink:"#0a0e1a", inkMid:"#6b7280", inkLight:"#9ca3af",
  accent:"#0057ff", accentBg:"#eff4ff", green:"#00c48c", greenBg:"#edfaf5",
  gold:"#f59e0b",
};

function project(monthly, extraPerYear, years, rate=0.155) {
  const mr = rate/12; let bal=300; const pts=[];
  for(let m=0; m<=years*12; m++) {
    if(m>0){ const boost=m%6===0; bal=bal*(1+mr)+monthly+(boost?extraPerYear/2:0); }
    if(m%12===0) pts.push({year:m/12, value:Math.round(bal)});
  }
  return pts;
}

function milestoneYear(pts, target) { return pts.find(p=>p.value>=target)?.year; }

function useCountUp(target, duration=1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start=null;
    const step=(ts)=>{ if(!start)start=ts; const p=Math.min((ts-start)/duration,1); const e=1-Math.pow(1-p,3); setVal(Math.round(target*e)); if(p<1)requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

const PRESETS = [
  {id:"starter",  label:"Starter",    emoji:"🌱", monthly:75,  extra:400,  desc:"€75/mo + 2 boosts"},
  {id:"builder",  label:"Builder",    emoji:"🏗️", monthly:150, extra:800,  desc:"€150/mo + 2 boosts"},
  {id:"aggressive",label:"Aggressive",emoji:"🚀", monthly:300, extra:1500, desc:"€300/mo + 2 boosts"},
  {id:"custom",   label:"Custom",     emoji:"⚙️", monthly:null,extra:null, desc:"Set your own pace"},
];

const MILESTONES = [
  {label:"$10K",  target:10_000,    color:C.accent},
  {label:"$50K",  target:50_000,    color:C.green},
  {label:"$250K", target:250_000,   color:C.gold},
  {label:"$1M",   target:1_000_000, color:"#e11d48"},
];

const Tip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return <div style={{background:C.bgDark,borderRadius:10,padding:"10px 14px",fontSize:12,color:"#fff"}}><p style={{color:"#666",margin:"0 0 4px",fontSize:11}}>Year {label}</p>{payload.map((p,i)=><p key={i} style={{margin:"2px 0",color:p.stroke}}>{p.name}: <strong>${p.value?.toLocaleString()}</strong></p>)}</div>;
};

const Btn = ({children,primary,onClick}) => (
  <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:primary?"14px 28px":"13px 26px",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",border:primary?"none":`1.5px solid ${C.border}`,background:primary?C.accent:"transparent",color:primary?"#fff":C.ink,fontFamily:"inherit"}}>{children}</button>
);

function Calculator() {
  const [preset,setPreset]=useState("builder");
  const [monthly,setMonthly]=useState(150);
  const [extra,setExtra]=useState(800);
  const [years,setYears]=useState(30);
  const isCustom=preset==="custom";
  const am=isCustom?monthly:PRESETS.find(p=>p.id===preset)?.monthly;
  const ae=isCustom?extra:PRESETS.find(p=>p.id===preset)?.extra;
  const pts=project(am,ae,years);
  const finalVal=pts[pts.length-1]?.value??0;
  const displayed=useCountUp(finalVal,900);
  const milData=MILESTONES.map(m=>({...m,yr:milestoneYear(pts,m.target)}));

  return (
    <section style={{background:C.bg,padding:"80px 24px"}} id="calculator">
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:50}}>
          <span style={{display:"inline-flex",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:C.accent,background:C.accentBg,padding:"4px 12px",borderRadius:20}}>💡 Calculator</span>
          <h2 style={{fontSize:36,fontWeight:900,color:C.ink,margin:"16px 0 12px",letterSpacing:-1.5}}>See your path to $1M</h2>
          <p style={{fontSize:16,color:C.inkMid,maxWidth:440,margin:"0 auto"}}>Pick a preset or customise. Your plan updates instantly.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:24,alignItems:"start"}}>
          <div style={{display:"grid",gap:14}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"24px"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.inkLight,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Choose your pace</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {PRESETS.map(p=>(
                  <button key={p.id} onClick={()=>setPreset(p.id)} style={{background:preset===p.id?C.accent:C.bg,color:preset===p.id?"#fff":C.ink,border:`1.5px solid ${preset===p.id?C.accent:C.border}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                    <div style={{fontSize:16,marginBottom:4}}>{p.emoji}</div>
                    <div style={{fontSize:13,fontWeight:700}}>{p.label}</div>
                    <div style={{fontSize:11,opacity:0.7,marginTop:2}}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            {isCustom && (
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"24px"}}>
                <div style={{fontSize:11,fontWeight:700,color:C.inkLight,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Custom amounts</div>
                {[{label:"Monthly",val:monthly,set:setMonthly,min:25,max:1000,step:25,fmt:v=>`$${v}`,color:C.accent},{label:"Yearly boost (2×)",val:extra,set:setExtra,min:0,max:5000,step:100,fmt:v=>`$${v}`,color:C.green}].map(s=>(
                  <div key={s.label} style={{marginBottom:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:C.inkMid}}>{s.label}</span><span style={{fontSize:16,fontWeight:800,color:s.color}}>{s.fmt(s.val)}</span></div>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e=>s.set(parseInt(e.target.value))} style={{width:"100%",accentColor:s.color,cursor:"pointer"}}/>
                  </div>
                ))}
              </div>
            )}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"24px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,color:C.inkMid,fontWeight:600}}>Time horizon</span><span style={{fontSize:18,fontWeight:900,color:C.ink}}>{years} years</span></div>
              <input type="range" min={10} max={35} value={years} onChange={e=>setYears(parseInt(e.target.value))} style={{width:"100%",accentColor:C.accent,cursor:"pointer"}}/>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"24px"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.inkLight,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Milestones</div>
              <div style={{display:"grid",gap:8}}>
                {milData.map(m=>(
                  <div key={m.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:m.yr?m.color+"0d":C.bg,borderRadius:10,border:`1px solid ${m.yr?m.color+"30":C.border}`}}>
                    <span style={{fontSize:14,fontWeight:800,color:m.yr?m.color:C.inkLight}}>{m.label}</span>
                    <span style={{fontSize:13,fontWeight:700,color:m.yr?C.ink:C.inkLight}}>{m.yr?`Year ${m.yr}`:`>${years}yr`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:"grid",gap:14}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"24px",boxShadow:"0 4px 24px rgba(0,87,255,0.08)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
                <div>
                  <div style={{fontSize:11,color:C.inkLight,textTransform:"uppercase",letterSpacing:1}}>Portfolio in {years} years</div>
                  <div style={{fontSize:36,fontWeight:900,color:C.ink,letterSpacing:-1.5,lineHeight:1.1,marginTop:6}}>${displayed.toLocaleString()}</div>
                  <div style={{fontSize:13,color:C.inkMid,marginTop:6}}>Starting from €300 · ${am}/mo avg</div>
                </div>
                <div style={{background:C.greenBg,borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
                  <div style={{fontSize:18,fontWeight:900,color:C.green}}>{milestoneYear(pts,1_000_000)?`Yr ${milestoneYear(pts,1_000_000)}`:`>${years}yr`}</div>
                  <div style={{fontSize:10,color:C.green,marginTop:2}}>to $1M</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={pts}>
                  <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={0.12}/><stop offset="95%" stopColor={C.accent} stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="year" tick={{fill:C.inkLight,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`Y${v}`}/>
                  <YAxis tick={{fill:C.inkLight,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1e6?`$${(v/1e6).toFixed(1)}M`:v>=1e3?`$${(v/1e3).toFixed(0)}K`:`$${v}`}/>
                  <Tooltip content={<Tip/>}/>
                  <Area type="monotone" dataKey="value" name="Portfolio" stroke={C.accent} strokeWidth={2.5} fill="url(#cg)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:C.accentBg,border:`1px solid ${C.accent}22`,borderRadius:14,padding:"14px 18px",fontSize:12,color:C.inkMid,lineHeight:1.7}}>
              <strong style={{color:C.accent}}>How we calculate this:</strong> Based on a diversified growth basket averaging ~15.5% annual return, with two yearly boost deposits. Past performance doesn't guarantee future results — planning tool, not financial advice.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="story" style={{background:C.bgDark,padding:"80px 24px"}}>
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <span style={{display:"inline-flex",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:"#6ee7b7",background:"#6ee7b711",padding:"4px 12px",borderRadius:20}}>✦ The Story</span>
        <h2 style={{fontSize:36,fontWeight:900,color:"#fff",margin:"20px 0 36px",letterSpacing:-1.5,lineHeight:1.1}}>Built by a 25-year-old<br/>student with €300.</h2>
        <div style={{display:"grid",gap:16}}>
          {[{i:"🎓",t:"It started with school",d:"Studying, working part-time, and dreaming bigger. No trust fund. No inheritance. Just a €300 deposit and a spreadsheet that got out of hand."},
            {i:"📊",t:"The dashboard became a tool",d:"What started as tracking my own investments turned into a full risk engine. Friends asked for it. Strangers asked for it. So we built it properly."},
            {i:"🏦",t:"The bigger vision: Nexus Bank",d:"This tool is phase one. The real goal is to build a fintech bank — one built for people who are starting from nothing and thinking in decades, not quarters."},
            {i:"🤝",t:"You're early",d:"If you're here now, you're part of the founding story. The waitlist is open. The app is coming. And the journey to $1M — for both of us — has already started."}].map(s=>(
            <div key={s.t} style={{display:"flex",gap:18,padding:"22px 24px",background:"#ffffff0a",border:"1px solid #ffffff12",borderRadius:14}}>
              <span style={{fontSize:26,flexShrink:0,marginTop:2}}>{s.i}</span>
              <div><div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:8}}>{s.t}</div><p style={{margin:0,fontSize:13,color:"#9ca3af",lineHeight:1.75}}>{s.d}</p></div>
            </div>
          ))}
        </div>

        {/* MILESTONE CELEBRATIONS */}
        <div style={{marginTop:32,background:"linear-gradient(135deg,#ffd60a18,#f7258518)",border:"1px solid #ffd60a33",borderRadius:18,padding:"28px 28px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <span style={{fontSize:22}}>🎉</span>
            <span style={{fontSize:15,fontWeight:800,color:"#ffd60a"}}>Every milestone gets celebrated</span>
          </div>
          <p style={{margin:"0 0 20px",fontSize:13,color:"#9ca3af",lineHeight:1.75}}>
            This isn't just a tool — it's a community. When you hit <strong style={{color:"#fff"}}>$10K</strong>, we celebrate. When you hit <strong style={{color:"#fff"}}>$50K</strong>, we celebrate louder. And when someone in the Nexus community hits <strong style={{color:"#ffd60a"}}>$1M</strong> — we make some noise. Every step forward is proof that steady steps and simple choices work.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {[{m:"$10K",e:"🌱",c:"#4361ee",l:"First win"},{m:"$50K",e:"🔥",c:"#00c48c",l:"Half way"},{m:"$250K",e:"⚡",c:"#f59e0b",l:"Almost there"},{m:"$1M",e:"👑",c:"#e11d48",l:"Legend"}].map(ms=>(
              <div key={ms.m} style={{background:"#ffffff08",border:`1px solid ${ms.c}33`,borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:6}}>{ms.e}</div>
                <div style={{fontSize:14,fontWeight:900,color:ms.c}}>{ms.m}</div>
                <div style={{fontSize:10,color:"#ffffff50",marginTop:3}}>{ms.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* INVESTOR NETWORK */}
        <div style={{marginTop:20,background:"#ffffff06",border:"1px solid #ffffff12",borderRadius:18,padding:"28px"}}>
          
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontSize:20}}>🌐</span>
            <span style={{fontSize:15,fontWeight:800,color:"#fff"}}>The Nexus Network</span>
            <span style={{fontSize:10,fontWeight:700,color:"#00c48c",background:"#00c48c18",padding:"3px 8px",borderRadius:20,letterSpacing:1}}>COMING SOON</span>
          </div>
          <p style={{margin:"0 0 20px",fontSize:13,color:"#9ca3af",lineHeight:1.7,maxWidth:520}}>
            A private community of investors on the same journey. Share wins, stay accountable, grow together — publicly or anonymously. Always your choice.
          </p>

          {/* 3 pillars */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
            {[
              {i:"🤝",t:"Accountability",d:"Monthly check-ins with investors at your level"},
              {i:"📣",t:"Announcements",d:"Celebrate milestones publicly or anonymously"},
              {i:"🔒",t:"Privacy first",d:"Only share what you choose. Always."},
            ].map(f=>(
              <div key={f.t} style={{background:"#ffffff08",borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:6}}>{f.i}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:4}}>{f.t}</div>
                <div style={{fontSize:11,color:"#ffffff40",lineHeight:1.5}}>{f.d}</div>
              </div>
            ))}
          </div>

          {/* Events ladder */}
          <div style={{background:"linear-gradient(135deg,#0057ff12,#7c3aed12)",border:"1px solid #0057ff25",borderRadius:14,padding:"20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <span style={{fontSize:16}}>🎟️</span>
              <span style={{fontSize:13,fontWeight:800,color:"#fff"}}>Your milestone unlocks your room</span>
            </div>
            <div style={{display:"grid",gap:8}}>
              {[
                {m:"$10K+",  e:"🌐 Monthly Community Calls", color:"#4361ee"},
                {m:"$50K+",  e:"📍 European City Meetups",   color:"#00c48c"},
                {m:"$250K+", e:"🏛️ Nexus Annual Summit",     color:"#f59e0b"},
                {m:"$1M+",   e:"👑 The Founder's Circle",    color:"#e11d48"},
              ].map(ev=>(
                <div key={ev.m} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"#ffffff06",borderRadius:10,border:`1px solid ${ev.color}20`}}>
                  <span style={{fontSize:12,fontWeight:900,color:ev.color,minWidth:52}}>{ev.m}</span>
                  <span style={{width:1,height:20,background:"#ffffff10",display:"block",flexShrink:0}}/>
                  <span style={{fontSize:13,color:"#fff",fontWeight:600}}>{ev.e}</span>
                </div>
              ))}
            </div>
            <p style={{margin:"14px 0 0",fontSize:11,color:"#ffffff25",textAlign:"center",fontStyle:"italic"}}>
              The room you're in determines how far you go.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  const [email,setEmail]=useState("");
  const [submitted,setSubmitted]=useState(false);
  return (
    <section style={{background:`radial-gradient(ellipse 70% 80% at 50% 50%,#dce8ff 0%,${C.bg} 70%)`,padding:"80px 24px"}}>
      <div style={{maxWidth:520,margin:"0 auto",textAlign:"center"}}>
        <span style={{display:"inline-flex",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:C.accent,background:C.accentBg,padding:"4px 12px",borderRadius:20}}>🔔 Early Access</span>
        <h2 style={{fontSize:36,fontWeight:900,color:C.ink,margin:"20px 0 14px",letterSpacing:-1.5}}>Join the waitlist</h2>
        <p style={{fontSize:15,color:C.inkMid,lineHeight:1.7,marginBottom:36}}>The Nexus app is coming. Get early access, founding member pricing, and updates on the $1M journey.</p>
        {!submitted?(
          <div style={{display:"flex",gap:10,maxWidth:400,margin:"0 auto"}}>
            <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} style={{flex:1,padding:"14px 18px",borderRadius:12,fontSize:14,border:`1.5px solid ${C.border}`,background:"#fff",color:C.ink,fontFamily:"inherit",outline:"none"}}/>
            <Btn primary onClick={()=>email.includes("@")&&setSubmitted(true)}>Join →</Btn>
          </div>
        ):(
          <div style={{background:C.greenBg,border:`1px solid ${C.green}30`,borderRadius:16,padding:"20px 28px"}}>
            <div style={{fontSize:24,marginBottom:8}}>🎉</div>
            <div style={{fontSize:16,fontWeight:800,color:C.green,marginBottom:4}}>You're on the list!</div>
            <div style={{fontSize:13,color:C.inkMid}}>We'll reach out when Nexus launches.</div>
          </div>
        )}
        <div style={{display:"flex",gap:32,justifyContent:"center",marginTop:44}}>
          {[["🔒","No spam"],["📱","App 2025"],["🏦","Nexus Bank 2027"]].map(([ic,lb])=>(
            <div key={lb} style={{fontSize:12,color:C.inkLight,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><span style={{fontSize:20}}>{ic}</span>{lb}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [tick,setTick]=useState(0);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{ const t=setInterval(()=>setTick(x=>x+1),3000); return()=>clearInterval(t); },[]);
  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>20); window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn); },[]);
  const phrases=["invest smarter.","build wealth.","reach $1M.","start with €300."];
  const heroPts=project(150,1000,30);
  const scrollTo=(id)=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return (
    <div style={{fontFamily:"'Outfit','Trebuchet MS',sans-serif",background:C.bg}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{box-sizing:border-box} html{scroll-behavior:smooth}`}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:scrolled?"rgba(248,249,252,0.95)":"transparent",backdropFilter:scrolled?"blur(12px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all 0.3s",padding:"0 24px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:8,background:C.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:14,fontWeight:900}}>N</span></div>
            <span style={{fontSize:17,fontWeight:800,color:C.ink,letterSpacing:-0.5}}>nexus</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[["calculator","Calculator"],["story","Our Story"],["waitlist","Join Waitlist"]].map(([id,label])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{background:id==="waitlist"?C.accent:"transparent",color:id==="waitlist"?"#fff":C.inkMid,border:"none",padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:id==="waitlist"?700:500,cursor:"pointer",fontFamily:"inherit"}}>{label}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{minHeight:"100vh",display:"flex",alignItems:"center",background:`radial-gradient(ellipse 80% 60% at 50% -10%,#dce8ff 0%,${C.bg} 70%)`,padding:"100px 24px 60px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",width:"100%"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"center"}}>
            <div>
              <span style={{display:"inline-flex",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:C.accent,background:C.accentBg,padding:"4px 12px",borderRadius:20}}>🚀 Now in Beta</span>
              <h1 style={{fontSize:"clamp(36px,5vw,60px)",fontWeight:900,lineHeight:1.08,color:C.ink,margin:"20px 0 0",letterSpacing:-2}}>
                Your path to<br/>
                <span style={{color:C.accent}}>{phrases[tick%phrases.length]}</span>
              </h1>
              <p style={{fontSize:16,color:C.inkMid,lineHeight:1.7,margin:"20px 0 30px",maxWidth:400}}>Nexus helps you build a personalised investment plan from any starting point. See exactly when you hit every milestone.</p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <Btn primary onClick={()=>scrollTo("calculator")}>Build my plan →</Btn>
                <Btn onClick={()=>scrollTo("story")}>Our story</Btn>
              </div>
              <div style={{display:"flex",gap:28,marginTop:36}}>
                {[["€300","Starting capital"],["15.5%","Avg annual return"],["30yr","To $1M"]].map(([v,l])=>(
                  <div key={l}><div style={{fontSize:22,fontWeight:900,color:C.ink,letterSpacing:-0.5}}>{v}</div><div style={{fontSize:12,color:C.inkLight,marginTop:2}}>{l}</div></div>
                ))}
              </div>
            </div>
            <div style={{position:"relative"}}>
              <div style={{background:"#fff",borderRadius:24,padding:22,boxShadow:"0 24px 80px rgba(0,87,255,0.12),0 4px 20px rgba(0,0,0,0.06)",border:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div><div style={{fontSize:11,color:C.inkLight,textTransform:"uppercase",letterSpacing:1}}>Portfolio Value</div><div style={{fontSize:30,fontWeight:900,color:C.ink,letterSpacing:-1}}>$1,000,000</div></div>
                  <div style={{background:C.greenBg,borderRadius:10,padding:"6px 12px"}}><span style={{color:C.green,fontSize:13,fontWeight:700}}>+15.5% avg</span></div>
                </div>
                <ResponsiveContainer width="100%" height={110}>
                  <AreaChart data={heroPts}>
                    <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={0.15}/><stop offset="95%" stopColor={C.accent} stopOpacity={0}/></linearGradient></defs>
                    <Area type="monotone" dataKey="value" stroke={C.accent} strokeWidth={2.5} fill="url(#hg)" dot={false}/>
                    <XAxis hide/><YAxis hide/>
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:14}}>
                  {[["$10K","Yr 3",C.accent],["$100K","Yr 12",C.green],["$1M","Yr 28","#e11d48"]].map(([v,y,c])=>(
                    <div key={v} style={{background:C.bg,borderRadius:10,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:C.inkLight,marginTop:2}}>{y}</div></div>
                  ))}
                </div>
              </div>
              <div style={{position:"absolute",bottom:-14,left:-14,background:C.bgDark,borderRadius:14,padding:"12px 16px",boxShadow:"0 8px 32px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:10,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>💰</div>
                <div><div style={{fontSize:12,fontWeight:700,color:"#fff"}}>+$340 this month</div><div style={{fontSize:10,color:"#666"}}>Compound working</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Calculator/>
      <Story/>
      <Waitlist/>

      <footer style={{background:C.bgDark,padding:"28px 24px",borderTop:"1px solid #1a1a2a"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:24,height:24,borderRadius:6,background:C.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:12,fontWeight:900}}>N</span></div><span style={{fontSize:15,fontWeight:800,color:"#fff"}}>nexus</span></div>
          <div style={{fontSize:12,color:"#4b5563"}}>Not financial advice · © 2025 Nexus</div>
          <div style={{display:"flex",gap:16}}>{["Privacy","Terms","Contact"].map(l=><span key={l} style={{fontSize:12,color:"#4b5563",cursor:"pointer"}}>{l}</span>)}</div>
        </div>
      </footer>
    </div>
  );
}
