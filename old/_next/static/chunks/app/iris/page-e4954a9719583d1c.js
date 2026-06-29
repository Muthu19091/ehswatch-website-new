(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[396],{4694:(e,t,i)=>{Promise.resolve().then(i.bind(i,3992)),Promise.resolve().then(i.bind(i,9687)),Promise.resolve().then(i.t.bind(i,8500,23))},6643:(e,t,i)=>{"use strict";i.d(t,{default:()=>n});var s=i(5155),r=i(2115);function n({children:e,className:t="",href:i,onClick:a,style:o,fillColor:l="#FFA660",hoverTextColor:d,type:c,disabled:f}){let h=(0,r.useRef)(null),[m,x]=(0,r.useState)({x:0,y:0,on:!1}),p=(e,t)=>{let i=h.current?.getBoundingClientRect();i&&x({x:e.clientX-i.left,y:e.clientY-i.top,on:t})},u=(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("span",{"aria-hidden":!0,style:{position:"absolute",left:m.x,top:m.y,width:520,height:520,marginLeft:-260,marginTop:-260,borderRadius:"9999px",background:l,transform:`scale(${+!!m.on})`,transition:"transform 0.5s cubic-bezier(0.22,1,0.36,1)",pointerEvents:"none",zIndex:0}}),(0,s.jsx)("span",{className:"relative z-[1] inline-flex items-center justify-center gap-2",style:{color:m.on&&d?d:void 0,transition:"color 0.25s ease"},children:e})]}),g={ref:h,onMouseEnter:e=>p(e,!0),onMouseLeave:e=>p(e,!1),className:`relative overflow-hidden inline-flex items-center justify-center ${t}`,style:o};return"submit"===c||"button"===c||f?(0,s.jsx)("button",{...g,type:c??"button",onClick:a,disabled:f,children:u}):(0,s.jsx)("a",{...g,href:i??"#",onClick:a,children:u})}},9687:(e,t,i)=>{"use strict";i.d(t,{default:()=>M});var s=i(5155),r=i(2115),n=i(5772),a=i(9426);let o=`
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
`,l=()=>(0,s.jsx)("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",children:(0,s.jsx)("path",{d:"M19 12H5M12 5l-7 7 7 7",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),d=()=>(0,s.jsx)("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",children:(0,s.jsx)("path",{d:"M21.44 11.05L12.25 20.24a5 5 0 0 1-7.07-7.07l8.48-8.48a3 3 0 0 1 4.24 4.24L9.41 17.42a1 1 0 0 1-1.41-1.41l7.07-7.07",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"})}),c=()=>(0,s.jsxs)("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",children:[(0,s.jsx)("rect",{x:"9",y:"2",width:"6",height:"11",rx:"3",stroke:"currentColor",strokeWidth:"1.7"}),(0,s.jsx)("path",{d:"M5 11a7 7 0 0 0 14 0",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"}),(0,s.jsx)("path",{d:"M12 18v3M9 21h6",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"})]}),f=()=>(0,s.jsx)("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",children:(0,s.jsx)("path",{d:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",stroke:"white",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),h=[{side:"left",num:"01",title:"Text / Voice-to-Report",desc:"Spoken or typed notes instantly become a structured, pre-filled incident report."},{side:"right",num:"02",title:"Action Recommendation Engine",desc:"AI surfaces prioritised corrective actions based on your facility's incident history."},{side:"left",num:"03",title:"AI Root Cause Analysis",desc:"Guides teams through 5-Why analysis and uncovers systemic root causes automatically."},{side:"right",num:"04",title:"Event Similarity Detector",desc:"Scans all recorded safety events to expose hidden patterns and leading indicators."},{side:"left",num:"05",title:"AI Insights Generator",desc:"Raw EHS data becomes board-ready executive narratives and summaries in seconds."},{side:"right",num:"06",title:"Image Recognition",desc:"Detects PPE failures and unsafe zones in field photos with real-time supervisor alerts."}],m=[{step:0,role:"user",text:"Oil spill in hallway, main building sector A, Hyderabad. No immediate actions taken."},{step:0,role:"iris",text:"Environmental incident pre-filled ✅",bullets:["\uD83D\uDCCD Main Building, Sector A, Hyderabad","⚠️ Type: Environmental — Oil Spill","\uD83D\uDD34 Severity: Medium  \xb7  Actions: None taken"]},{step:1,role:"user",text:"What should we do next?"},{step:1,role:"iris",text:"Prioritised corrective actions — 47 similar incidents analysed:",bullets:["\uD83D\uDD34 Deploy absorbent mats & cordon off area now","\uD83D\uDFE1 Identify oil source; inspect adjacent machinery","\uD83D\uDFE2 Schedule deep clean & update MSDS register"]},{step:2,role:"user",text:"Can you identify the root cause?"},{step:2,role:"iris",text:"5-Why Root Cause Analysis:",bullets:["Hydraulic line leak → Machine B-04","Maintenance overdue by 18 days","Root cause: PM system integration gap"]},{step:3,role:"user",text:"Have we seen anything like this before?"},{step:3,role:"iris",text:"\uD83D\uDD0D 3 similar clusters across 1,240 records:",bullets:["Sector A — oil spill (2\xd7 in last 6 months)","Machine B-series failures — 4 events Q3–Q4","Overdue PM trend → emerging leading indicator ⚠️"]},{step:4,role:"user",text:"Summarise this for my board report."},{step:4,role:"iris",text:"Executive EHS summary — board-ready:",bullets:["3 spills linked to maintenance scheduling gap","Corrective actions 87% closed","17.5 hrs saved on reporting this month"]},{step:5,role:"user",img:"warehouse",text:"Sending field photo…"},{step:5,role:"iris",text:"\uD83E\uDD16 Image Analysis Complete:",bullets:["⚠️ PPE violation — missing hard hat & hi-vis vest","\uD83D\uDCCD Location: Warehouse Bay 3","Supervisor Rajan M. alerted in real-time. Confirm to submit?"]}],x="Oil spill in hallway, sector A…",p=[3,7,13,8,18,11,15,7,17,10,20,6,14,9,16,5,11,8,15,4,10,7];function u(){return(0,s.jsxs)("div",{className:"rounded-xl overflow-hidden flex-shrink-0",style:{width:140,height:88,position:"relative"},children:[(0,s.jsx)("img",{src:a.J+"/images/iris-media/oil-spill.jpg",alt:"Oil spill",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:12}}),(0,s.jsx)("div",{style:{position:"absolute",inset:0,borderRadius:12,background:"linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.35) 100%)"}}),(0,s.jsx)("span",{style:{position:"absolute",bottom:6,left:8,fontSize:8.5,fontWeight:700,color:"rgba(255,255,255,0.8)",fontFamily:"var(--font-dm-sans,sans-serif)",letterSpacing:"0.06em"},children:"SECTOR A \xb7 OIL SPILL"})]})}function g(){return(0,s.jsxs)("div",{className:"rounded-xl overflow-hidden flex-shrink-0",style:{width:140,height:88,position:"relative"},children:[(0,s.jsx)("img",{src:a.J+"/images/iris-media/ppe-violation-warehouse.png",alt:"PPE violation",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:12}}),(0,s.jsx)("div",{style:{position:"absolute",inset:0,borderRadius:12,background:"linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.40) 100%)"}}),(0,s.jsx)("span",{style:{position:"absolute",bottom:6,left:8,fontSize:8.5,fontWeight:700,color:"rgba(255,255,255,0.9)",fontFamily:"var(--font-dm-sans,sans-serif)",letterSpacing:"0.06em"},children:"WAREHOUSE \xb7 PPE VIOLATION"})]})}function v({size:e=36}){return(0,s.jsx)("img",{src:a.J+"/images/iris-logo.png",alt:"IRIS",className:"flex-shrink-0",style:{width:e,height:.38*e,objectFit:"contain"}})}function y(){return(0,s.jsx)("img",{src:a.J+"/images/iris-logo.png",alt:"IRIS",className:"flex-shrink-0",style:{width:44,height:17,objectFit:"contain"}})}function b({msg:e,delayMs:t,animate:i}){let r="user"===e.role;return(0,s.jsxs)("div",{className:`flex items-end gap-2 ${r?"justify-end":"justify-start"}`,style:{animation:i?`ics-msg-in 0.38s cubic-bezier(0.22,1,0.36,1) ${t}ms both`:"none"},children:[!r&&(0,s.jsx)(y,{}),(0,s.jsxs)("div",{className:`flex flex-col gap-1.5 ${r?"items-end":"items-start"}`,style:{maxWidth:"82%"},children:[e.img&&("oil"===e.img?(0,s.jsx)(u,{}):(0,s.jsx)(g,{})),(e.text||e.bullets)&&(0,s.jsxs)("div",{className:"rounded-2xl px-3.5 py-2.5",style:{borderTopRightRadius:r?4:void 0,borderTopLeftRadius:r?void 0:4,background:r?"#155eef":"#EEF2FF",color:r?"#fff":"#1A1A2E",fontSize:13,lineHeight:1.6},children:[e.text&&(0,s.jsx)("p",{style:{fontFamily:"var(--font-dm-sans,sans-serif)",textWrap:"pretty"},children:e.text}),e.bullets&&(0,s.jsx)("ul",{className:"mt-1.5 flex flex-col gap-[3px]",children:e.bullets.map((e,t)=>(0,s.jsxs)("li",{className:"flex items-start gap-1.5",style:{fontSize:12,fontFamily:"var(--font-dm-sans,sans-serif)"},children:[(0,s.jsx)("span",{className:"mt-[2px] shrink-0",style:{color:r?"rgba(255,255,255,0.5)":"#155eef"},children:"›"}),(0,s.jsx)("span",{style:{opacity:r?.88:1},children:e})]},t))})]})]}),r&&(0,s.jsx)("div",{className:"flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center",style:{background:"#1e293b",color:"white",fontSize:9,fontWeight:700,fontFamily:"var(--font-gothic-a1,sans-serif)"},children:"U"})]})}function j(){return(0,s.jsxs)("div",{className:"flex items-end gap-2",children:[(0,s.jsx)(y,{}),(0,s.jsx)("div",{className:"flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl",style:{borderTopLeftRadius:4,background:"#EEF2FF"},children:[0,.2,.4].map((e,t)=>(0,s.jsx)("span",{className:"w-1.5 h-1.5 rounded-full inline-block",style:{background:"#155eef",opacity:.4,animation:`ics-dot-bounce 1.2s ease-in-out ${e}s infinite`}},t))})]})}function w({step:e,voicePhase:t}){let[i,n]=(0,r.useState)("");(0,r.useEffect)(()=>{if(0!==e)return void n("");if(1!==t)return;let i=0;n("");let s=setInterval(()=>{i++,n(x.slice(0,i)),i>=x.length&&clearInterval(s)},18);return()=>clearInterval(s)},[e,t]);let a=0===e&&0===t,o=0===e&&1===t&&i.length<x.length;return(0,s.jsxs)("div",{className:"shrink-0 px-3 pt-2 pb-3",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all duration-300",style:{background:"#F4F7FF",border:a?"1.5px solid rgba(21,94,239,0.4)":"1.5px solid #DBEAFE",boxShadow:a?"0 0 0 3px rgba(21,94,239,0.08)":"none"},children:[(0,s.jsx)("span",{style:{color:"#94A3B8",flexShrink:0},children:(0,s.jsx)(d,{})}),(0,s.jsx)("div",{className:"flex-1 flex items-center gap-1.5 min-w-0 overflow-hidden",children:a?(0,s.jsxs)("div",{className:"flex items-center gap-[2.5px] w-full",style:{height:22},children:[p.map((e,t)=>(0,s.jsx)("div",{style:{width:2.5,height:e,background:"linear-gradient(180deg,#93C5FD,#155eef)",borderRadius:2,flexShrink:0,transformOrigin:"center",animation:`ics-wave ${.65+t%4*.15}s ease-in-out ${t%6*.08}s infinite`}},t)),(0,s.jsx)("span",{className:"ml-auto text-[11px] font-medium flex-shrink-0",style:{color:"#155eef",fontFamily:"var(--font-dm-sans,sans-serif)"},children:"Listening…"})]}):(0,s.jsxs)("div",{className:"flex items-center gap-0.5 min-w-0 flex-1",children:[i&&(0,s.jsx)("span",{className:"text-[12.5px] truncate",style:{color:"#1A1A2E",fontFamily:"var(--font-dm-sans,sans-serif)"},children:i}),o&&(0,s.jsx)("span",{style:{display:"inline-block",width:1.5,height:13,background:"#155eef",borderRadius:1,flexShrink:0,animation:"ics-cursor 0.7s step-end infinite"}})]})}),(0,s.jsx)("div",{className:"flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",style:{background:a?"#155eef":"transparent",color:a?"white":"#94A3B8",animation:a?"ics-mic-glow 1.4s ease-in-out infinite":"none"},children:(0,s.jsx)(c,{})}),(0,s.jsx)("div",{className:"flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center",style:{background:"linear-gradient(135deg,#155eef,#1d4ed8)"},children:(0,s.jsx)(f,{})})]}),(0,s.jsx)("p",{className:"text-center mt-1.5",style:{fontSize:9.5,color:"#CBD5E1",fontFamily:"var(--font-dm-sans,sans-serif)"},children:"*IRIS is AI and can make mistakes. Please double-check responses."})]})}function k({step:e,showIris:t,voicePhase:i}){let n=(0,r.useRef)(null),a=e>0||2===i,o=m.filter(t=>t.step<e),d=a?m.filter(i=>i.step===e&&("user"===i.role||t)):[],c=[...o,...d],f=m.some(t=>t.step===e&&"iris"===t.role),h=a&&f&&!t;return(0,r.useEffect)(()=>{let e=n.current;e&&setTimeout(()=>e.scrollTo({top:e.scrollHeight,behavior:"smooth"}),80)},[c.length,h]),(0,s.jsxs)("div",{style:{width:300,flexShrink:0,background:"white",borderRadius:32,overflow:"hidden",border:"1px solid #E2E8F0",boxShadow:"0 0 0 8px rgba(226,232,240,0.45), 0 24px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",height:560,display:"flex",flexDirection:"column"},children:[(0,s.jsxs)("div",{className:"flex items-center justify-between px-5 pt-3.5 pb-1 flex-shrink-0",children:[(0,s.jsx)("span",{style:{fontSize:11.5,fontWeight:600,color:"#1e293b",fontFamily:"var(--font-dm-sans,sans-serif)"},children:"9:41"}),(0,s.jsxs)("div",{className:"flex items-center gap-2",children:[(0,s.jsx)("svg",{width:"15",height:"11",viewBox:"0 0 15 11",fill:"none",children:[0,3.5,7,10.5].map((e,t)=>(0,s.jsx)("rect",{x:e,y:11-(t+1)*2.5,width:"2.5",height:(t+1)*2.5,rx:"0.6",fill:t<3?"#1e293b":"#CBD5E1"},t))}),(0,s.jsxs)("svg",{width:"20",height:"10",viewBox:"0 0 20 10",fill:"none",children:[(0,s.jsx)("rect",{x:"0.5",y:"0.5",width:"15",height:"9",rx:"2",stroke:"#1e293b",strokeWidth:"0.9"}),(0,s.jsx)("rect",{x:"16",y:"3",width:"2.5",height:"4",rx:"1",fill:"#1e293b"}),(0,s.jsx)("rect",{x:"1.5",y:"1.5",width:"11",height:"7",rx:"1.5",fill:"#155eef"})]})]})]}),(0,s.jsxs)("div",{className:"flex items-center gap-2.5 px-4 pb-3 pt-1 flex-shrink-0",style:{borderBottom:"1px solid #F1F5F9"},children:[(0,s.jsx)("button",{style:{background:"none",border:"none",padding:0,cursor:"pointer",color:"#64748B",lineHeight:0,flexShrink:0},children:(0,s.jsx)(l,{})}),(0,s.jsx)(v,{size:36}),(0,s.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,s.jsx)("p",{style:{fontSize:14,fontWeight:700,color:"#1e293b",lineHeight:1,marginBottom:3,fontFamily:"var(--font-gothic-a1,sans-serif)"},children:"IRIS"}),(0,s.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,s.jsx)("div",{style:{width:6,height:6,borderRadius:"50%",background:"#22C55E",flexShrink:0}}),(0,s.jsx)("span",{style:{fontSize:11,color:"#64748B",fontFamily:"var(--font-dm-sans,sans-serif)"},children:"EHS AI Assistant \xb7 Online"})]})]}),(0,s.jsx)("div",{className:"flex flex-col gap-1 flex-shrink-0",children:[0,1,2].map(e=>(0,s.jsx)("div",{style:{width:3,height:3,borderRadius:"50%",background:"#CBD5E1"}},e))})]}),(0,s.jsxs)("div",{ref:n,className:"flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 ics-nosb",children:[c.map((t,i)=>{let r=t.step===e,n=d.indexOf(t);return(0,s.jsx)(b,{msg:t,animate:r,delayMs:r?140*n:0},`${t.step}-${t.role}-${i}`)}),h&&(0,s.jsx)(j,{})]}),(0,s.jsx)(w,{step:e,voicePhase:i})]})}function S({feat:e,active:t}){return(0,s.jsxs)("div",{style:{display:"flex",gap:14,maxWidth:300,opacity:+!!t,transform:t?"translateX(0)":`translateX(${"left"===e.side?-36:36}px)`,transition:"opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",pointerEvents:t?"auto":"none"},children:[(0,s.jsx)("div",{style:{width:3,alignSelf:"stretch",minHeight:52,borderRadius:4,flexShrink:0,marginTop:4,background:"linear-gradient(180deg,#ff8e37,#ff6d00)"}}),(0,s.jsxs)("div",{children:[(0,s.jsxs)("p",{style:{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.16em",color:"#ff6d00",marginBottom:6,fontFamily:"var(--font-dm-sans,sans-serif)"},children:["FEATURE ",e.num]}),(0,s.jsx)("h3",{style:{fontSize:18,fontWeight:700,color:"#1e293b",lineHeight:1.25,marginBottom:8,fontFamily:"var(--font-gothic-a1,sans-serif)"},children:e.title}),(0,s.jsx)("p",{style:{fontSize:13.5,lineHeight:1.7,color:"#64748B",fontFamily:"var(--font-dm-sans,sans-serif)",textWrap:"pretty"},children:e.desc})]})]})}function C(){let e=(0,r.useRef)(null),[t,i]=(0,r.useState)(0),[n,a]=(0,r.useState)(!1),[l,d]=(0,r.useState)(0),c=(0,r.useRef)(-1),f=(0,r.useRef)(void 0),m=(0,r.useRef)(void 0),p=(0,r.useRef)(void 0);return(0,r.useEffect)(()=>{if(document.getElementById("ics-css"))return;let e=document.createElement("style");return e.id="ics-css",e.textContent=o,document.head.appendChild(e),()=>{document.getElementById("ics-css")?.remove()}},[]),(0,r.useEffect)(()=>{let t=()=>{let t=e.current;if(!t)return;let s=-t.getBoundingClientRect().top,r=s<0?-1:Math.min(Math.floor(s/window.innerHeight),5);if(r!==c.current){if(c.current=r,r<0){i(0),clearTimeout(f.current),clearTimeout(m.current),clearTimeout(p.current);return}i(r),0===r?(clearTimeout(f.current),clearTimeout(m.current),d(0),a(!1),f.current=setTimeout(()=>d(1),500),m.current=setTimeout(()=>{d(2),clearTimeout(p.current),p.current=setTimeout(()=>a(!0),300)},500+(18*x.length+400))):(clearTimeout(f.current),clearTimeout(m.current),a(!1),clearTimeout(p.current),p.current=setTimeout(()=>a(!0),400))}};return window.addEventListener("scroll",t,{passive:!0}),t(),()=>window.removeEventListener("scroll",t)},[]),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("section",{className:"pt-[80px] md:pt-[100px] pb-0 px-6 bg-white",children:(0,s.jsxs)("div",{className:"max-w-[1160px] mx-auto flex flex-col items-center text-center gap-3",children:[(0,s.jsxs)("h2",{className:"font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#1b1b1b]",children:["AI agents available today,"," ",(0,s.jsx)("span",{style:{color:"#155eef"},children:"more on the way."})]}),(0,s.jsx)("p",{className:"font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] text-[#727272]",style:{whiteSpace:"nowrap"},children:"Each capability targets a real EHS gap. Scroll to see IRIS at work across all six."})]})}),(0,s.jsx)("div",{ref:e,style:{height:"700vh"},children:(0,s.jsxs)("div",{className:"sticky top-0 bg-white overflow-hidden",style:{height:"100vh"},children:[(0,s.jsxs)("div",{className:"hidden lg:grid h-full max-w-[1160px] mx-auto px-8 items-center",style:{gridTemplateColumns:"1fr 316px 1fr",gap:60},children:[(0,s.jsx)("div",{className:"relative flex items-center justify-end",style:{minHeight:240},children:h.map((e,i)=>"left"===e.side?(0,s.jsx)("div",{className:"absolute right-0",style:{zIndex:+(t===i)},children:(0,s.jsx)(S,{feat:e,active:t===i})},i):null)}),(0,s.jsx)("div",{className:"flex items-center justify-center h-full py-8",children:(0,s.jsx)(k,{step:t,showIris:n,voicePhase:l})}),(0,s.jsxs)("div",{className:"relative flex items-center justify-start",style:{minHeight:240},children:[h.map((e,i)=>"right"===e.side?(0,s.jsx)("div",{className:"absolute left-0",style:{zIndex:+(t===i)},children:(0,s.jsx)(S,{feat:e,active:t===i})},i):null),(0,s.jsx)("div",{className:"absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2.5",children:h.map((e,i)=>(0,s.jsx)("div",{className:"rounded-full transition-all duration-500",style:{width:6,height:t===i?24:6,background:t===i?"#ff6d00":"#E2E8F0"}},i))})]})]}),(0,s.jsxs)("div",{className:"lg:hidden flex flex-col h-full items-center pt-4 px-4 gap-3 overflow-hidden",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3 shrink-0 self-start pl-1",children:[(0,s.jsx)("div",{style:{width:3,height:30,background:"linear-gradient(180deg,#ff8e37,#ff6d00)",borderRadius:3}}),(0,s.jsxs)("div",{children:[(0,s.jsxs)("span",{style:{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.16em",color:"#ff6d00",fontFamily:"var(--font-dm-sans,sans-serif)"},children:["FEATURE ",h[t].num]}),(0,s.jsx)("p",{style:{fontSize:15,fontWeight:700,color:"#1e293b",fontFamily:"var(--font-gothic-a1,sans-serif)"},children:h[t].title})]})]}),(0,s.jsx)("div",{className:"flex-1 flex items-center justify-center min-h-0 w-full",style:{transform:"scale(0.9)",transformOrigin:"top center"},children:(0,s.jsx)(k,{step:t,showIris:n,voicePhase:l})}),(0,s.jsx)("div",{className:"flex gap-2 shrink-0 pb-2",children:h.map((e,i)=>(0,s.jsx)("div",{className:"rounded-full transition-all duration-500",style:{height:6,width:t===i?24:6,background:t===i?"#ff6d00":"#E2E8F0"}},i))})]})]})})]})}var z=i(2634),N=i(373),F=i(1519),I=i(3553),R=i(7823);function E({hue:e=0,hoverIntensity:t=.2,rotateOnHover:i=!0,forceHoverState:n=!1,backgroundColor:a="#000000"}){let o=(0,r.useRef)(null),l=`
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,d=`
    precision highp float;
    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform vec3 backgroundColor;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }

    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }

    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    const vec3 baseColor1 = vec3(0.611765, 0.262745, 0.996078);
    const vec3 baseColor2 = vec3(0.298039, 0.760784, 0.913725);
    const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;

    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }

    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);

      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;

      float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));

      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);

      v0 *= smoothstep(r0 * 1.05, r0, len);
      float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
      v0 *= mix(innerFade, 1.0, bgLuminance * 0.7);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;

      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.5, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);

      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

      vec3 colBase = mix(color1, color2, cl);
      float fadeAmount = mix(1.0, 0.1, bgLuminance);

      vec3 darkCol = mix(color3, colBase, v0);
      darkCol = (darkCol + v1) * v2 * v3;
      darkCol = clamp(darkCol, 0.0, 1.0);

      vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
      lightCol = mix(backgroundColor, lightCol, v0);
      lightCol = clamp(lightCol, 0.0, 1.0);

      vec3 finalCol = mix(darkCol, lightCol, bgLuminance);

      return extractAlpha(finalCol);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;

      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);

      return draw(uv);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;return(0,r.useEffect)(()=>{let s,r=o.current;if(!r)return;let c=new z.A({alpha:!0,premultipliedAlpha:!1}),f=c.gl;f.clearColor(0,0,0,0),r.appendChild(f.canvas);let h=new N.l(f),m=new F.B(f,{vertex:l,fragment:d,uniforms:{iTime:{value:0},iResolution:{value:new I.e(f.canvas.width,f.canvas.height,f.canvas.width/f.canvas.height)},hue:{value:e},hover:{value:0},rot:{value:0},hoverIntensity:{value:t},backgroundColor:{value:B(a)}}}),x=new R.e(f,{geometry:h,program:m});function p(){if(!r)return;let e=window.devicePixelRatio||1,t=r.clientWidth,i=r.clientHeight;c.setSize(t*e,i*e),f.canvas.style.width=t+"px",f.canvas.style.height=i+"px",m.uniforms.iResolution.value.set(f.canvas.width,f.canvas.height,f.canvas.width/f.canvas.height)}window.addEventListener("resize",p),p();let u=0,g=0,v=0,y=e=>{let t=r.getBoundingClientRect(),i=e.clientX-t.left,s=e.clientY-t.top,n=t.width,a=t.height,o=Math.min(n,a),l=(i-n/2)/o*2,d=(s-a/2)/o*2;u=+(.8>Math.sqrt(l*l+d*d))},b=()=>{u=0};r.addEventListener("mousemove",y),r.addEventListener("mouseleave",b);let j=r=>{s=requestAnimationFrame(j);let o=(r-g)*.001;g=r,m.uniforms.iTime.value=.001*r,m.uniforms.hue.value=e,m.uniforms.hoverIntensity.value=t,m.uniforms.backgroundColor.value=B(a);let l=n?1:u;m.uniforms.hover.value+=(l-m.uniforms.hover.value)*.1,i&&l>.5&&(v+=.3*o),m.uniforms.rot.value=v,c.render({scene:x})};return s=requestAnimationFrame(j),()=>{cancelAnimationFrame(s),window.removeEventListener("resize",p),r.removeEventListener("mousemove",y),r.removeEventListener("mouseleave",b),r.contains(f.canvas)&&r.removeChild(f.canvas),f.getExtension("WEBGL_lose_context")?.loseContext()}},[e,t,i,n,a]),(0,s.jsx)("div",{ref:o,className:"orb-container"})}function B(e){if(e.startsWith("#")){let t=parseInt(e.slice(1,3),16)/255,i=parseInt(e.slice(3,5),16)/255,s=parseInt(e.slice(5,7),16)/255;return new I.e(t,i,s)}let t=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(t)return new I.e(parseInt(t[1])/255,parseInt(t[2])/255,parseInt(t[3])/255);let i=e.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);return i?function(e,t,i){let s,r,n;if(0===t)s=r=n=i;else{let a=(e,t,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<1/6)?e+(t-e)*6*i:i<.5?t:i<2/3?e+(t-e)*(2/3-i)*6:e,o=i<.5?i*(1+t):i+t-i*t,l=2*i-o;s=a(l,o,e+1/3),r=a(l,o,e),n=a(l,o,e-1/3)}return new I.e(s,r,n)}(parseInt(i[1])/360,parseInt(i[2])/100,parseInt(i[3])/100):new I.e(0,0,0)}var A=i(6643);let L=[{title:"Attention Constraints",desc:"Human attention misses hazards and hidden patterns buried in large volumes of safety data.",icon:(0,s.jsx)(()=>(0,s.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,s.jsx)("path",{d:"M2 12C2 12 5 5 12 5s10 7 10 7-3 7-10 7S2 12 2 12z",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"}),(0,s.jsx)("circle",{cx:"12",cy:"12",r:"3",stroke:"currentColor",strokeWidth:"1.6"})]}),{}),color:"#155eef",bg:"#eff4ff"},{title:"Manual Reporting Friction",desc:"Forms-based reporting discourages timely incident submissions, creating data gaps at the source.",icon:(0,s.jsx)(()=>(0,s.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,s.jsx)("path",{d:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"}),(0,s.jsx)("rect",{x:"9",y:"3",width:"6",height:"4",rx:"1",stroke:"currentColor",strokeWidth:"1.6"}),(0,s.jsx)("path",{d:"M9.5 14.5l5-5M14.5 14.5l-5-5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),{}),color:"#ef4444",bg:"#fff5f5"},{title:"Surface-Level Investigations",desc:"Investigations that stop at symptoms fail to uncover true root causes — letting repeat incidents happen.",icon:(0,s.jsx)(()=>(0,s.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,s.jsx)("path",{d:"M12 2L2 7l10 5 10-5-10-5z",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"}),(0,s.jsx)("path",{d:"M2 12l10 5 10-5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"}),(0,s.jsx)("path",{d:"M2 17l10 5 10-5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})]}),{}),color:"#7c3aed",bg:"#f7f0ff"},{title:"Scattered Incident Records",desc:"Isolated records make it impossible to detect patterns or similarities across sites and time periods.",icon:(0,s.jsx)(()=>(0,s.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,s.jsx)("circle",{cx:"5",cy:"5",r:"2",stroke:"currentColor",strokeWidth:"1.5"}),(0,s.jsx)("circle",{cx:"19",cy:"7",r:"2",stroke:"currentColor",strokeWidth:"1.5"}),(0,s.jsx)("circle",{cx:"8",cy:"17",r:"2",stroke:"currentColor",strokeWidth:"1.5"}),(0,s.jsx)("circle",{cx:"18",cy:"16",r:"2",stroke:"currentColor",strokeWidth:"1.5"}),(0,s.jsx)("path",{d:"M7 5.5l10 1M6.5 15.5l10 0",stroke:"currentColor",strokeWidth:"1",strokeDasharray:"2 2",strokeLinecap:"round",opacity:"0.4"})]}),{}),color:"#4f46e5",bg:"#eff0ff"},{title:"Manual Insight Compilation",desc:"Aggregating data into meaningful EHS insights is time-intensive and often done too late to act.",icon:(0,s.jsx)(()=>(0,s.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,s.jsx)("circle",{cx:"12",cy:"12",r:"9",stroke:"currentColor",strokeWidth:"1.6"}),(0,s.jsx)("path",{d:"M12 7v5l3 3",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})]}),{}),color:"#f97316",bg:"#fff7ed"},{title:"Reviewer Fatigue",desc:"Visual hazards in field photos are overlooked when reviewers are overwhelmed or fatigued.",icon:(0,s.jsx)(()=>(0,s.jsxs)("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",children:[(0,s.jsx)("path",{d:"M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 2 12 2 12a17.8 17.8 0 0 1 5.06-6.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"}),(0,s.jsx)("path",{d:"M14.12 14.12A3 3 0 1 1 9.88 9.88",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})]}),{}),color:"#0891b2",bg:"#ecfeff"}];function W(e=.08){let t=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let i=t.current;if(!i)return;let s=new IntersectionObserver(([e])=>{e.isIntersecting&&(i.classList.add("iris-revealed"),s.disconnect())},{threshold:e});return s.observe(i),()=>s.disconnect()},[e]),t}let T=`
  /* Scroll-reveal base state */
  .iris-reveal-target {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
  }
  .iris-revealed .iris-reveal-target,
  .iris-reveal-target.iris-revealed {
    opacity: 1;
    transform: translateY(0);
  }
  /* Staggered children */
  .iris-stagger > .iris-reveal-target:nth-child(1) { transition-delay: 0ms; }
  .iris-stagger > .iris-reveal-target:nth-child(2) { transition-delay: 80ms; }
  .iris-stagger > .iris-reveal-target:nth-child(3) { transition-delay: 160ms; }
  .iris-stagger > .iris-reveal-target:nth-child(4) { transition-delay: 240ms; }
  .iris-stagger > .iris-reveal-target:nth-child(5) { transition-delay: 320ms; }
  .iris-stagger > .iris-reveal-target:nth-child(6) { transition-delay: 400ms; }

  /* Light AI thinking card — one-shot keyframes (driven by inline styles when active) */
  @keyframes lightBarGrow  { from{width:4%} to{width:82%} }
  @keyframes lightBarGrow2 { from{width:4%} to{width:54%} }
  @keyframes lightBarGrow3 { from{width:4%} to{width:70%} }
  @keyframes lightDotBounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-5px);opacity:1} }
  @keyframes lightRingPulse { 0%,100%{box-shadow:0 0 0 3px rgba(21,94,239,0.10)} 50%{box-shadow:0 0 0 7px rgba(21,94,239,0.20)} }

  /* Timeline capabilities */
  .tl-card-left  { opacity: 0; transform: translateX(-28px); transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1); }
  .tl-card-right { opacity: 0; transform: translateX(28px);  transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1); }
  .tl-node { opacity: 0; transform: scale(0.5); transition: opacity 0.35s ease 0.08s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.08s; }
  .tl-item.tl-visible .tl-card-left  { opacity: 1; transform: translateX(0); transition-delay: 0.1s; }
  .tl-item.tl-visible .tl-card-right { opacity: 1; transform: translateX(0); transition-delay: 0.1s; }
  .tl-item.tl-visible .tl-node { opacity: 1; transform: scale(1); }

  /* Zazu-style scattered problem cards */
  .zazu-card {
    opacity: 0;
    transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .zazu-card.zz-visible { opacity: 1; }

  /* Each card has a unique from-direction baked in via inline style */
  /* Desktop scattered layout */
  @media (min-width: 900px) {
    .zazu-scene { position: relative; min-height: 720px; }
    .zazu-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; width: 380px; z-index: 1; }
    .zazu-card { position: absolute; width: 260px; }
  }
  @media (max-width: 899px) {
    .zazu-scene { display: flex; flex-direction: column; gap: 16px; padding: 8px 0; }
    .zazu-center { position: static; transform: none; width: 100%; text-align: center; padding: 0 0 24px 0; }
    .zazu-card { position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; transform: none !important; width: 100% !important; opacity: 1 !important; transition: none !important; }
  }

  /* Grid animated background */
  .iris-grid-container {
    background-image:
      linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  @keyframes gridBoxFill {
    0%, 100% { opacity: 0; }
    50%       { opacity: 0.6; }
  }
  .iris-grid-box {
    position: absolute;
    width: 48px;
    height: 48px;
  }

`;function M(){(0,r.useEffect)(()=>{let e=document.createElement("style");return e.id="iris-page-styles",document.getElementById("iris-page-styles")||(e.textContent=T,document.head.appendChild(e)),()=>{document.getElementById("iris-page-styles")?.remove()}},[]);let e=W(),t=W(),i=W();W(),W();let o=W();return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("section",{className:"relative overflow-hidden px-4 sm:px-6",style:{minHeight:"100vh",background:"linear-gradient(to bottom, white 0%, white 85%, rgba(248,250,252,0.5) 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingTop:"clamp(100px, 15vh, 160px)",paddingBottom:"clamp(48px, 8vh, 100px)"},children:[(0,s.jsx)("style",{children:`
          .iris-hero-grid-container {
            background-image:
              linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
            background-size: 50px 50px;
          }
          @keyframes irisHeroGridBoxFill { 0%,100%{opacity:0} 50%{opacity:0.6} }
          .iris-hero-grid-box { position:absolute; width:48px; height:48px; }
          @keyframes irisCardFromLeft {
            from { opacity: 0; transform: translateX(-36px) translateY(8px); }
            to   { opacity: 1; transform: translateX(0) translateY(0); }
          }
          @keyframes irisCardFromRight {
            from { opacity: 0; transform: translateX(36px) translateY(8px); }
            to   { opacity: 1; transform: translateX(0) translateY(0); }
          }
          @keyframes irisCardFromBottom {
            from { opacity: 0; transform: translateY(28px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .iris-card-left {
            opacity: 0;
            animation: irisCardFromLeft 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards;
          }
          .iris-card-right {
            opacity: 0;
            animation: irisCardFromRight 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards;
          }
          .iris-card-bottom {
            opacity: 0;
            animation: irisCardFromBottom 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
          }
          .iris-hero-card {
            transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s ease;
            cursor: default;
          }
          .iris-hero-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 10px 32px rgba(0,0,0,0.10) !important;
          }
        `}),(0,s.jsxs)("div",{className:"absolute inset-0 overflow-hidden iris-hero-grid-container pointer-events-none",children:[Array.from({length:120},(e,t)=>{let i=Math.floor(t/20);return(7*t+3*t)%17==0?(0,s.jsx)("div",{className:"iris-hero-grid-box",style:{left:`${t%20*50+1}px`,top:`${50*i+1}px`,backgroundColor:["#EFF6FF","#DBEAFE","#BFDBFE","#93C5FD"][t%4],animation:`irisHeroGridBoxFill ${4+2*t%6}s ease-in-out infinite`,animationDelay:`${.3*t%12}s`}},`iris-hero-grid-box-${t}`):null}),(0,s.jsx)("div",{className:"absolute bottom-0 left-0 right-0 h-32 pointer-events-none",style:{background:"linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 70%, white 100%)"}})]}),(0,s.jsx)("div",{className:"relative z-10 text-center mb-2 animate-hero-rise",style:{animationDelay:"60ms"},children:(0,s.jsxs)("h1",{className:"font-[family-name:var(--font-gothic-a1)] font-bold text-[32px] sm:text-[44px] md:text-[56px] leading-[1.06] tracking-[-0.03em] text-[#0a0f1e]",children:["Meet IRIS",(0,s.jsx)("br",{}),(0,s.jsx)("span",{style:{color:"#1d4ed8"},children:"Intelligent Risk & Insight System"})]})}),(0,s.jsxs)("div",{className:"relative z-10 flex flex-col sm:flex-row items-center gap-3 mt-2 mb-8 animate-hero-rise",style:{animationDelay:"200ms"},children:[(0,s.jsxs)(A.default,{href:"#",className:"inline-flex items-center gap-2 px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-white duration-200 hover:shadow-lg",style:{backgroundImage:"linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",boxShadow:"0 4px 20px rgba(249,115,22,0.35)"},children:["Book AI Demo",(0,s.jsx)("svg",{width:"13",height:"13",viewBox:"0 0 16 16",fill:"none",children:(0,s.jsx)("path",{d:"M3 8h10M9 4l4 4-4 4",stroke:"white",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})})]}),(0,s.jsx)(A.default,{href:"#",fillColor:"#FFA660",hoverTextColor:"#ffffff",className:"px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] border",style:{borderColor:"#d1d5db",color:"#374151"},children:"See Pricing"})]}),(0,s.jsxs)("div",{className:"relative z-10 w-full max-w-[1100px]",children:[(0,s.jsxs)("div",{className:"flex items-center justify-center gap-5 lg:gap-8",children:[(0,s.jsxs)("div",{className:"hidden lg:flex flex-col gap-4 w-[220px] shrink-0",children:[(0,s.jsxs)("div",{className:"iris-hero-card iris-card-left",style:{background:"white",border:"1px solid #e8edf5",borderRadius:14,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",animationDelay:"350ms"},children:[(0,s.jsx)("p",{style:{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:10,fontFamily:"var(--font-dm-sans,sans-serif)"},children:"Hazard Intelligence"}),[["Chemical exposure","#ef4444",78],["Height work","#f97316",54],["Electrical","#eab308",35]].map(([e,t,i])=>(0,s.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:6},children:[(0,s.jsx)("span",{style:{fontSize:10,color:"#6b7280",width:88,flexShrink:0,fontFamily:"var(--font-dm-sans,sans-serif)"},children:e}),(0,s.jsx)("div",{style:{flex:1,height:4,background:"#f3f4f6",borderRadius:2,overflow:"hidden"},children:(0,s.jsx)("div",{style:{height:"100%",width:`${i}%`,background:String(t),borderRadius:2}})})]},String(e)))]}),(0,s.jsxs)("div",{className:"iris-hero-card iris-card-left",style:{background:"white",border:"1px solid #e8edf5",borderRadius:14,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",animationDelay:"480ms"},children:[(0,s.jsx)("p",{style:{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:10,fontFamily:"var(--font-dm-sans,sans-serif)"},children:"Predictive Analytics"}),(0,s.jsx)("div",{style:{display:"flex",alignItems:"flex-end",gap:3,height:40},children:[14,22,18,30,26,38,34,44].map((e,t)=>(0,s.jsx)("div",{style:{flex:1,height:`${e}px`,background:`rgba(59,130,246,${.25+.09*t})`,borderRadius:"3px 3px 0 0"}},t))}),(0,s.jsx)("p",{style:{fontSize:10,color:"#3b82f6",marginTop:6,fontFamily:"var(--font-dm-sans,sans-serif)",fontWeight:600},children:"↓ 23% risk reduction"})]})]}),(0,s.jsxs)("div",{className:"relative shrink-0",style:{width:280,height:280},children:[(0,s.jsx)(E,{hue:30,hoverIntensity:.5,rotateOnHover:!1,forceHoverState:!1,backgroundColor:"#ffffff"}),(0,s.jsx)("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"},children:(0,s.jsx)(n.default,{src:`${a.J}/images/iris-logo.png`,alt:"IRIS",width:90,height:90,style:{objectFit:"contain"}})})]}),(0,s.jsxs)("div",{className:"hidden lg:flex flex-col gap-4 w-[220px] shrink-0",children:[(0,s.jsxs)("div",{className:"iris-hero-card iris-card-right",style:{background:"white",border:"1px solid #e8edf5",borderRadius:14,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",animationDelay:"350ms"},children:[(0,s.jsx)("p",{style:{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:10,fontFamily:"var(--font-dm-sans,sans-serif)"},children:"Workflow Acceleration"}),[["Investigation","92%","#f59e0b"],["Actions closed","78%","#f97316"],["Reports filed","100%","#10b981"]].map(([e,t,i])=>(0,s.jsxs)("div",{style:{marginBottom:7},children:[(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:3},children:[(0,s.jsx)("span",{style:{fontSize:10,color:"#6b7280",fontFamily:"var(--font-dm-sans,sans-serif)"},children:e}),(0,s.jsx)("span",{style:{fontSize:10,fontWeight:700,color:String(i),fontFamily:"var(--font-dm-sans,sans-serif)"},children:t})]}),(0,s.jsx)("div",{style:{height:4,background:"#f3f4f6",borderRadius:2,overflow:"hidden"},children:(0,s.jsx)("div",{style:{height:"100%",width:t,background:String(i),borderRadius:2}})})]},String(e)))]}),(0,s.jsxs)("div",{className:"iris-hero-card iris-card-right",style:{background:"white",border:"1px solid #e8edf5",borderRadius:14,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",animationDelay:"480ms"},children:[(0,s.jsx)("p",{style:{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:10,fontFamily:"var(--font-dm-sans,sans-serif)"},children:"Natural Language Query"}),(0,s.jsx)("div",{style:{background:"#f3f4f6",borderRadius:8,padding:"7px 10px",marginBottom:7},children:(0,s.jsx)("p",{style:{fontSize:10,color:"#374151",fontFamily:"var(--font-dm-sans,sans-serif)",fontStyle:"italic"},children:"“Top risks this quarter?”"})}),(0,s.jsx)("div",{style:{background:"#eff6ff",borderRadius:8,padding:"7px 10px"},children:(0,s.jsx)("p",{style:{fontSize:10,color:"#1d4ed8",fontFamily:"var(--font-dm-sans,sans-serif)",fontWeight:500},children:"3 critical trends detected in Site A ↗"})})]})]})]}),(0,s.jsxs)("div",{className:"hidden lg:flex justify-center gap-4 mt-4",children:[(0,s.jsxs)("div",{className:"iris-hero-card iris-card-bottom w-[220px]",style:{background:"white",border:"1px solid #e8edf5",borderRadius:14,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",animationDelay:"560ms"},children:[(0,s.jsx)("p",{style:{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:10,fontFamily:"var(--font-dm-sans,sans-serif)"},children:"Smart Recommendations"}),["Deploy safety barriers","Retrain 3 operators","Update risk register"].map((e,t)=>(0,s.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:7,marginBottom:6},children:[(0,s.jsx)("div",{style:{width:15,height:15,borderRadius:4,background:0===t?"#10b981":"transparent",border:0===t?"none":"1.5px solid #d1d5db",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"},children:0===t&&(0,s.jsx)("svg",{width:"9",height:"9",viewBox:"0 0 9 9",children:(0,s.jsx)("path",{d:"M1.5 4.5l2 2 4-3.5",stroke:"white",strokeWidth:"1.3",strokeLinecap:"round",strokeLinejoin:"round"})})}),(0,s.jsx)("span",{style:{fontSize:10,color:0===t?"#9ca3af":"#374151",fontFamily:"var(--font-dm-sans,sans-serif)",textDecoration:0===t?"line-through":"none"},children:e})]},t))]}),(0,s.jsxs)("div",{className:"iris-hero-card iris-card-bottom w-[220px]",style:{background:"white",border:"1px solid #e8edf5",borderRadius:14,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",animationDelay:"620ms"},children:[(0,s.jsx)("p",{style:{fontSize:10,fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:10,fontFamily:"var(--font-dm-sans,sans-serif)"},children:"Intelligent Data Synthesis"}),(0,s.jsx)("div",{style:{display:"flex",gap:12,marginBottom:8},children:[["Incidents","247","#6366f1"],["Actions","89","#8b5cf6"],["Sites","14","#a78bfa"]].map(([e,t,i])=>(0,s.jsxs)("div",{style:{flex:1,textAlign:"center"},children:[(0,s.jsx)("p",{style:{fontSize:20,fontWeight:800,color:String(i),fontFamily:"var(--font-gothic-a1,sans-serif)",lineHeight:1},children:t}),(0,s.jsx)("p",{style:{fontSize:9,color:"#6b7280",fontFamily:"var(--font-dm-sans,sans-serif)",marginTop:3,textTransform:"uppercase",letterSpacing:"0.06em"},children:e})]},String(e)))})]})]})]})]}),(0,s.jsx)("section",{ref:e,className:"py-[70px] md:py-[90px] px-4 md:px-6",style:{background:"#F8FBFF"},children:(0,s.jsxs)("div",{className:"max-w-[760px] mx-auto text-center flex flex-col gap-5 iris-reveal-target",children:[(0,s.jsxs)("h2",{className:"font-[family-name:var(--font-gothic-a1)] font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-tight tracking-[-0.025em] text-[#1b1b1b]",children:["About ",(0,s.jsx)("span",{style:{color:"#155eef"},children:"IRIS"})]}),(0,s.jsxs)("p",{className:"font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#1b1b1b] text-pretty",children:["IRIS ",(0,s.jsx)("span",{style:{color:"#727272"},children:"(Intelligent Risk & Insight System)"})," ","is EHSWatch's embedded AI layer — built into every workflow your safety team already uses. Six capabilities work together to surface hazards earlier, accelerate incident closure and turn raw safety data into actionable intelligence that used to take days to compile manually."]}),(0,s.jsx)("div",{className:"w-12 border-t border-[#d1d5db] mx-auto"}),(0,s.jsx)("p",{className:"font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.75] italic text-[#727272]",children:"“IRIS doesn't replace your safety team's judgment — it sharpens it.”   "})]})}),(0,s.jsxs)("section",{className:"py-[70px] md:py-[90px] px-4 md:px-6 bg-white",children:[(0,s.jsx)("style",{children:`
          @media (min-width: 640px) and (max-width: 1023px) {
            .problems-row > *:nth-child(2n) { border-right: none !important; }
          }
        `}),(0,s.jsxs)("div",{className:"max-w-[1160px] mx-auto",children:[(0,s.jsxs)("div",{className:"text-center mb-10 md:mb-14",ref:t,children:[(0,s.jsxs)("h2",{className:"font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#1b1b1b] iris-reveal-target",children:["Why Traditional EHS Systems"," ",(0,s.jsx)("span",{style:{color:"#155eef"},children:"Fall Short"})]}),(0,s.jsx)("p",{className:"font-[family-name:var(--font-dm-sans)] text-[14px] sm:text-[15px] leading-[1.75] text-[#727272] mt-3 max-w-[520px] mx-auto text-pretty iris-reveal-target",style:{transitionDelay:"80ms"},children:"Human attention, manual processes and scattered data create dangerous gaps."})]}),(0,s.jsx)("div",{ref:i,children:[0,1].map(e=>{let t=L.slice(3*e,3*e+3),i=1===e;return(0,s.jsx)("div",{className:"problems-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 iris-stagger iris-reveal-target",style:{transitionDelay:`${120*e}ms`},children:t.map((e,t)=>(0,s.jsxs)("div",{className:"flex flex-col gap-3 px-5 sm:px-7 py-6 sm:py-8",style:{borderBottom:i?"none":"1px solid #e5e7eb",borderRight:t<2?"1px solid #e5e7eb":"none"},children:[(0,s.jsx)("div",{className:"w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0",style:{backgroundColor:e.color+"14",color:e.color},children:e.icon}),(0,s.jsx)("h3",{className:"font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] text-[#0a0f1e] leading-snug",children:e.title}),(0,s.jsx)("p",{className:"font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] leading-[1.65] text-pretty",children:e.desc})]},e.title))},e)})})]})]}),(0,s.jsx)(C,{}),(0,s.jsx)("section",{ref:o,className:"relative py-12 md:py-[61px] px-4 md:px-6 overflow-hidden iris-reveal-target",style:{background:"#f1f7ff"},children:(0,s.jsxs)("div",{className:"max-w-[800px] mx-auto flex flex-col gap-3 md:gap-[16px] items-center text-center",children:[(0,s.jsx)("h2",{className:"font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[44px] leading-tight text-[#0a0f1e] whitespace-nowrap",children:"Put IRIS to work on your safety data"}),(0,s.jsx)("p",{className:"font-[family-name:var(--font-dm-sans)] text-[14px] md:text-[15px] leading-relaxed text-[#6b7280] max-w-[500px] whitespace-nowrap",children:"See what you've been missing. Book a demo and explore every AI capability live."}),(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row gap-3 md:gap-[16px] items-center justify-center pt-4 md:pt-[24px]",children:[(0,s.jsx)(A.default,{href:"#",className:"flex items-center justify-center px-6 md:px-[26px] py-3 md:py-[10px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-white whitespace-nowrap",style:{backgroundImage:"linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)"},children:"Book Your Free Demo"}),(0,s.jsx)(A.default,{fillColor:"#FFA660",hoverTextColor:"#ffffff",href:"#",className:"flex items-center justify-center px-7 md:px-[31.5px] py-3 md:py-[10px] rounded-full border font-[family-name:var(--font-dm-sans)] text-[14px] text-[#ff6d00]",style:{background:"rgba(255,120,44,0.1)",borderColor:"rgba(255,120,44,0.2)"},children:"View Pricing"})]})]})})]})}}},e=>{e.O(0,[591,131,992,441,794,358],()=>e(e.s=4694)),_N_E=e.O()}]);