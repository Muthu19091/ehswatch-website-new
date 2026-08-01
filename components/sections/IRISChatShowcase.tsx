"use client";

import { useEffect, useRef, useState } from "react";
import { basePath } from "@/lib/basePath";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@keyframes ics-msg-in {
  from { opacity:0; transform:translateY(10px) scale(0.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes ics-dot-bounce {
  0%,80%,100% { transform:translateY(0);   opacity:0.3; }
  40%          { transform:translateY(-5px); opacity:1;  }
}
@keyframes ics-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes ics-wave {
  0%,100% { transform:scaleY(0.25); }
  50%     { transform:scaleY(1);    }
}
@keyframes ics-mic-glow {
  0%,100% { box-shadow:0 0 0 0 rgba(21,94,239,0.35); }
  50%     { box-shadow:0 0 0 8px rgba(21,94,239,0);  }
}
.ics-nosb::-webkit-scrollbar{display:none}
.ics-nosb{scrollbar-width:none}
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcClip = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M21.44 11.05L12.25 20.24a5 5 0 0 1-7.07-7.07l8.48-8.48a3 3 0 0 1 4.24 4.24L9.41 17.42a1 1 0 0 1-1.41-1.41l7.07-7.07" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcMicSm = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.7"/>
    <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
    <path d="M12 18v3M9 21h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);
const IcSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Feature layout data ──────────────────────────────────────────────────────
// Only the callout position (side) and the sequence number are design-owned.
// The title + description are CMS-only (from the number_steps block) — no
// hardcoded copy.
const FEATURES = [
  { side:"left"  as const, num:"01" },
  { side:"right" as const, num:"02" },
  { side:"left"  as const, num:"03" },
  { side:"right" as const, num:"04" },
  { side:"left"  as const, num:"05" },
  { side:"right" as const, num:"06" },
] as const;

// ─── Chat messages — one step at a time ───────────────────────────────────────
type Msg = {
  step:    number;
  role:    "user" | "iris";
  text?:   string;
  bullets?: string[];
  img?:    "oil" | "warehouse";
};

const MSGS: Msg[] = [
  // Step 0 — Text/Voice-to-Report
  { step:0, role:"user",
    text:"Oil spill in hallway, main building sector A, Hyderabad. No immediate actions taken." },
  { step:0, role:"iris", text:"Environmental incident pre-filled ✅",
    bullets:["📍 Main Building, Sector A, Hyderabad","⚠️ Type: Environmental — Oil Spill","🔴 Severity: Medium  ·  Actions: None taken"] },
  // Step 1 — Action Recommendation Engine
  { step:1, role:"user", text:"What should we do next?" },
  { step:1, role:"iris", text:"Prioritised corrective actions — 47 similar incidents analysed:",
    bullets:["🔴 Deploy absorbent mats & cordon off area now","🟡 Identify oil source; inspect adjacent machinery","🟢 Schedule deep clean & update MSDS register"] },

  // Step 2 — Root Cause Analysis
  { step:2, role:"user", text:"Can you identify the root cause?" },
  { step:2, role:"iris", text:"5-Why Root Cause Analysis:",
    bullets:["Hydraulic line leak → Machine B-04","Maintenance overdue by 18 days","Root cause: PM system integration gap"] },

  // Step 3 — Event Similarity Detector
  { step:3, role:"user", text:"Have we seen anything like this before?" },
  { step:3, role:"iris", text:"🔍 3 similar clusters across 1,240 records:",
    bullets:["Sector A — oil spill (2× in last 6 months)","Machine B-series failures — 4 events Q3–Q4","Overdue PM trend → emerging leading indicator ⚠️"] },

  // Step 4 — AI Insights Generator
  { step:4, role:"user", text:"Summarise this for my board report." },
  { step:4, role:"iris", text:"Executive EHS summary — board-ready:",
    bullets:["3 spills linked to maintenance scheduling gap","Corrective actions 87% closed","17.5 hrs saved on reporting this month"] },

  // Step 5 — Image Recognition
  { step:5, role:"user", img:"warehouse", text:"Sending field photo…" },
  { step:5, role:"iris", text:"🤖 Image Analysis Complete:",
    bullets:["⚠️ PPE violation — missing hard hat & hi-vis vest","📍 Location: Warehouse Bay 3","Supervisor Rajan M. alerted in real-time. Confirm to submit?"] },
];

// Voice-to-text typed string for step 0 only
const VOICE_TEXT = "Oil spill in hallway, sector A…";

// ─── Wave heights ─────────────────────────────────────────────────────────────
const WAVE_H = [3,7,13,8,18,11,15,7,17,10,20,6,14,9,16,5,11,8,15,4,10,7];

// ─── Image thumbnails ─────────────────────────────────────────────────────────
function OilThumb() {
  return (
    <div className="rounded-xl overflow-hidden flex-shrink-0"
      style={{ width:140, height:88, position:"relative" }}>
      <img
        src={basePath + "/images/iris-media/oil-spill.jpg"}
        alt="Oil spill"
        style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:12 }}
      />
      <div style={{
        position:"absolute", inset:0, borderRadius:12,
        background:"linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.35) 100%)"
      }} />
      <span style={{
        position:"absolute", bottom:6, left:8,
        fontSize:8.5, fontWeight:700, color:"rgba(255,255,255,0.8)",
        fontFamily:"var(--font-dm-sans,sans-serif)", letterSpacing:"0.06em"
      }}>
        SECTOR A · OIL SPILL
      </span>
    </div>
  );
}

function WarehouseThumb() {
  return (
    <div className="rounded-xl overflow-hidden flex-shrink-0"
      style={{ width:140, height:88, position:"relative" }}>
      <img
        src={basePath + "/images/iris-media/ppe-violation-warehouse.png"}
        alt="PPE violation"
        style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:12 }}
      />
      <div style={{
        position:"absolute", inset:0, borderRadius:12,
        background:"linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.40) 100%)"
      }} />
      <span style={{
        position:"absolute", bottom:6, left:8,
        fontSize:8.5, fontWeight:700, color:"rgba(255,255,255,0.9)",
        fontFamily:"var(--font-dm-sans,sans-serif)", letterSpacing:"0.06em"
      }}>
        WAREHOUSE · PPE VIOLATION
      </span>
    </div>
  );
}

// ─── IRIS logo ────────────────────────────────────────────────────────────────
function IrisLogo({ size = 36 }: { size?: number }) {
  return (
    <img
      src={basePath + "/images/iris-logo.png"}
      alt="IRIS"
      className="flex-shrink-0"
      style={{ width: size, height: size * 0.38, objectFit:"contain" }}
    />
  );
}

function IrisBubbleAvatar() {
  return (
    <img
      src={basePath + "/images/iris-logo.png"}
      alt="IRIS"
      className="flex-shrink-0"
      style={{ width:44, height:17, objectFit:"contain" }}
    />
  );
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────
function Bubble({ msg, delayMs, animate }: { msg: Msg; delayMs: number; animate: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
      style={{ animation: animate ? `ics-msg-in 0.38s cubic-bezier(0.22,1,0.36,1) ${delayMs}ms both` : "none" }}
    >
      {!isUser && <IrisBubbleAvatar />}
      <div className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}
        style={{ maxWidth:"82%" }}>
        {msg.img && (msg.img === "oil" ? <OilThumb /> : <WarehouseThumb />)}
        {(msg.text || msg.bullets) && (
          <div className="rounded-2xl px-3.5 py-2.5"
            style={{
              borderTopRightRadius: isUser ? 4 : undefined,
              borderTopLeftRadius:  isUser ? undefined : 4,
              background: isUser ? "#155eef" : "#EEF2FF",
              color:      isUser ? "#fff"    : "#1A1A2E",
              fontSize:13, lineHeight:1.6,
            }}>
            {msg.text && (
              <p style={{ fontFamily:"var(--font-dm-sans,sans-serif)", textWrap:"pretty" } as React.CSSProperties}>
                {msg.text}
              </p>
            )}
            {msg.bullets && (
              <ul className="mt-1.5 flex flex-col gap-[3px]">
                {msg.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5"
                    style={{ fontSize:12, fontFamily:"var(--font-dm-sans,sans-serif)" }}>
                    <span className="mt-[2px] shrink-0"
                      style={{ color: isUser ? "rgba(255,255,255,0.5)" : "#155eef" }}>›</span>
                    <span style={{ opacity: isUser ? 0.88 : 1 }}>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center"
          style={{ background:"#1e293b", color:"white", fontSize:9, fontWeight:700,
            fontFamily:"var(--font-gothic-a1,sans-serif)" }}>
          U
        </div>
      )}
    </div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-end gap-2">
      <IrisBubbleAvatar />
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl"
        style={{ borderTopLeftRadius:4, background:"#EEF2FF" }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background:"#155eef", opacity:0.4,
              animation:`ics-dot-bounce 1.2s ease-in-out ${d}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Smart input — voice animation for step 0 only, blank for other steps ─────
function SmartInput({ step, voicePhase }: { step: number; voicePhase: 0|1|2 }) {
  const [typed, setTyped] = useState("");

  // Type out voice text only for step 0, phase 1
  useEffect(() => {
    if (step !== 0) { setTyped(""); return; }
    if (voicePhase !== 1) return;
    let i = 0;
    setTyped("");
    const t = setInterval(() => {
      i++;
      setTyped(VOICE_TEXT.slice(0, i));
      if (i >= VOICE_TEXT.length) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [step, voicePhase]);

  const isListening    = step === 0 && voicePhase === 0;
  const isCursorActive = step === 0 && voicePhase === 1 && typed.length < VOICE_TEXT.length;

  return (
    <div className="shrink-0 px-3 pt-2 pb-3">
      <div
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all duration-300"
        style={{
          background:"#F4F7FF",
          border: isListening ? "1.5px solid rgba(21,94,239,0.4)" : "1.5px solid #DBEAFE",
          boxShadow: isListening ? "0 0 0 3px rgba(21,94,239,0.08)" : "none",
        }}
      >
        <span style={{ color:"#94A3B8", flexShrink:0 }}><IcClip /></span>

        <div className="flex-1 flex items-center gap-1.5 min-w-0 overflow-hidden">
          {isListening ? (
            /* Voice waveform bars */
            <div className="flex items-center gap-[2.5px] w-full" style={{ height:22 }}>
              {WAVE_H.map((h, i) => (
                <div key={i} style={{
                  width: 2.5, height: h,
                  background:"linear-gradient(180deg,#93C5FD,#155eef)",
                  borderRadius:2, flexShrink:0, transformOrigin:"center",
                  animation:`ics-wave ${0.65+(i%4)*0.15}s ease-in-out ${(i%6)*0.08}s infinite`,
                }} />
              ))}
              <span className="ml-auto text-[11px] font-medium flex-shrink-0"
                style={{ color:"#155eef", fontFamily:"var(--font-dm-sans,sans-serif)" }}>
                Listening…
              </span>
            </div>
          ) : (
            /* Typed text (step 0 phases 1–2) or blank (all other steps) */
            <div className="flex items-center gap-0.5 min-w-0 flex-1">
              {typed && (
                <span className="text-[12.5px] truncate"
                  style={{ color:"#1A1A2E", fontFamily:"var(--font-dm-sans,sans-serif)" }}>
                  {typed}
                </span>
              )}
              {isCursorActive && (
                <span style={{
                  display:"inline-block", width:1.5, height:13,
                  background:"#155eef", borderRadius:1, flexShrink:0,
                  animation:"ics-cursor 0.7s step-end infinite",
                }} />
              )}
            </div>
          )}
        </div>

        {/* Mic — pulses when listening */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isListening ? "#155eef" : "transparent",
            color:       isListening ? "white"   : "#94A3B8",
            animation:   isListening ? "ics-mic-glow 1.4s ease-in-out infinite" : "none",
          }}>
          <IcMicSm />
        </div>

        {/* Send */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background:"linear-gradient(135deg,#155eef,#1d4ed8)" }}>
          <IcSend />
        </div>
      </div>

      <p className="text-center mt-1.5" style={{
        fontSize:9.5, color:"#CBD5E1",
        fontFamily:"var(--font-dm-sans,sans-serif)",
      }}>
        *IRIS is AI and can make mistakes. Please double-check responses.
      </p>
    </div>
  );
}

// ─── Chat mockup ──────────────────────────────────────────────────────────────
function ChatMockup({
  step, showIris, voicePhase, singleStep = false, height = 560,
}: {
  step: number;
  showIris: boolean;
  voicePhase: 0|1|2;
  height?: number;
  // singleStep: show ONLY this step's exchange (no cumulative history). Used on
  // mobile/tablet where each feature has its own phone — cumulative + a
  // scroll-to-bottom is unreliable on iOS Safari, leaving every phone stuck at
  // the shared opener so all features look identical. One step per phone keeps
  // each feature's demo distinct and fully visible without any scrolling.
  singleStep?: boolean;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  // Cumulative: all past steps fully visible, current step animates in
  const messagesReady = step > 0 || voicePhase === 2;

  // Past steps — always fully shown (user + iris). Omitted in single-step mode.
  const pastMsgs = singleStep ? [] : MSGS.filter(m => m.step < step);
  // Current step — user always shown once ready; iris shown after delay
  const currentMsgs = messagesReady
    ? MSGS.filter(m => m.step === step && (m.role === "user" || showIris))
    : [];

  const visible = [...pastMsgs, ...currentMsgs];

  const hasIrisReply = MSGS.some(m => m.step === step && m.role === "iris");
  const showTyping = messagesReady && hasIrisReply && !showIris;

  useEffect(() => {
    const el = bodyRef.current;
    if (el) setTimeout(() => el.scrollTo({ top:el.scrollHeight, behavior:"smooth" }), 80);
  }, [visible.length, showTyping]);

  return (
    <div style={{
      width:300, flexShrink:0,
      background:"white", borderRadius:32, overflow:"hidden",
      border:"1px solid #E2E8F0",
      boxShadow:`0 0 0 8px rgba(226,232,240,0.45), 0 24px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)`,
      height, display:"flex", flexDirection:"column",
    }}>

      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-3.5 pb-1 flex-shrink-0">
        <span style={{ fontSize:11.5, fontWeight:600, color:"#1e293b",
          fontFamily:"var(--font-dm-sans,sans-serif)" }}>9:41</span>
        <div className="flex items-center gap-2">
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            {[0,3.5,7,10.5].map((x,i) => (
              <rect key={i} x={x} y={11-(i+1)*2.5} width="2.5" height={(i+1)*2.5} rx="0.6"
                fill={i < 3 ? "#1e293b" : "#CBD5E1"} />
            ))}
          </svg>
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
            <rect x="0.5" y="0.5" width="15" height="9" rx="2" stroke="#1e293b" strokeWidth="0.9"/>
            <rect x="16" y="3" width="2.5" height="4" rx="1" fill="#1e293b"/>
            <rect x="1.5" y="1.5" width="11" height="7" rx="1.5" fill="#155eef"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pb-3 pt-1 flex-shrink-0"
        style={{ borderBottom:"1px solid #F1F5F9" }}>
        <button style={{ background:"none", border:"none", padding:0, cursor:"pointer",
          color:"#64748B", lineHeight:0, flexShrink:0 }}>
          <IcBack />
        </button>
        <IrisLogo size={36} />
        <div className="flex-1 min-w-0">
          <p style={{ fontSize:14, fontWeight:700, color:"#1e293b", lineHeight:1,
            marginBottom:3, fontFamily:"var(--font-gothic-a1,sans-serif)" }}>
            IRIS
          </p>
          <div className="flex items-center gap-1.5">
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", flexShrink:0 }} />
            <span style={{ fontSize:11, color:"#64748B", fontFamily:"var(--font-dm-sans,sans-serif)" }}>
              EHS AI Assistant · Online
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          {[0,1,2].map(i => (
            <div key={i} style={{ width:3, height:3, borderRadius:"50%", background:"#CBD5E1" }} />
          ))}
        </div>
      </div>

      {/* Messages — keyed by step so they remount and re-animate on each step */}
      <div ref={bodyRef}
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 ics-nosb">
        {visible.map((msg, i) => {
            const isNew = msg.step === step;
            const newIndex = currentMsgs.indexOf(msg);
            return (
              <Bubble
                key={`${msg.step}-${msg.role}-${i}`}
                msg={msg}
                animate={isNew}
                delayMs={isNew ? newIndex * 140 : 0}
              />
            );
          })}
        {showTyping && <TypingDots />}
      </div>

      <SmartInput step={step} voicePhase={voicePhase} />
    </div>
  );
}

// ─── Feature callout ──────────────────────────────────────────────────────────
interface FeatureItem {
  side: "left" | "right";
  num: string;
  title: string;
  desc: string;
  subItems: { title: string; description: string }[];
}

function FeatureCallout({ feat, active }: { feat: FeatureItem; active: boolean }) {
  return (
    <div style={{
      display:"flex", gap:14, maxWidth:300,
      opacity: active ? 1 : 0,
      transform: active ? "translateX(0)" : `translateX(${feat.side === "left" ? -36 : 36}px)`,
      transition:"opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      pointerEvents: active ? "auto" : "none",
    }}>
      <div style={{
        width:3, alignSelf:"stretch", minHeight:52,
        borderRadius:4, flexShrink:0, marginTop:4,
        background:"linear-gradient(180deg,#ff8e37,#ff6d00)",
      }} />
      <div>
        <p style={{ fontSize:10.5, fontWeight:600, textTransform:"uppercase",
          letterSpacing:"0.16em", color:"#ff6d00", marginBottom:6,
          fontFamily:"var(--font-dm-sans,sans-serif)" }}>
          FEATURE {feat.num}
        </p>
        <h3 style={{ fontSize:18, fontWeight:700, color:"#1e293b", lineHeight:1.25,
          marginBottom:8, fontFamily:"var(--font-gothic-a1,sans-serif)" }}>
          {feat.title}
        </h3>
        {feat.desc && (
          <p style={{ fontSize:13.5, lineHeight:1.7, color:"#334155",
            fontFamily:"var(--font-dm-sans,sans-serif)", textWrap:"pretty" } as React.CSSProperties}>
            {feat.desc}
          </p>
        )}
        {feat.subItems.map((si, k) => (
          <div key={k} style={{ marginTop: 10 }}>
            <p style={{ fontSize:11, fontWeight:800, textTransform:"uppercase",
              letterSpacing:"0.1em", color:"#1e293b", marginBottom:3,
              fontFamily:"var(--font-dm-sans,sans-serif)" }}>
              {si.title}
            </p>
            <p style={{ fontSize:12.5, lineHeight:1.6, color:"#334155",
              fontFamily:"var(--font-dm-sans,sans-serif)", textWrap:"pretty" } as React.CSSProperties}>
              {si.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
interface IRISChatShowcaseProps {
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsSteps?: Array<{
    title?: string;
    description?: string;
    sub_items?: Array<{ title?: string; description?: string; icon?: string }>;
  }>;
}

// Split heading at the first comma so the tail renders in blue; falls back to
// highlighting the last three words when there is no comma.
function splitShowcaseHeading(text: string): [string, string] {
  const t = text.trim();
  const commaIdx = t.indexOf(",");
  if (commaIdx > 0 && commaIdx < t.length - 1) {
    return [t.slice(0, commaIdx + 1) + " ", t.slice(commaIdx + 1).trim()];
  }
  const parts = t.split(/\s+/);
  if (parts.length <= 3) return ["", t];
  return [parts.slice(0, -3).join(" ") + " ", parts.slice(-3).join(" ")];
}

export default function IRISChatShowcase({ cmsHeading, cmsSubheading, cmsSteps }: IRISChatShowcaseProps = {}) {
  const outerRef     = useRef<HTMLDivElement>(null);
  const mobileRef    = useRef<HTMLDivElement>(null);
  const [step,       setStep]       = useState(0);
  const [showIris,   setShowIris]   = useState(false);
  const [voicePhase, setVoicePhase] = useState<0|1|2>(0);

  // Titles/descriptions are CMS-only (number_steps); the chat scenes and
  // callout positions stay design-owned. No hardcoded fallback copy.
  const features: FeatureItem[] = FEATURES.map((f, i) => ({
    side: f.side,
    num: f.num,
    title: cmsSteps?.[i]?.title?.trim() || "",
    desc: cmsSteps?.[i]?.description?.trim() || "",
    subItems: (cmsSteps?.[i]?.sub_items ?? [])
      .filter((s) => (s?.title?.trim() || s?.description?.trim()))
      .map((s) => ({ title: s.title?.trim() || "", description: s.description?.trim() || "" })),
  }));

  // CMS-only heading/subheading — no hardcoded fallback copy.
  const [headingStart, headingTail] = splitShowcaseHeading(cmsHeading?.trim() || "");
  const subheading = cmsSubheading?.trim() || "";

  // Refs to avoid stale closures and prevent re-triggering on every scroll tick
  const prevStepRef        = useRef<number>(-1);   // currently displayed step
  const targetStepRef      = useRef<number>(0);    // scroll-position target
  const isSteppingRef      = useRef<boolean>(false); // animation queue running
  const voiceTimerT1       = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const voiceTimerT2       = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const irisTimerRef       = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const startVoice = () => {
    clearTimeout(voiceTimerT1.current);
    clearTimeout(voiceTimerT2.current);
    setVoicePhase(0);
    setShowIris(false);
    voiceTimerT1.current = setTimeout(() => setVoicePhase(1), 500);
    const textDuration = VOICE_TEXT.length * 18 + 400;
    voiceTimerT2.current = setTimeout(() => {
      setVoicePhase(2);
      // Show IRIS reply 300ms after typing finishes
      clearTimeout(irisTimerRef.current);
      irisTimerRef.current = setTimeout(() => setShowIris(true), 300);
    }, 500 + textDuration);
  };

  // Inject CSS once
  useEffect(() => {
    if (document.getElementById("ics-css")) return;
    const tag = document.createElement("style");
    tag.id = "ics-css"; tag.textContent = CSS;
    document.head.appendChild(tag);
    return () => { document.getElementById("ics-css")?.remove(); };
  }, []);

  // Smooth scroll → step with animation queue so fast scroll plays each step in order
  useEffect(() => {
    const STEP_ANIM_MS = 370; // ms between steps when queued (matches ics-msg-in ~380ms)
    let stepTimer: ReturnType<typeof setTimeout> | undefined;

    const applyStep = (next: number) => {
      prevStepRef.current = next;
      setStep(next);
      if (next === 0) {
        startVoice();
      } else {
        clearTimeout(voiceTimerT1.current);
        clearTimeout(voiceTimerT2.current);
        setShowIris(false);
        clearTimeout(irisTimerRef.current);
        irisTimerRef.current = setTimeout(() => setShowIris(true), 400);
      }
    };

    const tick = () => {
      const current = prevStepRef.current;
      const target  = targetStepRef.current;
      if (current === target) { isSteppingRef.current = false; return; }
      const next = current < target ? current + 1 : current - 1;
      applyStep(next);
      stepTimer = setTimeout(tick, STEP_ANIM_MS);
    };

    const scheduleToward = (target: number) => {
      targetStepRef.current = target;
      if (!isSteppingRef.current && prevStepRef.current !== target) {
        isSteppingRef.current = true;
        tick();
      }
    };

    const onScroll = () => {
      // Drive from whichever scroll-track is currently displayed: the desktop
      // 3-col track (lg+) or the mobile single-column track (below lg). The
      // hidden one has offsetHeight 0.
      const el = outerRef.current && outerRef.current.offsetHeight > 0
        ? outerRef.current
        : mobileRef.current && mobileRef.current.offsetHeight > 0
          ? mobileRef.current
          : null;
      if (!el) return;
      const scrolled = -el.getBoundingClientRect().top;
      const stepSize = window.innerHeight / 2; // 2 scroll-lengths per agent (user-requested; /4 felt too quick)
      const newStep = scrolled < 0 ? -1 : Math.min(Math.floor(scrolled / stepSize), 5);

      if (newStep < 0) {
        // Scrolled above section — cancel queue and reset
        clearTimeout(stepTimer);
        isSteppingRef.current = false;
        targetStepRef.current = 0;
        prevStepRef.current = -1;
        setStep(0);
        setVoicePhase(0);
        setShowIris(false);
        clearTimeout(voiceTimerT1.current);
        clearTimeout(voiceTimerT2.current);
        clearTimeout(irisTimerRef.current);
        return;
      }

      scheduleToward(newStep);
    };

    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(stepTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Heading — CMS-only, hidden when not configured */}
      {(headingTail || subheading) && (
      <section className="pt-[80px] md:pt-[100px] pb-0 px-6 bg-white">
        <div className="max-w-[1160px] mx-auto flex flex-col items-center text-center gap-3">
          {headingTail && (
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#1b1b1b]">
              {headingStart}
              <span style={{ color:"#155eef" }}>{headingTail}</span>
            </h2>
          )}
          {subheading && (
            <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] text-[#727272] max-w-[640px]">
              {subheading}
            </p>
          )}
        </div>
      </section>
      )}

      {/* ~400vh sticky scroll — ~2–3 scroll clicks per step so each agent lingers (desktop only) */}
      <div ref={outerRef} className="hidden lg:block" style={{ height:"400vh" }}>
        <div className="sticky top-0 bg-white overflow-hidden" style={{ height:"100vh" }}>

          {/* Desktop: 3-col */}
          <div className="hidden lg:grid h-full max-w-[1160px] mx-auto px-8 items-center"
            style={{ gridTemplateColumns:"1fr 316px 1fr", gap:60 }}>

            {/* Left callouts */}
            <div className="relative flex items-center justify-end" style={{ minHeight:240 }}>
              {features.map((f, i) =>
                f.side === "left" ? (
                  <div key={i} className="absolute right-0" style={{ zIndex:step===i?1:0 }}>
                    <FeatureCallout feat={f} active={step===i} />
                  </div>
                ) : null
              )}
            </div>

            {/* Center: chat */}
            <div className="flex items-center justify-center h-full py-8">
              <ChatMockup step={step} showIris={showIris} voicePhase={voicePhase} />
            </div>

            {/* Right callouts + progress dots */}
            <div className="relative flex items-center justify-start" style={{ minHeight:240 }}>
              {features.map((f, i) =>
                f.side === "right" ? (
                  <div key={i} className="absolute left-0" style={{ zIndex:step===i?1:0 }}>
                    <FeatureCallout feat={f} active={step===i} />
                  </div>
                ) : null
              )}
              {/* Progress dots — nudged into the grid's px-8 gutter. At right-0 they
                  sat on the callout's right edge (both at the column edge), which
                  the LTR text cleared but the right-aligned Arabic text ran into. */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5">
                {features.map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-500"
                    style={{ width:6, height:step===i?24:6,
                      background:step===i?"#ff6d00":"#E2E8F0" }} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile / tablet — same scroll-driven, single-phone experience as
          desktop: the section pins and one phone advances through all six
          agents as you scroll, instead of stacking six full-height phones. */}
      <div ref={mobileRef} className="lg:hidden bg-white" style={{ height:"400vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center gap-5 px-5">
          <div className="w-full max-w-[360px] min-h-[132px] flex items-center">
            <FeatureCallout feat={features[Math.max(0, Math.min(step, features.length - 1))]} active />
          </div>
          <ChatMockup
            step={Math.max(0, step)}
            showIris={showIris}
            voicePhase={voicePhase}
            singleStep
            height={390}
          />
          <div className="flex gap-2">
            {features.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-500"
                style={{ width: step === i ? 24 : 6, height: 6,
                  background: step === i ? "#ff6d00" : "#E2E8F0" }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
