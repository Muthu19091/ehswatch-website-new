"use client";

import React, { useEffect, useRef, useState } from "react";
import { basePath } from "@/lib/basePath";

const VID = basePath + "/images/Solutions_/Videos/";

function resolveVideoUrl(video: unknown): string | null {
  if (!video || typeof video !== "string") return null;
  if (video.startsWith("/")) return `https://stage.odigma.ooo${video}`;
  return video;
}

interface Solution {
  heading: string;
  body: string;
}
interface Industry {
  label: string;
  subcopy: string;
  video: string | null;
  gif: string | null;
  solutions: Solution[];
}

const INDUSTRIES: Industry[] = [
  {
    label: "Construction & Infrastructure Projects",
    subcopy: "Keep every site safe, compliant and in control, from groundbreak to handover.",
    video: VID + "construction-infrastructure.mp4",
    gif: null,
    solutions: [
      {
        heading: "Real-Time Hazard and Near-Miss Reporting",
        body: "Field workers and site supervisors can report unsafe conditions, near misses and observations directly from their mobile devices — even offline on remote sites.",
      },
      {
        heading: "Digital Permit-to-Work and Site Induction Workflows",
        body: "Replace paper-based PTW and induction processes with configurable digital workflows that enforce approval chains, track permit validity, and confirm worker competency before work begins.",
      },
      {
        heading: "Multi-Site Inspection and Audit Management",
        body: "Plan and conduct site safety audits, scaffolding inspections, equipment checks and method statement reviews using digital checklists tailored to each project phase.",
      },
      {
        heading: "Subcontractor and Workforce Safety Management",
        body: "Track training records, competency certifications, induction completion, and permit authorisation for every worker, direct employee or subcontractor, across all sites.",
      },
    ],
  },
  {
    label: "Manufacturing & Engineering",
    subcopy: "Protect your workforce, your plant and your production continuity.",
    video: VID + "manufacturing-engineering.mp4",
    gif: null,
    solutions: [
      { heading: "Machine and Equipment Risk Assessment", body: "Create and maintain structured risk assessments for every piece of plant and equipment, documenting identified hazards, control hierarchy and residual risk ratings." },
      { heading: "Digital LOTO and Maintenance Safety Workflows", body: "Digitise lockout/tagout procedures with configurable, equipment-specific workflows that enforce isolation verification steps and require documented sign-off before maintenance begins." },
      { heading: "Shift Incident and Near-Miss Reporting", body: "Give every shift worker, supervisor and safety officer a fast, mobile-first way to report incidents, near misses and unsafe conditions without interrupting production." },
      { heading: "Plant-Wide Audit and Compliance Management", body: "Schedule and execute compliance audits, management system reviews and regulatory inspections across all facilities using configurable checklists aligned with ISO 45001, COSHH, RIDDOR and sector-specific requirements." },
    ],
  },
  {
    label: "Oil, Gas & Energy",
    subcopy: "Eliminate permit gaps, accelerate investigations and protect your most critical assets.",
    video: VID + "oil-gas-energy.mp4",
    gif: null,
    solutions: [
      { heading: "Digitised Permit-to-Work with Mandatory Controls", body: "Replace paper-based PTW systems with a digital workflow that enforces approval chains, links every permit to its associated risk assessment and JSA, tracks permit validity in real time and prevents unauthorised hot work or high-hazard tasks from proceeding without documented controls." },
      { heading: "Structured Incident Investigation and Closure Tracking", body: "Manage all incident types, from near misses and hydrocarbon releases to high-potential events and process safety incidents, through a structured investigation workflow with root cause analysis, corrective action assignment and regulatory reporting outputs." },
      { heading: "Process Safety and Risk Register Management", body: "Maintain asset-specific risk registers and process safety documentation in a live, accessible platform, linked directly to active permits, inspection schedules and management of change processes." },
      { heading: "Emergency Response Drill Management and Readiness Tracking", body: "Plan, execute and evaluate emergency response drills with objective-based scoring, real-time participation tracking and corrective action workflows." },
    ],
  },
  {
    label: "Logistics, Ports & Transport",
    subcopy: "Keep drivers safer, warehouses compliant, and every incident on record.",
    video: VID + "logistics-warehousing-transport.mp4",
    gif: null,
    solutions: [
      { heading: "Fleet Incident and Near-Miss Reporting", body: "Give drivers and fleet supervisors a fast, mobile-first way to report road incidents, near misses, vehicle defects and cargo-handling injuries from any device." },
      { heading: "Vehicle and Equipment Inspection Management", body: "Schedule, conduct and record pre-use and periodic inspections for all vehicles, forklifts, racking systems and material handling equipment using configurable digital checklists." },
      { heading: "Driver Safety, Training and Fatigue Compliance", body: "Maintain complete records of driver training, licence validity, vehicle authorisation and defensive driving certification across your entire fleet." },
      { heading: "Warehouse Safety and CAPA Management", body: "Capture and investigate warehouse incidents, unsafe conditions, manual handling observations and near misses through structured digital workflows, with findings converting automatically into tracked corrective actions." },
    ],
  },
  {
    label: "Facilities & Property Management",
    subcopy: "Protect every building, every contractor and every occupant under your responsibility.",
    video: VID + "facilities-property-management.mp4",
    gif: null,
    solutions: [
      { heading: "Contractor Onboarding and Safety Qualification", body: "Manage contractor inductions, safety questionnaires, insurance verification and site access authorisation through a structured digital workflow." },
      { heading: "Fire Safety and Building Compliance Inspection Management", body: "Plan and conduct fire safety inspections, statutory maintenance checks, fire evacuation drills and building compliance audits using configurable digital checklists." },
      { heading: "Maintenance Safety and CAPA Tracking", body: "Capture maintenance-related incidents, near misses and unsafe conditions through structured incident reporting workflows." },
      { heading: "Regulatory Compliance Documentation and Legal Register", body: "Maintain a centralised register of all statutory safety obligations, regulatory requirements and compliance deadlines applicable to each managed asset." },
    ],
  },
  {
    label: "Energy & Utilities",
    subcopy: "Protect field teams, manage regulatory obligations and maintain safe operations across live networks.",
    video: VID + "utilities-and-public-services.mp4",
    gif: null,
    solutions: [
      { heading: "Control-of-Work and Isolation Safety Management", body: "Digitise permit-to-work, isolation and switching safety procedures with configurable digital workflows that enforce mandatory authorisation steps, track isolation point status in real time and prevent live-network work from proceeding without documented controls." },
      { heading: "Mobile-First Field Incident and Near-Miss Reporting", body: "Field teams working on remote substations, transmission lines and distribution networks can report incidents, near misses and unsafe conditions directly from their mobile devices." },
      { heading: "Contractor and Third-Party Safety Management", body: "Track induction completion, competency certifications, permit authorisation and safety performance for all contractors and third-party workers operating on your infrastructure." },
      { heading: "Regulatory Compliance Documentation and Audit Trail", body: "Maintain a complete, auditable compliance record covering statutory inspection schedules, regulatory reporting obligations, permit records and incident investigation outputs." },
    ],
  },
  {
    label: "Aviation",
    subcopy: "From ramp to runway — structured safety management across every aviation operation.",
    video: null,
    gif: null,
    solutions: [
      { heading: "Ground Operations Hazard and Incident Reporting", body: "Give ground crews, turnaround supervisors and maintenance technicians a fast, mobile-first way to report incidents, near misses, FOD findings and equipment defects directly from the ramp or hangar." },
      { heading: "Safety Management System (SMS) Compliance and Audit Management", body: "Plan and conduct SMS compliance audits, safety reviews and IATA ISAGO preparation audits using configurable digital checklists aligned with your organisation's SMS framework." },
      { heading: "Permit-to-Work and Maintenance Safety Controls", body: "Manage access control and work authorisation for high-risk maintenance, fuelling and infrastructure activities through digital permit-to-work workflows with configurable approval chains, toolbox talk confirmation and linked risk assessments." },
      { heading: "Training Compliance and Competency Tracking", body: "Maintain a complete, up-to-date record of safety training completion, licence validity, type rating currency and competency certification for every employee and contractor across all stations." },
    ],
  },
  {
    label: "Mining & Metals",
    subcopy: "Manage risk at depth — structured safety workflows for surface and underground operations.",
    video: null,
    gif: null,
    solutions: [
      { heading: "Critical Control and Permit-to-Work Management", body: "Manage and verify the critical controls applied to your highest-consequence hazard scenarios through digital permit-to-work and pre-task risk assessment workflows." },
      { heading: "High-Consequence Incident Investigation and Reporting", body: "Manage serious incidents, high-potential events, ground movement reports and fatigue-related near misses through structured investigation workflows that support 5-Why and bow-tie root cause methodologies." },
      { heading: "Site and Equipment Safety Inspection Management", body: "Plan and conduct structured safety inspections of mobile equipment, ground support systems, ventilation infrastructure, electrical installations and surface facilities using configurable digital checklists." },
      { heading: "Contractor and Workforce Safety Compliance Tracking", body: "Manage induction completion, competency verification, permit authorisation and site access control for the large contractor and sub-contractor workforces typical in mining operations." },
    ],
  },
  {
    label: "Healthcare & Medical Centres",
    subcopy: "Protect the people who protect patients — structured safety management across healthcare environments.",
    video: null,
    gif: VID + "Healthcare.gif",
    solutions: [
      { heading: "Staff Safety Incident and Near-Miss Reporting", body: "Give clinical and non-clinical staff a fast, mobile-accessible way to report workplace injuries, needlestick incidents, manual handling events, violence and aggression events and near misses." },
      { heading: "Infection Control and Clinical Environment Audit Management", body: "Plan and conduct infection prevention and control audits, environmental cleanliness inspections and clinical governance compliance reviews using configurable digital checklists aligned with CQC, NICE, Joint Commission and local regulatory standards." },
      { heading: "Staff Safety Training and Competency Compliance", body: "Maintain complete records of mandatory safety training completion for all clinical and support staff with automated alerts when certificates approach expiry." },
      { heading: "Regulatory Compliance and Legal Register Management", body: "Maintain a central register of all applicable health and safety legislative requirements, regulatory standards and organisational policy obligations." },
    ],
  },
  {
    label: "Food & Beverage",
    subcopy: "Protect your workforce, your product quality and your regulatory standing — from production to distribution.",
    video: null,
    gif: VID + "Food-and-Beverage.gif",
    solutions: [
      { heading: "Production Environment Safety Incident Reporting", body: "Give production line workers, warehouse teams and maintenance technicians a fast, mobile-accessible way to report workplace injuries, near misses, chemical exposures, machinery-related incidents and unsafe conditions from any device on the production floor." },
      { heading: "Food Safety and HACCP Compliance Audit Management", body: "Plan and conduct HACCP reviews, GMP compliance audits, hygiene inspections, cold chain verification checks and BRC/IFS/SQF certification audits using configurable digital checklists aligned with your food safety management system requirements." },
      { heading: "Non-Conformance and CAPA Management", body: "Capture product non-conformances, customer complaints, process deviations and quality failures through a structured workflow, from initial detection through root cause investigation, corrective action assignment and verified closure." },
      { heading: "Supplier and Contractor Safety and Quality Management", body: "Manage supplier qualification, onboarding documentation, quality audit programmes and safety performance tracking for all raw material suppliers, contract manufacturers and logistics partners." },
    ],
  },
];

/* ── Placeholder visual ── */
function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-2xl"
      style={{ background: "linear-gradient(135deg, #EEF4FF 0%, #F8FBFF 100%)" }}
    >
      <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center" style={{ boxShadow: "0 6px 20px rgba(21,94,239,0.08)" }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#155eef" strokeWidth="1.6"/>
          <circle cx="8.5" cy="10" r="1.6" stroke="#155eef" strokeWidth="1.4"/>
          <path d="M5 17l4-4 3 2.5L16 11l3 3" stroke="#155eef" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280]">
        {label} illustration coming soon
      </p>
    </div>
  );
}

/* ── Media panel ── */
function MediaBlock({ industry }: { industry: Industry }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setVideoReady(false);
    const vid = videoRef.current;
    if (!vid) return;
    vid.load();
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }, [industry]);

  if (!industry.video && !industry.gif) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <MediaPlaceholder label={industry.label} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {!videoReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-[#e2e8f0] border-t-[#155eef] animate-spin" />
        </div>
      )}

      {industry.video ? (
        <video
          key={industry.video}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className="w-full h-full"
          style={{
            objectFit: "contain",
            objectPosition: "center",
            transform: "scale(1.4)",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <source src={industry.video} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={industry.gif!}
          alt={industry.label}
          onLoad={() => setVideoReady(true)}
          className="w-full h-full"
          style={{
            objectFit: "contain",
            transform: "scale(0.85)",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      )}
    </div>
  );
}

export interface CmsIndustryCard {
  title: string;
  subheading?: string;
  video?: string | null;
  accordion_items?: Record<string, { title?: string; description?: string }>;
}

function cmsCardToIndustry(card: CmsIndustryCard): Industry {
  const solutions: Solution[] = card.accordion_items
    ? Object.values(card.accordion_items)
        .filter((a) => a.title)
        .map((a) => ({ heading: a.title!, body: a.description || "" }))
    : [];
  return {
    label:     card.title,
    subcopy:   card.subheading || "",
    video:     resolveVideoUrl(card.video ?? null),
    gif:       null,
    solutions: solutions.length > 0 ? solutions : [],
  };
}

/* ── Main ── */
export default function SolutionsZigzag({ cmsCards }: { cmsCards?: CmsIndustryCard[] }) {
  if (!cmsCards || cmsCards.length === 0) return null;

  const ACTIVE = cmsCards.map(cmsCardToIndustry);

  const [activeIdx, setActiveIdx] = useState(0);
  const [openIdx, setOpenIdx] = useState(0);

  const industry = ACTIVE[activeIdx];

  function handleTab(i: number) {
    setActiveIdx(i);
    setOpenIdx(0);
  }

  return (
    <section className="bg-white py-12 md:py-20 px-6">
      <div className="max-w-[1240px] mx-auto">

        {/* Tab bar — wraps on desktop, scrolls on mobile */}
        <div className="hidden md:flex flex-wrap gap-2 justify-center mb-8">
          {ACTIVE.map((ind, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={i}
                onClick={() => handleTab(i)}
                className="px-[15px] py-[7px] rounded-full text-[13px] font-medium transition-all duration-200"
                style={isActive ? {
                  background: "#FFF3EC",
                  color: "#FF6D00",
                  border: "1.5px solid #FF9A5C",
                  fontWeight: 600,
                } : {
                  background: "white",
                  color: "#374151",
                  border: "1.5px solid #e5e7eb",
                }}
              >
                {ind.label}
              </button>
            );
          })}
        </div>

        {/* Mobile — horizontally scrollable tab row */}
        <div className="md:hidden overflow-x-auto pb-2 mb-6 -mx-6 px-6">
          <div className="flex gap-2 w-max">
            {ACTIVE.map((ind, i) => {
              const isActive = activeIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => handleTab(i)}
                  className="flex-shrink-0 px-[14px] py-[7px] rounded-full text-[12.5px] font-medium whitespace-nowrap transition-all duration-200"
                  style={isActive ? {
                    background: "#FFF3EC",
                    color: "#FF6D00",
                    border: "1.5px solid #FF9A5C",
                    fontWeight: 600,
                  } : {
                    background: "white",
                    color: "#374151",
                    border: "1.5px solid #e5e7eb",
                  }}
                >
                  {ind.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orange dot separator */}
        <div className="flex justify-center mb-8 md:mb-10">
          <span
            className="rounded-full"
            style={{ width: 10, height: 10, background: "#FF6D00", display: "block" }}
          />
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left — media */}
          <div className="order-2 lg:order-1" style={{ aspectRatio: "4/3" }}>
            <MediaBlock key={industry.label} industry={industry} />
          </div>

          {/* Right — copy */}
          <div className="order-1 lg:order-2 flex flex-col">
            <h3
              className="font-[family-name:var(--font-gothic-a1)] font-bold leading-[1.15] text-[#0a0f1e]"
              style={{ fontSize: "clamp(20px, 1.9vw, 27px)" }}
            >
              {industry.label}
            </h3>
            <p
              className="font-[family-name:var(--font-dm-sans)] mt-3 mb-7 text-[15px] md:text-[16px] leading-[1.7] text-[#6b7280] text-pretty"
              style={{ maxWidth: 520 }}
            >
              {industry.subcopy}
            </p>

            <div className="flex flex-col">
              {industry.solutions.map((sol, i) => {
                const open = openIdx === i;
                return (
                  <div key={i} style={{ borderTop: i > 0 ? "1px solid #F0F0F0" : "none" }}>
                    <button
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      className="w-full flex items-start gap-3 py-[14px] text-left"
                    >
                      <span
                        className="flex-shrink-0 rounded-full mt-[7px]"
                        style={{ width: 7, height: 7, background: open ? "#FF6D00" : "#C7D2E5" }}
                      />
                      <span
                        className="font-[family-name:var(--font-gothic-a1)] font-bold text-[15px] flex-1"
                        style={{ color: open ? "#0a0f1e" : "#374151", transition: "color 0.2s" }}
                      >
                        {sol.heading}
                      </span>
                    </button>

                    <div
                      style={{
                        maxHeight: open ? 280 : 0,
                        opacity: open ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.4s ease, opacity 0.35s ease",
                      }}
                    >
                      <p className="font-[family-name:var(--font-dm-sans)] text-[13.5px] leading-[1.7] text-[#6b7280] pl-[19px] pb-[14px] text-pretty">
                        {sol.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
