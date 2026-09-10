"use client";

import { useEffect } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Arabic translation overrides.

   The site translates to Arabic via Google Translate (machine). For a curated
   set of strings the client has authored, we override the machine output:
   we tag the matching elements translate="no" (so Google leaves them) and
   inject the authored Arabic when Arabic is active — restoring the English when
   it isn't. Everything else keeps using Google Translate.

   Keyed on the ENGLISH source so it's robust and reversible. One entry
   (industries subheadline) has no stable English source, so it's matched on
   the machine Arabic instead (AR_FIX).
   ──────────────────────────────────────────────────────────────────────── */

// English source (whitespace-normalised) → authored Arabic.
// Exported: GoogleTranslate.tsx also consults this map at the raw TEXT-NODE
// level (see its `run()`), which is what lets an entry here override a plain
// text node that sits BEFORE a nested inline span — e.g. "Designed Around
// Your <span class='hd-hl'>EHS Needs</span>, Not a Template". This component's
// own element-matching below only ever sees the whole heading's concatenated
// textContent ("Designed Around Your EHS Needs, Not a Template"), so an entry
// keyed on just the lead-in fragment can never match through THIS component
// alone — GoogleTranslate.tsx's text-node-level pass is what actually applies
// it. Both consumers share one source of truth either way.
export const EN_TO_AR: Record<string, string> = {
  "Back": "رجوع",
  "Book a Demo": "احجز عرضاً توضيحياً",
  "Step 1": "الخطوة الأولى",
  "Step 2": "الخطوة الثانية",
  "Step 3": "الخطوة الثالثة",
  "Step 4": "الخطوة الرابعة",
  "Explore": "استكشاف",
  "What is the minimum term for a contract?": "ما هو الحد الأدنى لمدة العقد؟",
  "Speak to our team to find the right configuration for your organisation.":
    "تحدث إلى فريقنا للعثور على الإعداد المناسب لمؤسستك.",
  // Same phrase as authored in Title Case on the Pricing page (exact-match keyed).
  "Speak to Our Team to Find the Right Configuration for Your Organisation.":
    "تحدث إلى فريقنا للعثور على الإعداد المناسب لمؤسستك.",
  "AI-powered EHS platform to streamline reporting everywhere.":
    "منصة الصحة والسلامة والبيئة المدعومة بالذكاء الاصطناعي، تمكّن الفرق من العمل بأمان، والامتثال للوائح، وإدارة العمليات بكفاءة.",
  // Footer summary (both EHSQ and EHS wordings) — authored Arabic per client.
  "AI-powered EHSQ platform helping teams stay safe, compliant, and in control.":
    "منصة الصحة والسلامة والبيئة المدعومة بالذكاء الاصطناعي، تمكّن الفرق من العمل بأمان، والامتثال للوائح، وإدارة العمليات بكفاءة.",
  "AI-powered EHS platform helping teams stay safe, compliant, and in control.":
    "منصة الصحة والسلامة والبيئة المدعومة بالذكاء الاصطناعي، تمكّن الفرق من العمل بأمان، والامتثال للوائح، وإدارة العمليات بكفاءة.",
  "Turn Findings Into Results": "حوّل النتائج إلى نتائج قابلة للتنفيذ",
  "Why Traditional EHS Systems Fall Short": "لماذا تقصر أنظمة الصحة والسلامة والبيئة التقليدية؟",
  "What Sets EHSWatch Action Tracker Apart": "ما الذي يميز نظام EHSWatch Action Tracker؟",
  "About IRIS": "IRIS عن",
  "EHSWatch: One Platform for Everyday Safety": "EHSWatch: منصة واحدة للسلامة اليومية",
  // Header / footer navigation labels (authored Arabic).
  "Company": "الشركة",
  "Home": "الصفحة الرئيسية",
  "About Us": "من نحن",
  "Product": "منتجات",
  "Products": "منتجات",
  "Pricing": "الأسعار",
  "Case Studies": "دراسات",
  "Blogs": "مقالات",
  "Support": "الدعم",
  "Industries": "الصناعات",
  "Contact Us": "اتصل بنا",
  "Resources": "الموارد",
  // Pricing page headline fragments -- confirmed via direct API testing that
  // Google's free translate endpoint returns these 3 specific fragments
  // completely UNCHANGED (untranslated), even though the rest of the page
  // translates fine. Each one leads into a CMS-authored Arabic <span> that's
  // already correct, so only the plain-text lead-in needed a fix.
  "Simple, Flexible Pricing for": "أسعار بسيطة ومرنة لـ",
  // The hero's highlighted span (2nd text node of the same heading) --
  // confirmed via the same architectural fix (see EN_TO_AR export note above)
  // that only the lead-in was reachable before; this completes the heading.
  "Enterprise-Grade EHSQ Management": "إدارة EHSQ على مستوى المؤسسات",
  "Designed Around Your": "مصمم حول",
  // The other 2 text nodes of this same heading -- the highlighted span
  // ("EHS Needs") and the trailing text after it (", Not a Template") --
  // confirmed unreliable the same way; completes the heading.
  "EHS Needs": "احتياجات EHS",
  ", Not a Template": "، وليس قالبًا جاهزًا",
  "Custom pricing is available": "التسعير المخصص متاح",
  // Same Google-API-unreliable pattern as above -- confirmed via direct
  // testing that these two specifically come back unchanged (the third
  // pill on the same page, "Integration with existing ERP...", translates
  // fine every time -- this pair is inconsistent, not a hard failure, which
  // is worse than a hard failure for a production site: a curated override
  // guarantees correctness regardless of what Google's free endpoint does
  // on any given request.
  "Specific module combinations across different business units":
    "مجموعات وحدات محددة لوحدات الأعمال المختلفة",
  "Multi-site or multi-country deployments with regional configuration":
    "عمليات نشر متعددة المواقع أو الدول بتكوين إقليمي",
  // Same page, third pill -- confirmed AGAIN unreliable (untranslated in a
  // fresh client screenshot) despite y-day's note that it "translates fine
  // every time". Non-deterministic, so curated like its two siblings above.
  "Integration with existing ERP, HRMS or BI systems":
    "التكامل مع أنظمة تخطيط موارد المؤسسات (ERP) أو إدارة الموارد البشرية (HRMS) أو أنظمة ذكاء الأعمال (BI) الحالية",
  // Pricing page body copy -- both paragraphs confirmed fully untranslated in
  // the same screenshot (same non-deterministic Google free-API failure).
  "EHSWatch is built for organisations that cannot afford generic templates or rigid licensing. Our pricing reflects how you actually use EHSQ software — across sites, modules, users, and compliance requirements. With EHSWatch, you pay for the capabilities you need, not for bundled features you won’t use.":
    "تم تصميم EHSWatch للمؤسسات التي لا يمكنها الاعتماد على القوالب العامة أو نماذج الترخيص الجامدة. يعكس نظام التسعير لدينا طريقة استخدامك الفعلية لبرنامج EHSQ — عبر المواقع والوحدات والمستخدمين ومتطلبات الامتثال. مع EHSWatch، أنت تدفع مقابل الإمكانيات التي تحتاجها فعلاً، وليس مقابل ميزات مجمّعة لن تستخدمها.",
  "Implementation support, configuration, and role-based access are built into the way pricing is structured, so you can focus on improving safety and compliance instead of deciphering licence tiers.":
    "دعم التنفيذ والتهيئة والوصول القائم على الأدوار مدمجة ضمن هيكلة التسعير، بحيث يمكنك التركيز على تحسين السلامة والامتثال بدلاً من فك رموز مستويات الترخيص.",
  // Contact/Support form heading + submit button (authored Arabic).
  "Get in Touch with Our Team": "تواصل مع فريقنا",
  "Submit": "إرسال",
  "Support Ticket": "تذكرة الدعم",
  // Also feeds GoogleTranslate.tsx's placeholder-swap (see EN_TO_AR export
  // note) -- the Comments textarea's placeholder duplicates its label text.
  "Comments": "تعليقات",
  // Contact page — "Global and Regional Operations" hub list. Confirmed fully
  // untranslated in a client screenshot; each is a self-contained <p>
  // (CSS-uppercased via the `uppercase` class, not literal-uppercase text).
  "Global and Regional Operations": "العمليات العالمية والإقليمية",
  "Americas Hub": "مركز الأمريكتين",
  "Middle East Hub": "مركز الشرق الأوسط",
  "Development Center": "مركز التطوير",
  "APAC Tech Center": "مركز APAC التقني",
  "Email Us": "راسلنا",
  // Footer — appears on every page, so this fixes the same gap sitewide.
  "MODULES": "الوحدات",
  "Action Tracker": "متتبع الإجراءات",
  "Audit Management": "إدارة التدقيق",
  "Customer Complaints": "شكاوى العملاء",
  "Emergency Response Drills": "تدريبات الاستجابة للطوارئ",
  "File Management": "إدارة الملفات",
  "HSE Observations": "ملاحظات الصحة والسلامة والبيئة",
  "Incident Management": "إدارة الحوادث",
  "Inspections": "عمليات التفتيش",
  "Legal Register": "السجل القانوني",
  "Management of Change": "إدارة التغيير",
  "Meetings Management": "إدارة الاجتماعات",
  "Non-conformance": "عدم المطابقة",
  "Permit to Work": "تصريح العمل",
  "Risk Assessment": "تقييم المخاطر",
  "Training Management": "إدارة التدريب",
  // Blog card link — appears on every blog listing card sitewide.
  "Read more": "اقرأ المزيد",
  "Read More": "اقرأ المزيد",
  // Industries CTA heading — use قطاعك (sector), not عملك (work), per client.
  "Does EHSWatch work for your industry?": "هل يعمل EHSWatch في قطاعك؟",
  // Footer legal links — shared sitewide.
  "Privacy policy": "سياسة الخصوصية",
  "Terms of service": "شروط الخدمة",
  "Cookie policy": "سياسة ملفات تعريف الارتباط",
  // Shared/reused across many pages, same free-API rate-limit non-determinism.
  "Non-Conformance": "عدم المطابقة",
  "Safety insights & best practices": "رؤى وأفضل ممارسات السلامة",
  "See how teams use EHSWatch": "شاهد كيف تستخدم الفرق EHSWatch",
  "View Pricing": "عرض الأسعار",
  "Book Your Free Demo": "احجز عرضك التوضيحي المجاني",
  "View Pricing Plans": "عرض خطط الأسعار",

  // ── /about ──────────────────────────────────────────────────────────────
  "Built to Simplify EHSQ. Designed to Protect": "صُمم لتبسيط EHSQ. وصُمم للحماية",
  "The intelligent EHSQ platform trusted by 25K+ teams worldwide.":
    "منصة EHSQ الذكية التي تثق بها أكثر من 25 ألف فريق حول العالم.",
  "Watch a Demo": "شاهد عرضاً توضيحياً",
  "EHSWatch was founded on a simple belief: safety management should never be more complex than the work it is designed to protect.":
    "تأسست EHSWatch على إيمان بسيط: يجب ألا تكون إدارة السلامة أكثر تعقيداً من العمل الذي صُممت لحمايته.",
  "For years, EHSQ teams have relied on a fragmented mix of spreadsheets, paper forms, shared drives, and disconnected tools to manage risk. The outcome is all too familiar—delayed reporting, missed corrective actions, and compliance gaps that only come to light during audits.":
    "لسنوات، اعتمدت فرق EHSQ على مزيج مجزأ من جداول البيانات والنماذج الورقية والمحركات المشتركة والأدوات غير المترابطة لإدارة المخاطر. والنتيجة مألوفة تماماً: تأخر الإبلاغ، وإجراءات تصحيحية فائتة، وفجوات امتثال لا تظهر إلا أثناء عمليات التدقيق.",
  "EHSWatch was built to change that. It brings every aspect of safety management into one unified, reliable platform, empowering workers, supervisors, and HSE leaders to report incidents, track actions, and drive continuous improvement with clarity and speed.":
    "بُنيت EHSWatch لتغيير ذلك. فهي تجمع كل جوانب إدارة السلامة في منصة واحدة موحدة وموثوقة، تمكّن العمال والمشرفين وقادة الصحة والسلامة من الإبلاغ عن الحوادث وتتبع الإجراءات ودفع التحسين المستمر بوضوح وسرعة.",
  "Today, EHSWatch supports organisations across construction, manufacturing, oil and gas, logistics, and facilities management. By simplifying processes and enabling real-time visibility, it helps teams shift from reactive firefighting to proactive safety, within weeks, not months.":
    "اليوم، تدعم EHSWatch مؤسسات في قطاعات البناء والتصنيع والنفط والغاز والخدمات اللوجستية وإدارة المرافق. ومن خلال تبسيط العمليات وتوفير رؤية لحظية، تساعد الفرق على الانتقال من التعامل التفاعلي مع الأزمات إلى السلامة الاستباقية، خلال أسابيع لا أشهر.",
  "What Drives Us": "ما الذي يحفزنا",
  "Mission": "المهمة",
  "To help organisations simplify EHSQ management with a platform that makes reporting faster, compliance easier and safety performance more visible.":
    "مساعدة المؤسسات على تبسيط إدارة EHSQ من خلال منصة تجعل الإبلاغ أسرع والامتثال أسهل وأداء السلامة أكثر وضوحاً.",
  "Vision": "الرؤية",
  "A world where every organisation has the tools to make safety as instinctive as the work itself.":
    "عالم تمتلك فيه كل مؤسسة الأدوات اللازمة لجعل السلامة غريزية مثل العمل نفسه.",
  "Built for Scale": "مبني للنمو",
  "Years in Industry": "سنوات في الصناعة",
  "Trusted by 25,000+ Users": "موثوق به من قبل أكثر من 25,000 مستخدم",
  "Customer Satisfaction": "رضا العملاء",
  "Reduction in Reporting Time": "تخفيض في وقت الإبلاغ",
  "Ready to See EHSWatch in Action?": "هل أنت مستعد لرؤية EHSWatch عملياً؟",
  "Give your teams a simple way to report, respond, and prevent incidents — all from one platform.":
    "امنح فرقك طريقة بسيطة للإبلاغ والاستجابة ومنع الحوادث — كل ذلك من منصة واحدة.",

  // ── /product ────────────────────────────────────────────────────────────
  "One Platform.": "منصة واحدة.",
  "Every EHSQ Process.": "لكل عملية EHSQ.",
  "From field incidents to board-level dashboards - all connected, all in real time.":
    "من حوادث الميدان إلى لوحات معلومات مجلس الإدارة — كل شيء مترابط، وكل شيء في الوقت الفعلي.",
  "The Platform": "المنصة",
  "Built for EHSQ Teams": "مبنية لفرق EHSQ",
  "EHSWatch is built for EHSQ teams that cannot afford gaps — in reporting, in visibility, or in response. Integrated modules cover every core EHSQ workflow, connected on a single platform that works on any device, online or offline. No integrations to maintain. No data living in separate systems. Just one place where every incident, audit, permit and training record feeds into the same operational picture.":
    "بُنيت EHSWatch لفرق EHSQ التي لا تستطيع تحمّل أي فجوات — في الإبلاغ أو الرؤية أو الاستجابة. تغطي الوحدات المتكاملة كل سير عمل أساسي في EHSQ، مترابطة على منصة واحدة تعمل على أي جهاز، متصلاً أو غير متصل بالإنترنت. لا تكاملات تحتاج صيانة، ولا بيانات موزعة على أنظمة منفصلة. مكان واحد فقط تغذّي فيه كل حادثة وتدقيق وتصريح وسجل تدريب نفس الصورة التشغيلية.",
  "How": "كيف",
  "Works": "تعمل",
  "EHSWatch is designed to make EHSQ management simple for every team member, from the field to the leadership team. Once your forms, workflows and sites are set up, people can start reporting, tracking and resolving safety tasks from any device.":
    "صُممت EHSWatch لجعل إدارة EHSQ بسيطة لكل عضو في الفريق، من الميدان إلى فريق القيادة. بمجرد إعداد النماذج وسير العمل والمواقع، يمكن للأفراد البدء في الإبلاغ عن مهام السلامة وتتبعها وحلها من أي جهاز.",
  "Set up your safety processes": "أعدّ عمليات السلامة لديك",
  "Configure your forms, modules, sites and approval workflows to match how your organisation already operates — without a complex IT setup or external consultants.":
    "قم بتهيئة النماذج والوحدات والمواقع وسير عمل الموافقات لتتوافق مع طريقة عمل مؤسستك الحالية — دون إعداد تقني معقد أو استشاريين خارجيين.",
  "Capture information from the field": "التقط المعلومات من الميدان",
  "Workers, supervisors and safety teams can log incidents, observations, audits or actions directly from their mobile device or desktop. The platform also supports offline reporting. Teams can submit data even in remote locations, and the data syncs automatically when the connectivity is restored.":
    "يمكن للعمال والمشرفين وفرق السلامة تسجيل الحوادث والملاحظات وعمليات التدقيق أو الإجراءات مباشرة من أجهزتهم المحمولة أو أجهزة الكمبيوتر المكتبية. تدعم المنصة أيضاً الإبلاغ دون اتصال بالإنترنت — يمكن للفرق إرسال البيانات حتى في المواقع النائية، وتتم مزامنة البيانات تلقائياً عند استعادة الاتصال.",
  "Route work to the right people": "وجّه العمل إلى الأشخاص المناسبين",
  "Once a report is submitted, EHSWatch automatically assigns it to the relevant person or team. Alerts, reminders and workflows help ensure every issue moves forward without delays or manual follow-up. If actions are not acknowledged or completed within the defined timeframe, the platform automatically escalates to the next responsible person — so nothing stalls silently.":
    "بمجرد إرسال التقرير، تقوم EHSWatch تلقائياً بإسناده إلى الشخص أو الفريق المعني. تساعد التنبيهات والتذكيرات وسير العمل على ضمان تقدم كل مشكلة دون تأخير أو متابعة يدوية. وإذا لم يتم الإقرار بالإجراءات أو إتمامها خلال الإطار الزمني المحدد، تقوم المنصة تلقائياً بتصعيدها إلى الشخص المسؤول التالي — بحيث لا يتوقف شيء بصمت.",
  "Track progress in real time": "تتبّع التقدم في الوقت الفعلي",
  "Managers can monitor open actions, risks and compliance tasks through live dashboards and reports. This provides teams with a clear view of what needs attention, what has been closed, and where recurring issues are emerging across single or multi-site operations.":
    "يمكن للمديرين مراقبة الإجراءات المفتوحة والمخاطر ومهام الامتثال من خلال لوحات معلومات وتقارير مباشرة. يمنح ذلك الفرق رؤية واضحة لما يحتاج إلى اهتمام، وما تم إغلاقه، وأين تظهر المشكلات المتكررة عبر العمليات في موقع واحد أو مواقع متعددة.",
  "Use insights to improve safety": "استخدم الرؤى لتحسين السلامة",
  "EHSWatch surfaces patterns, identifies root causes and flags preventive actions, so safety improvements compound with every report submitted.":
    "تكشف EHSWatch عن الأنماط وتحدد الأسباب الجذرية وتشير إلى الإجراءات الوقائية، بحيث تتراكم تحسينات السلامة مع كل تقرير يُرسل.",
  "Surface Patterns": "كشف الأنماط",
  "Analyse reports to identify what issues occur most frequently.":
    "حلّل التقارير لتحديد المشكلات الأكثر تكراراً.",
  "Identify Root Causes": "تحديد الأسباب الجذرية",
  "Dig deeper into data to uncover the real underlying causes.":
    "تعمّق في البيانات للكشف عن الأسباب الجذرية الحقيقية.",
  "Flag Preventive Actions": "الإشارة إلى الإجراءات الوقائية",
  "Recommend targeted actions before incidents recur.": "أوصِ بإجراءات موجهة قبل تكرار الحوادث.",
  "Safer Workplaces": "أماكن عمل أكثر أماناً",
  "Continuous improvement compounds with every report submitted.":
    "يتراكم التحسين المستمر مع كل تقرير يُرسل.",
  "Our": "وحداتنا",
  "Track corrective and preventive actions to closure with owners, due dates, reminders, and full accountability.":
    "تتبّع الإجراءات التصحيحية والوقائية حتى إغلاقها مع تحديد المسؤولين والمواعيد النهائية والتذكيرات والمساءلة الكاملة.",
  "Manage incidents, accidents, and near misses through reporting, investigation, root cause analysis, and corrective action workflows.":
    "أدر الحوادث والحوادث الوشيكة من خلال الإبلاغ والتحقيق وتحليل السبب الجذري وسير عمل الإجراءات التصحيحية.",
  "Identify hazards, assess risk levels, and document controls in a consistent workflow that supports safer operational decisions.":
    "حدّد المخاطر وقيّم مستوياتها ووثّق الضوابط ضمن سير عمل متسق يدعم قرارات تشغيلية أكثر أماناً.",
  "Report unsafe acts, unsafe conditions, and positive behaviours in real time to strengthen proactive safety reporting across sites.":
    "أبلغ عن التصرفات غير الآمنة والظروف غير الآمنة والسلوكيات الإيجابية في الوقت الفعلي لتعزيز الإبلاغ الاستباقي عن السلامة عبر المواقع.",
  "Plan and run audits with configurable checklists, structured findings, and follow-up workflows that close compliance gaps faster.":
    "خطّط للتدقيقات ونفّذها بقوائم تحقق قابلة للتخصيص ونتائج منظمة وسير عمل متابعة يغلق فجوات الامتثال بشكل أسرع.",
  "Capture, assign, investigate and resolve customer complaints through a structured workflow with full audit trail - supporting ISO 9001 quality management requirements.":
    "سجّل شكاوى العملاء وأسندها وحقّق فيها وحلّها من خلال سير عمل منظم مع سجل تدقيق كامل — بما يدعم متطلبات إدارة الجودة وفق ISO 9001.",
  "View more": "عرض المزيد",
  "Book a Personalised Walkthrough": "احجز جولة توضيحية مخصصة",
  "See exactly how EHSWatch maps to your industry's workflows and compliance requirements.":
    "شاهد بالضبط كيف تتوافق EHSWatch مع سير عمل قطاعك ومتطلبات الامتثال لديك.",

  // ── /industries ─────────────────────────────────────────────────────────
  "Every Industry Has Different Risks Your EHS Platform Should Know the Difference":
    "لكل قطاع مخاطره المختلفة — ويجب أن تدرك منصة EHS لديك الفرق",
  "Across sectors, environment, health, and safety risks look different - EHSWatch adapts to how each industry manages risk — not the other way around. EHSWatch is configured to the compliance requirements, workflows and hazard profiles of your sector - not retrofitted from a generic template.":
    "تختلف مخاطر البيئة والصحة والسلامة باختلاف القطاعات — وتتكيف EHSWatch مع طريقة إدارة كل قطاع لمخاطره، لا العكس. تُهيَّأ EHSWatch وفق متطلبات الامتثال وسير العمل وملامح المخاطر الخاصة بقطاعك — لا أن تُطوَّع من قالب عام جاهز.",
  "EHSWatch: Designed To Work Across Industries": "EHSWatch: مصممة للعمل عبر مختلف القطاعات",
  "Construction & Infrastructure Projects": "مشاريع البناء والبنية التحتية",
  "Manufacturing & Engineering": "التصنيع والهندسة",
  "Oil, Gas & Energy": "النفط والغاز والطاقة",
  "Logistics, Ports & Transport": "الخدمات اللوجستية والموانئ والنقل",
  "Facilities & Property Management": "إدارة المرافق والعقارات",
  "Energy & Utilities": "الطاقة والمرافق العامة",
  "Aviation": "الطيران",
  "Mining & Metals": "التعدين والمعادن",
  "Healthcare & Medical Centres": "الرعاية الصحية والمراكز الطبية",
  "Food & Beverage": "الأغذية والمشروبات",
  "Keep every site safe, compliant and in control, from groundbreak to handover.":
    "حافظ على سلامة كل موقع وامتثاله وسيطرته الكاملة، من بدء الحفر وحتى التسليم.",
  "How EHSWatch Solves Them": "كيف تحل EHSWatch هذه المشكلات",
  "Real-Time Hazard and Near-Miss Reporting": "الإبلاغ الفوري عن المخاطر والحوادث الوشيكة",
  "Field workers and site supervisors can report unsafe conditions, near misses and observations directly from their mobile devices — even offline on remote sites.":
    "يمكن لعمال الميدان ومشرفي الموقع الإبلاغ عن الظروف غير الآمنة والحوادث الوشيكة والملاحظات مباشرة من أجهزتهم المحمولة — حتى دون اتصال بالإنترنت في المواقع النائية.",
  "Digital Permit-to-Work and Site Induction Workflows": "سير عمل رقمي لتصاريح العمل والتأهيل في الموقع",
  "Replace paper-based PTW and induction processes with configurable digital workflows that enforce approval chains, track permit validity, and confirm worker competency before work begins.":
    "استبدل عمليات تصاريح العمل والتأهيل الورقية بسير عمل رقمي قابل للتخصيص يفرض سلاسل الموافقات، ويتتبع صلاحية التصاريح، ويؤكد كفاءة العامل قبل بدء العمل.",
  "Multi-Site Inspection and Audit Management": "إدارة التفتيش والتدقيق عبر مواقع متعددة",
  "Plan and conduct site safety audits, scaffolding inspections, equipment checks and method statement reviews using digital checklists tailored to each project phase.":
    "خطّط لعمليات تدقيق السلامة في الموقع وتفتيش السقالات وفحوصات المعدات ومراجعات بيانات الطريقة ونفّذها باستخدام قوائم تحقق رقمية مصممة لكل مرحلة من مراحل المشروع.",
  "Subcontractor and Workforce Safety Management": "إدارة سلامة المقاولين من الباطن والقوى العاملة",
  "Track training records, competency certifications, induction completion, and permit authorisation for every worker, direct employee or subcontractor, across all sites.":
    "تتبّع سجلات التدريب وشهادات الكفاءة وإتمام التأهيل واعتماد التصاريح لكل عامل، سواء كان موظفاً مباشراً أو مقاولاً من الباطن، عبر جميع المواقع.",
  "Optimal Safety With EHSWatch": "سلامة مثالية مع EHSWatch",

  // ── /iris ───────────────────────────────────────────────────────────────
  "Meet": "تعرّف على",
  "EHSWatch's Intelligent Risk & Insight System": "نظام EHSWatch الذكي للمخاطر والرؤى",
  "Six AI capabilities embedded across your EHSQ workflows.":
    "ست قدرات ذكاء اصطناعي مدمجة عبر سير عمل EHSQ لديك.",
  "Surface risks earlier. Close actions faster. Generate insights in seconds, not days.":
    "اكتشف المخاطر مبكراً. أغلق الإجراءات بسرعة أكبر. أنشئ الرؤى في ثوانٍ لا أيام.",
  "Hazard Intelligence": "ذكاء المخاطر",
  "Chemical exposure": "التعرض الكيميائي",
  "Height work": "العمل في الأماكن المرتفعة",
  "Electrical": "الكهرباء",
  "Predictive Analytics": "التحليلات التنبؤية",
  "Workflow Acceleration": "تسريع سير العمل",
  "Investigation": "التحقيق",
  "Actions closed": "إجراءات مغلقة",
  "Reports filed": "تقارير مقدَّمة",
  "Natural Language Query": "الاستعلام باللغة الطبيعية",
  "Smart Recommendations": "توصيات ذكية",
  "Deploy safety barriers": "نشر حواجز السلامة",
  "Retrain 3 operators": "إعادة تدريب 3 مشغّلين",
  "Update risk register": "تحديث سجل المخاطر",
  "Intelligent Data Synthesis": "تجميع البيانات الذكي",
  "Incidents": "الحوادث",
  "Actions": "الإجراءات",
  "Sites": "المواقع",
  "(Intelligent Risk & Insight System) is EHSWatch's embedded AI layer — built into every workflow your safety team already uses. Six capabilities work together to surface hazards earlier, accelerate incident closure and turn raw safety data into actionable intelligence that used to take days to compile manually.":
    "(نظام المخاطر والرؤى الذكي) هي طبقة الذكاء الاصطناعي المدمجة في EHSWatch — مبنية داخل كل سير عمل يستخدمه فريق السلامة لديك بالفعل. تعمل ست قدرات معاً لاكتشاف المخاطر مبكراً، وتسريع إغلاق الحوادث، وتحويل بيانات السلامة الخام إلى معلومات قابلة للتنفيذ كان تجميعها يدوياً يستغرق أياماً.",
  "doesn't replace your safety team's judgment — it sharpens it.":
    "لا يحل محل تقدير فريق السلامة لديك — بل يصقله.",
  "Why Traditional EHS Systems": "لماذا تخفق أنظمة",
  "Fall Short": "الصحة والسلامة التقليدية",
  "Human attention, manual processes and scattered data create dangerous gaps.":
    "يخلق الانتباه البشري والعمليات اليدوية والبيانات المشتتة فجوات خطيرة.",
  "Attention Constraints": "قيود الانتباه",
  "Human attention constraints miss hazards and hidden patterns in large volumes of data.":
    "تفوّت قيود الانتباه البشري المخاطر والأنماط الخفية في كميات كبيرة من البيانات.",
  "Manual Reporting Friction": "صعوبات الإبلاغ اليدوي",
  "Manual reporting via forms discourages timely incident submissions.":
    "يثبّط الإبلاغ اليدوي عبر النماذج تقديم الحوادث في وقتها.",
  "Surface-Level Investigations": "تحقيقات سطحية",
  "Surface‑level investigations fail to uncover true root causes.":
    "تفشل التحقيقات السطحية في الكشف عن الأسباب الجذرية الحقيقية.",
  "Scattered Incident Records": "سجلات حوادث مشتتة",
  "Scattered incident records make it impossible to detect patterns or similarities across sites and time periods.":
    "تجعل سجلات الحوادث المشتتة من المستحيل اكتشاف الأنماط أو أوجه التشابه عبر المواقع والفترات الزمنية.",
  "Manual Insight Compilation": "تجميع الرؤى يدوياً",
  "Manual data compilation to generate meaningful insights is time‑intensive.":
    "يستغرق تجميع البيانات يدوياً لإنشاء رؤى ذات معنى وقتاً طويلاً.",
  "Reviewer Fatigue": "إرهاق المراجعين",
  "Visual hazards in photos are overlooked due to reviewer fatigue.":
    "يتم تجاهل المخاطر المرئية في الصور بسبب إرهاق المراجعين.",
  "more on the way.": "والمزيد في الطريق.",
  "Each capability targets a real EHS gap. Scroll to see IRIS at work across all six.":
    "تستهدف كل قدرة فجوة حقيقية في EHS. مرّر لرؤية IRIS في العمل عبر القدرات الست.",
  "Text / Voice to Report": "تحويل النص/الصوت إلى تقرير",
  "Converts spoken notes to a complete report instantly.": "يحوّل الملاحظات الصوتية إلى تقرير كامل فوراً.",
  "Key features": "الميزات الرئيسية",
  "Natural language AI; multilingual; auto-fills forms.":
    "ذكاء اصطناعي للغة الطبيعية؛ متعدد اللغات؛ يملأ النماذج تلقائياً.",
  "Benefits": "الفوائد",
  "AI Root Cause Analysis": "تحليل السبب الجذري بالذكاء الاصطناعي",
  "Uncovers systemic causes beyond surface symptoms.": "يكشف الأسباب الجذرية بعيداً عن الأعراض السطحية.",
  "Reduces incident recurrence rate; produces ISO 45001 and OSHA-aligned investigation reports automatically.":
    "يقلل معدل تكرار الحوادث؛ وينشئ تقارير تحقيق متوافقة مع ISO 45001 وOSHA تلقائياً.",
  "AI Insights Generator": "مولّد الرؤى بالذكاء الاصطناعي",
  "Turns data into executive-ready narratives.": "يحوّل البيانات إلى تقارير جاهزة للإدارة التنفيذية.",
  "Auto-aggregates EHS data; plain-language summaries.":
    "يجمّع بيانات EHS تلقائياً؛ ملخصات بلغة واضحة.",
  "Saves 15+ hours per month on report compilation; auto-generates board-ready EHS summaries from live platform data.":
    "يوفر أكثر من 15 ساعة شهرياً في تجميع التقارير؛ وينشئ تلقائياً ملخصات EHS جاهزة لمجلس الإدارة من بيانات المنصة الحية.",
  "EHS AI Assistant · Online": "مساعد EHS الذكي · متصل",
  "Listening…": "يستمع…",
  "*IRIS is AI and can make mistakes. Please double-check responses.":
    "*IRIS نظام ذكاء اصطناعي وقد يرتكب أخطاء. يُرجى التحقق من الردود.",
  "Action Recommendation Engine": "محرك توصية الإجراءات",
  "AI recommends corrective actions based on historical incident patterns.":
    "يوصي الذكاء الاصطناعي بإجراءات تصحيحية بناءً على أنماط الحوادث التاريخية.",
  "Historical pattern matching; prioritised tasks.": "مطابقة الأنماط التاريخية؛ مهام مرتبة حسب الأولوية.",
  "Event Similarity Detector": "كاشف تشابه الأحداث",
  "Detects hidden patterns and connections across all recorded safety events.":
    "يكتشف الأنماط والروابط الخفية عبر جميع أحداث السلامة المسجلة.",
  "Real-time NLP clustering; trend alerts.": "تجميع لحظي بمعالجة اللغة الطبيعية؛ تنبيهات الاتجاهات.",
  "Identifies repeat-pattern risks before they become recordable incidents; supports leading-indicator reporting requirements.":
    "يحدد مخاطر الأنماط المتكررة قبل أن تتحول إلى حوادث مسجَّلة؛ ويدعم متطلبات الإبلاغ بالمؤشرات الاستباقية.",
  "Image Recognition": "التعرف على الصور",
  "Detects hazards and PPE failures in field photos.":
    "يكتشف المخاطر وإخفاقات معدات الحماية الشخصية في صور الميدان.",
  "Auto-annotations; real-time supervisor alerts.": "تعليقات تلقائية؛ تنبيهات فورية للمشرفين.",
  "Put IRIS to Work on Your Safety Data—and See What You've Been Missing.":
    "شغّل IRIS على بيانات السلامة لديك — وشاهد ما كنت تفوّته.",
  "Book AI Demo": "احجز عرضاً توضيحياً للذكاء الاصطناعي",
  "See Pricing": "شاهد الأسعار",

  // ── / (homepage) ────────────────────────────────────────────────────────
  "From Manual Chaos to": "من الفوضى اليدوية",
  "Smart Safety": "إلى السلامة الذكية",
  "Watch Demo": "شاهد العرض التوضيحي",
  "Welcome": "مرحباً",
  "Filter dashboard": "تصفية لوحة المعلومات",
  "Edit Dashboard": "تعديل لوحة المعلومات",
  "Filter by Date": "تصفية حسب التاريخ",
  "Filter by Location": "تصفية حسب الموقع",
  "Offshore": "بحري",
  "Total Incidents": "إجمالي الحوادث",
  "Pending Actions": "إجراءات معلّقة",
  "Total Observations": "إجمالي الملاحظات",
  "Incident Rate": "معدل الحوادث",
  "Incidents by Severity": "الحوادث حسب الخطورة",
  "Actions by Status": "الإجراءات حسب الحالة",
  "Trusted by Teams Across Industries": "موثوق به من فرق في مختلف القطاعات",
  "Data scattered across several platforms": "بيانات مبعثرة عبر عدة منصات",
  "Delayed reporting and follow-up": "تأخر الإبلاغ والمتابعة",
  "Manual Safety Processes Are": "عمليات السلامة اليدوية",
  "Slowing You Down": "تُبطئ تقدمك",
  "Limited visibility into problems": "رؤية محدودة للمشكلات",
  "Reactive compliance checks instead of proactive risk control": "فحوصات امتثال تفاعلية بدلاً من السيطرة الاستباقية على المخاطر",
  "Compliance Reporting": "تقارير الامتثال",
  "Mobile App": "تطبيق الجوال",
  "Unlimited Users": "مستخدمون غير محدودين",
  "Unified Platform": "منصة موحدة",
  "Stay Audit-Ready, Always": "كن جاهزاً للتدقيق دائماً",
  "One-click reports for ISO 9001 / 14001 / 45001 / OSHA — generated from live data, not assembled the night before an audit.":
    "تقارير بنقرة واحدة لمعايير ISO 9001 / 14001 / 45001 / OSHA — مُنشأة من بيانات حية، لا مُجمَّعة في ليلة ما قبل التدقيق.",
  "See Compliance Tools": "شاهد أدوات الامتثال",
  "Meet IRIS: AI That Works for Your": "تعرّف على IRIS: ذكاء اصطناعي يعمل لصالح",
  "Safety Team": "فريق السلامة لديك",
  "Leverage IRIS, our built-in Intelligent Risk & Insight System, to transform raw data into proactive safety leadership. IRIS automates the heavy lifting of data analysis, allowing your team to focus on intervention rather than administration.":
    "استفد من IRIS، نظامنا الذكي المدمج للمخاطر والرؤى، لتحويل البيانات الخام إلى قيادة استباقية للسلامة. يؤتمت IRIS العبء الثقيل لتحليل البيانات، ما يتيح لفريقك التركيز على التدخل بدلاً من الأعمال الإدارية.",
  "AI-Driven Incident Intelligence": "ذكاء الحوادث المدفوع بالذكاء الاصطناعي",
  "Predictive Risk Intelligence": "ذكاء المخاطر التنبؤي",
  "AI Generated Root Cause Analysis": "تحليل السبب الجذري بالذكاء الاصطناعي",
  "Smart Workflow Automation": "أتمتة سير العمل الذكية",
  "Explore AI Modules": "استكشف وحدات الذكاء الاصطناعي",
  "Solutions by industry": "حلول حسب القطاع",
  "Built for High-Risk, High-Activity": "مصممة للقطاعات عالية المخاطر والنشاط",
  "Work Environments": "بيئات العمل",
  "Track hazards and compliance across multiple job sites instantly.":
    "تتبّع المخاطر والامتثال عبر مواقع عمل متعددة فوراً.",
  "Centralise plant audits, equipment safety and worker training logs.":
    "مركزة تدقيقات المصانع وسلامة المعدات وسجلات تدريب العمال.",
  "Permit-to-work, incident reporting and risk control in one place.":
    "تصاريح العمل والإبلاغ عن الحوادث والسيطرة على المخاطر في مكان واحد.",
  "Logistics, Warehousing & Transport": "الخدمات اللوجستية والتخزين والنقل",
  "Track vehicle incidents, warehouse safety and driver compliance.":
    "تتبّع حوادث المركبات وسلامة المستودعات والتزام السائقين.",
  "Manage vendor safety, fire inspections and building maintenance risks.":
    "إدارة سلامة الموردين وتفتيش الحرائق ومخاطر صيانة المباني.",
  "Utilities & Public Services": "المرافق والخدمات العامة",
  "Ensure field worker safety, outage reporting and regulatory compliance.":
    "ضمان سلامة عمال الميدان والإبلاغ عن الانقطاعات والامتثال التنظيمي.",
  "Real Stories from EHSQ Leaders Who Transformed Their Operations with EHSWatch":
    "قصص حقيقية من قادة EHSQ الذين حوّلوا عملياتهم مع EHSWatch",
  "EHSWatch standardised EHS processes across our 12 companies, eliminated paper workflows, and gave us real-time visibility with exceptionally clear dashboards and a fast, reliable mobile app.":
    "وحّدت EHSWatch عمليات الصحة والسلامة والبيئة عبر شركاتنا الاثنتي عشرة، وأزالت سير العمل الورقي، ومنحتنا رؤية لحظية بلوحات معلومات واضحة للغاية وتطبيق جوال سريع وموثوق.",
  "We use EHSWatch for daily observations and inspections. It meets our expectations across many features, and the training metrics are especially valuable for tracking expiries and active courses.":
    "نستخدم EHSWatch للملاحظات والتفتيشات اليومية. تلبي توقعاتنا في العديد من الميزات، ومقاييس التدريب مفيدة بشكل خاص لتتبع تواريخ الانتهاء والدورات النشطة.",
  "We use EHSWatch to manage inspections, report observations and track incidents. Real-time corrective action reporting lets us assign tasks immediately from site, ensuring nothing is missed.":
    "نستخدم EHSWatch لإدارة التفتيشات والإبلاغ عن الملاحظات وتتبع الحوادث. يتيح لنا الإبلاغ الفوري عن الإجراءات التصحيحية إسناد المهام مباشرة من الموقع، بما يضمن عدم تفويت أي شيء.",
  "EHSWatch is far more efficient than other tools we've used. It saves time, reduces paperwork and ensures a faster, more reliable way of working.":
    "تتفوق EHSWatch بكفاءتها على الأدوات الأخرى التي استخدمناها. توفر الوقت وتقلل الأعمال الورقية وتضمن طريقة عمل أسرع وأكثر موثوقية.",
  "We customised EHSWatch to match our needs and can extract data from anywhere, at any time. Regular updates help maintain smooth operations.":
    "خصّصنا EHSWatch لتناسب احتياجاتنا، ويمكننا استخراج البيانات من أي مكان وفي أي وقت. تساعد التحديثات المنتظمة في الحفاظ على سلاسة العمليات.",
  "EHSWatch gives us a single platform for incidents, observations, audits, file management and inspections. Automated workflows and real-time dashboards speed up corrective-action tracking, and the mobile app makes field reporting simple.":
    "تمنحنا EHSWatch منصة واحدة للحوادث والملاحظات والتدقيقات وإدارة الملفات والتفتيشات. يسرّع سير العمل الآلي ولوحات المعلومات اللحظية تتبع الإجراءات التصحيحية، ويجعل تطبيق الجوال الإبلاغ الميداني بسيطاً.",
  "EHSWatch gives us a single, well-organised platform for reporting, tracking and resolving safety issues. It streamlines workflows, improves transparency and enhances communication among teams.":
    "تمنحنا EHSWatch منصة واحدة منظمة جيداً للإبلاغ عن قضايا السلامة وتتبعها وحلها. تبسّط سير العمل وتحسّن الشفافية وتعزز التواصل بين الفرق.",
  "EHSWatch is well structured and easy to follow. It simplifies monthly and yearly data summaries and progress tracking.":
    "EHSWatch منظمة جيداً وسهلة المتابعة. تبسّط ملخصات البيانات الشهرية والسنوية وتتبع التقدم.",
  "EHSWatch is customisable to our business needs, easy to navigate and user-friendly.":
    "EHSWatch قابلة للتخصيص وفق احتياجات أعمالنا، وسهلة التصفح وسهلة الاستخدام.",
  "Latest Insights on EHS & Quality": "أحدث الرؤى حول الصحة والسلامة والبيئة والجودة",
  "View All Articles": "عرض جميع المقالات",
  "Give your teams a simple way to report, respond and prevent incidents – without adding more admins.":
    "امنح فرقك طريقة بسيطة للإبلاغ والاستجابة ومنع الحوادث — دون إضافة المزيد من الإداريين.",

  // ── /privacy-policy — legal text, translated at the client's explicit request.
  // Machine-quality Arabic (same process as the rest of the site); recommend a
  // legal/compliance review before treating this as the binding translation.
  "Privacy Policy": "سياسة الخصوصية",
  "Last Updated:": "آخر تحديث:",
  "Welcome to EHSWatch. This Privacy Policy explains how Exceego Infolabs Inc. (“EHSWatch,” “we,” “us,” or “our”) collects, uses, discloses and protects information when you visit our website at":
    "مرحباً بك في EHSWatch. توضح سياسة الخصوصية هذه كيفية قيام شركة Exceego Infolabs Inc. (\"EHSWatch\" أو \"نحن\" أو \"لنا\") بجمع المعلومات واستخدامها والإفصاح عنها وحمايتها عند زيارتك لموقعنا الإلكتروني على",
  "(the “Site”), use our mobile application (the “App”), or otherwise use our AI-powered EHSQ (Environmental, Health, Safety and Quality) SaaS platform and related services (collectively, the “Services”).":
    "(\"الموقع\")، أو استخدامك لتطبيقنا للجوال (\"التطبيق\")، أو استخدامك بأي شكل آخر لمنصتنا SaaS للصحة والسلامة والبيئة والجودة (EHSQ) المدعومة بالذكاء الاصطناعي والخدمات المرتبطة بها (يُشار إليها مجتمعة بـ \"الخدمات\").",
  "By accessing or using the Site, App, or Services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our practices, please do not use the Services.":
    "من خلال الوصول إلى الموقع أو التطبيق أو الخدمات أو استخدامها، فإنك تقر بأنك قد قرأت سياسة الخصوصية هذه وفهمتها. إذا كنت لا توافق على ممارساتنا، فيُرجى عدم استخدام الخدمات.",
  "1. Information We Collect": "1. المعلومات التي نجمعها",
  "We may collect the following categories of information:": "قد نجمع الفئات التالية من المعلومات:",
  "a) Information you provide directly": "أ) المعلومات التي تقدمها مباشرة",
  "Contact details (name, email address, phone number, job title, company name) submitted through our “Request Demo” or “Contact Us” forms.":
    "بيانات التواصل (الاسم، البريد الإلكتروني، رقم الهاتف، المسمى الوظيفي، اسم الشركة) المقدَّمة عبر نموذجي \"طلب عرض توضيحي\" أو \"اتصل بنا\".",
  "Account and login credentials when you or your organisation registers for the EHSWatch platform.":
    "بيانات الحساب وتسجيل الدخول عند تسجيلك أو تسجيل مؤسستك في منصة EHSWatch.",
  "Content you submit through the platform, including incident reports, inspection data, audit records, risk assessments, complaints, and other EHSQ-related data (“Customer Data”).":
    "المحتوى الذي ترسله عبر المنصة، بما في ذلك تقارير الحوادث وبيانات التفتيش وسجلات التدقيق وتقييمات المخاطر والشكاوى وغيرها من بيانات EHSQ (\"بيانات العميل\").",
  "Communications you send us, including reports submitted via WhatsApp integration, emails, or support tickets.":
    "المراسلات التي ترسلها إلينا، بما في ذلك التقارير المرسلة عبر تكامل واتساب أو البريد الإلكتروني أو تذاكر الدعم.",
  "b) Information collected automatically": "ب) المعلومات التي تُجمع تلقائياً",
  "Device and usage information, such as IP address, browser type, operating system, pages visited, and time spent on the Site or App.":
    "معلومات الجهاز والاستخدام، مثل عنوان IP ونوع المتصفح ونظام التشغيل والصفحات التي تمت زيارتها والوقت الذي قضيته على الموقع أو التطبيق.",
  "Cookies and similar tracking technologies (see our [Cookie Policy] for details).":
    "ملفات تعريف الارتباط وتقنيات التتبع المماثلة (راجع [سياسة ملفات تعريف الارتباط] الخاصة بنا للتفاصيل).",
  "Location data, where enabled on the mobile App, to support features such as incident geo-tagging.":
    "بيانات الموقع الجغرافي، عند تفعيلها في تطبيق الجوال، لدعم ميزات مثل وضع علامات جغرافية على الحوادث.",
  "c) Information from third parties": "ج) المعلومات من أطراف ثالثة",
  "Information from your employer or organisation if they have set up your account to use the Services.":
    "معلومات من جهة عملك أو مؤسستك إذا كانت قد أنشأت حسابك لاستخدام الخدمات.",
  "Information from app stores (Apple App Store, Google Play Store) related to app downloads and performance, subject to their respective privacy practices.":
    "معلومات من متاجر التطبيقات (Apple App Store وGoogle Play Store) متعلقة بتنزيلات التطبيق وأدائه، وفقاً لممارسات الخصوصية الخاصة بكل منها.",
  "2. How We Use Your Information": "2. كيف نستخدم معلوماتك",
  "We use the information we collect to:": "نستخدم المعلومات التي نجمعها من أجل:",
  "Provide, operate, and maintain the Services, including workflow automation, dashboards, analytics and reporting features.":
    "تقديم الخدمات وتشغيلها وصيانتها، بما في ذلك أتمتة سير العمل ولوحات المعلومات والتحليلات وميزات التقارير.",
  "Process and respond to demo requests, inquiries, and support tickets.":
    "معالجة طلبات العروض التوضيحية والاستفسارات وتذاكر الدعم والرد عليها.",
  "Communicate with you about updates, new features, and service-related notices.":
    "التواصل معك بشأن التحديثات والميزات الجديدة والإشعارات المتعلقة بالخدمة.",
  "Improve and personalise the Services, including customisable dashboards and configurable forms.":
    "تحسين الخدمات وتخصيصها، بما في ذلك لوحات المعلومات القابلة للتخصيص والنماذج القابلة للتهيئة.",
  "Monitor for security, fraud prevention, and to maintain the integrity of the platform.":
    "المراقبة لأغراض الأمن ومنع الاحتيال والحفاظ على سلامة المنصة.",
  "Comply with legal obligations and enforce our Terms of Service.":
    "الامتثال للالتزامات القانونية وإنفاذ شروط الخدمة الخاصة بنا.",
  "Send marketing communications, where permitted, and in accordance with your preferences.":
    "إرسال رسائل تسويقية، حيثما يُسمح بذلك، ووفقاً لتفضيلاتك.",
  "3. Customer Data": "3. بيانات العميل",
  "Where your organisation uses EHSWatch to manage EHSQ processes, EHSWatch acts as a data processor on behalf of your organisation (the data controller) with respect to Customer Data entered into the platform (such as incident reports, audit findings, or employee safety records). We process this data only in accordance with our agreement with your organisation and its instructions, and we do not use Customer Data for our own independent purposes, except as necessary to provide, support, and improve the Services.":
    "عندما تستخدم مؤسستك EHSWatch لإدارة عمليات EHSQ، تعمل EHSWatch كمعالِج بيانات نيابة عن مؤسستك (المتحكم بالبيانات) فيما يتعلق ببيانات العميل المُدخلة في المنصة (مثل تقارير الحوادث ونتائج التدقيق أو سجلات سلامة الموظفين). نقوم بمعالجة هذه البيانات فقط وفقاً لاتفاقيتنا مع مؤسستك وتعليماتها، ولا نستخدم بيانات العميل لأغراضنا المستقلة الخاصة، إلا بالقدر اللازم لتقديم الخدمات ودعمها وتحسينها.",
  "If you are an individual whose information has been entered into the platform by your employer or another organisation (for example, as part of an incident report), please direct any requests regarding that data to your organisation, who can then contact us on your behalf.":
    "إذا كنت فرداً أُدخلت معلوماته في المنصة من قِبل جهة عملك أو مؤسسة أخرى (على سبيل المثال، كجزء من تقرير حادثة)، يُرجى توجيه أي طلبات متعلقة بتلك البيانات إلى مؤسستك، التي يمكنها بعد ذلك التواصل معنا نيابة عنك.",
  "4. How We Share Information": "4. كيف نشارك المعلومات",
  "We do not sell personal information. We may share information in the following circumstances:":
    "لا نبيع المعلومات الشخصية. قد نشارك المعلومات في الحالات التالية:",
  "Service providers": "مقدمو الخدمات",
  ": With third-party vendors who perform services on our behalf, such as cloud hosting, analytics, customer support tools, and payment processing, and who are contractually bound to protect your information.":
    ": مع بائعين من أطراف ثالثة يؤدون خدمات نيابة عنا، مثل الاستضافة السحابية والتحليلات وأدوات دعم العملاء ومعالجة المدفوعات، وهم ملزمون تعاقدياً بحماية معلوماتك.",
  "Business transfers": "عمليات نقل الأعمال",
  ": In connection with a merger, acquisition, financing, or sale of assets, subject to standard confidentiality protections.":
    ": فيما يتعلق بعملية اندماج أو استحواذ أو تمويل أو بيع أصول، وفقاً لضمانات السرية المعتادة.",
  "Legal requirements": "المتطلبات القانونية",
  ": Where required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of EHSWatch, our users, or others.":
    ": حيثما يقتضي ذلك القانون أو اللوائح أو الإجراءات القانونية أو طلب حكومي، أو لحماية حقوق EHSWatch أو ممتلكاتها أو سلامتها أو سلامة مستخدمينا أو الآخرين.",
  "With your consent": "بموافقتك",
  ": In any other circumstance, with your explicit consent.": ": في أي حالة أخرى، بموافقتك الصريحة.",
  "5. Data Security": "5. أمن البيانات",
  "We implement administrative, technical, and physical safeguards designed to protect information from unauthorised access, disclosure, alteration, or destruction. Access to sensitive customer information within the platform is governed by configurable permissions, allowing organisations to control which users can view or edit specific data. While we take reasonable steps to protect your information, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.":
    "نطبّق ضمانات إدارية وتقنية ومادية مصممة لحماية المعلومات من الوصول غير المصرح به أو الإفصاح أو التعديل أو الإتلاف. يخضع الوصول إلى معلومات العملاء الحساسة داخل المنصة لأذونات قابلة للتهيئة، تتيح للمؤسسات التحكم في المستخدمين المخوَّلين بعرض بيانات معينة أو تعديلها. وبينما نتخذ خطوات معقولة لحماية معلوماتك، لا توجد طريقة نقل أو تخزين آمنة بشكل كامل، ولا يمكننا ضمان أمان مطلق.",
  "6. Data Retention": "6. الاحتفاظ بالبيانات",
  "We retain personal information and Customer Data for as long as necessary to provide the Services, comply with our legal obligations, resolve disputes, and enforce our agreements. Retention periods for Customer Data are generally governed by the agreement between EHSWatch and the relevant customer organisation.":
    "نحتفظ بالمعلومات الشخصية وبيانات العميل للمدة اللازمة لتقديم الخدمات والامتثال لالتزاماتنا القانونية وحل النزاعات وإنفاذ اتفاقياتنا. تخضع فترات الاحتفاظ ببيانات العميل بشكل عام للاتفاقية المبرمة بين EHSWatch والمؤسسة العميلة المعنية.",
  "7. International Data Transfers": "7. عمليات نقل البيانات الدولية",
  "EHSWatch operates from offices in the United States (West Hills, California) and India (Hyderabad, Telangana), and serves customers across multiple regions, including the GCC. As a result, your information may be transferred to, stored, and processed in countries other than your country of residence. Where required, we implement appropriate safeguards for such transfers in accordance with applicable data protection laws.":
    "تعمل EHSWatch من مكاتب في الولايات المتحدة (وست هيلز، كاليفورنيا) والهند (حيدر أباد، تلانجانا)، وتخدم عملاء في مناطق متعددة، بما في ذلك دول مجلس التعاون الخليجي. ونتيجة لذلك، قد يتم نقل معلوماتك وتخزينها ومعالجتها في دول غير دولة إقامتك. وحيثما يقتضي الأمر، نطبّق ضمانات مناسبة لعمليات النقل هذه وفقاً لقوانين حماية البيانات المعمول بها.",
  "8. Your Rights": "8. حقوقك",
  "Depending on your location and applicable law, you may have the right to:":
    "بحسب موقعك والقانون المعمول به، قد يكون لديك الحق في:",
  "Access the personal information we hold about you.": "الوصول إلى المعلومات الشخصية التي نحتفظ بها عنك.",
  "Request correction of inaccurate information.": "طلب تصحيح المعلومات غير الدقيقة.",
  "Request deletion of your personal information, subject to legal and contractual retention requirements.":
    "طلب حذف معلوماتك الشخصية، وفقاً لمتطلبات الاحتفاظ القانونية والتعاقدية.",
  "Object to or restrict certain processing activities.": "الاعتراض على أنشطة معالجة معينة أو تقييدها.",
  "Withdraw consent, where processing is based on consent.":
    "سحب الموافقة، عندما تكون المعالجة قائمة على الموافقة.",
  "To exercise any of these rights, please contact us at": "لممارسة أي من هذه الحقوق، يُرجى التواصل معنا على",
  ". If your data was submitted by your employer as part of Customer Data, we may direct your request to that organisation.":
    ". إذا كانت بياناتك قد قُدمت من قِبل جهة عملك كجزء من بيانات العميل، فقد نوجّه طلبك إلى تلك المؤسسة.",
  "9. Children’s Privacy": "9. خصوصية الأطفال",
  "The Services are not directed to, and are not intended for use by, children under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected such information, we will take steps to delete it.":
    "لا تستهدف الخدمات، ولا يُقصد استخدامها من قِبل، الأطفال دون سن 16 عاماً. نحن لا نجمع معلومات شخصية من الأطفال عن علم. وإذا علمنا أننا جمعنا هذه المعلومات عن غير قصد، فسنتخذ خطوات لحذفها.",
  "10. Third-Party Links": "10. روابط الأطراف الثالثة",
  "The Site and Services may contain links to third-party websites or integrations (including WhatsApp). We are not responsible for the privacy practices or content of these third parties. We encourage you to review their privacy policies before providing any information.":
    "قد يحتوي الموقع والخدمات على روابط لمواقع إلكترونية أو تكاملات لأطراف ثالثة (بما في ذلك واتساب). نحن لسنا مسؤولين عن ممارسات الخصوصية أو محتوى هذه الأطراف الثالثة. نشجعك على مراجعة سياسات الخصوصية الخاصة بها قبل تقديم أي معلومات.",
  "11. Changes to This Privacy Policy": "11. التغييرات على سياسة الخصوصية هذه",
  "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will post the revised policy on this page with an updated “Last Updated” date. Your continued use of the Services after such changes constitutes your acceptance of the revised policy.":
    "قد نحدّث سياسة الخصوصية هذه من وقت لآخر لتعكس تغييرات في ممارساتنا أو لأسباب قانونية أو تشغيلية أو تنظيمية. سننشر السياسة المُحدَّثة على هذه الصفحة مع تاريخ \"آخر تحديث\" جديد. استمرارك في استخدام الخدمات بعد هذه التغييرات يشكّل قبولاً منك للسياسة المُحدَّثة.",
  "12. Contact Us": "12. اتصل بنا",
  "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:":
    "إذا كانت لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه أو ممارساتنا المتعلقة بالبيانات، يُرجى التواصل معنا على:",
  "Exceego Infolab Inc. (EHSWatch)": "شركة Exceego Infolab Inc. (EHSWatch)",
  "Email:": "البريد الإلكتروني:",
  "Working Hours: Monday to Friday, 9:00 AM – 5:30 PM": "ساعات العمل: من الاثنين إلى الجمعة، 9:00 صباحاً – 5:30 مساءً",
  "Offices:": "المكاتب:",

  // ── /terms-of-service — legal text, same translated-at-request basis as
  // Privacy Policy above; recommend legal review before treating as binding.
  "Terms of Service": "شروط الخدمة",
  "Welcome to EHSWatch. These Terms of Service (“Terms”) govern your access to and use of the website":
    "مرحباً بك في EHSWatch. تحكم شروط الخدمة هذه (\"الشروط\") وصولك إلى الموقع الإلكتروني واستخدامك له",
  "(the “Site”), our mobile application (the “App”), and our AI-powered EHSQ SaaS platform and related services (collectively, the “Services”), provided by Exceego Infolab Inc. (“EHSWatch,” “we,” “us,” or “our”).":
    "(\"الموقع\")، وتطبيقنا للجوال (\"التطبيق\")، ومنصتنا SaaS للصحة والسلامة والبيئة والجودة المدعومة بالذكاء الاصطناعي والخدمات المرتبطة بها (يُشار إليها مجتمعة بـ \"الخدمات\")، المقدَّمة من شركة Exceego Infolab Inc. (\"EHSWatch\" أو \"نحن\" أو \"لنا\").",
  "By accessing or using the Site, App, or Services, you agree to be bound by these Terms and confirm that you have read and understood our Privacy Policy, which is incorporated by reference. If you do not agree to these Terms, please do not access or use the Services.":
    "من خلال الوصول إلى الموقع أو التطبيق أو الخدمات أو استخدامها، فإنك توافق على الالتزام بهذه الشروط وتؤكد أنك قد قرأت سياسة الخصوصية الخاصة بنا وفهمتها، وهي مُدرجة هنا بالإشارة. إذا كنت لا توافق على هذه الشروط، فيُرجى عدم الوصول إلى الخدمات أو استخدامها.",
  "1. Eligibility and Accounts": "1. الأهلية والحسابات",
  "To use the Services, you must be authorised by your organisation to do so, or otherwise have the legal capacity to enter into a binding agreement. If you are creating an account on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.":
    "لاستخدام الخدمات، يجب أن تكون مخوَّلاً من قِبل مؤسستك للقيام بذلك، أو أن تتمتع بالأهلية القانونية لإبرام اتفاقية ملزمة. إذا كنت تُنشئ حساباً نيابة عن مؤسسة، فإنك تقر بأن لديك الصلاحية لإلزام تلك المؤسسة بهذه الشروط.",
  "You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Please notify us immediately at":
    "أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك وعن جميع الأنشطة التي تتم من خلال حسابك. يُرجى إخطارنا فوراً على",
  "if you become aware of any unauthorised use of your account.": "إذا علمت بأي استخدام غير مصرح به لحسابك.",
  "2. Description of Services": "2. وصف الخدمات",
  "EHSWatch provides a SaaS platform designed to help organisations manage Environmental, Health, Safety and Quality (EHSQ) processes, including but not limited to Action Tracker, Audit Management, Communications, Customer Complaints, Emergency Drills, File Management, HSE Monthly Statistics, HSE Plans, Incident Management, Inspection Management, Legal Register, Mutual Aid, Non-Conformance, Observations, Risk Assessment, and Surveys, accessible via web and mobile applications, including reporting functionality via WhatsApp.":
    "تقدم EHSWatch منصة SaaS مصممة لمساعدة المؤسسات على إدارة عمليات الصحة والسلامة والبيئة والجودة (EHSQ)، بما في ذلك على سبيل المثال لا الحصر متتبع الإجراءات، وإدارة التدقيق، والاتصالات، وشكاوى العملاء، وتدريبات الطوارئ، وإدارة الملفات، والإحصاءات الشهرية للصحة والسلامة، وخطط الصحة والسلامة، وإدارة الحوادث، وإدارة التفتيش، والسجل القانوني، والمساعدة المتبادلة، وعدم المطابقة، والملاحظات، وتقييم المخاطر، والاستبيانات، ويمكن الوصول إليها عبر تطبيقات الويب والجوال، بما في ذلك وظيفة الإبلاغ عبر واتساب.",
  "We may add, modify, suspend, or discontinue any part of the Services at our discretion, with reasonable notice where practicable, particularly for material changes affecting active customer agreements.":
    "يجوز لنا إضافة أي جزء من الخدمات أو تعديله أو تعليقه أو إيقافه وفق تقديرنا، مع إشعار معقول حيثما أمكن ذلك عملياً، خاصة فيما يتعلق بالتغييرات الجوهرية التي تؤثر على اتفاقيات العملاء النشطة.",
  "3. Customer Data and Ownership": "3. بيانات العميل والملكية",
  "As between EHSWatch and the customer organisation, the customer retains all rights, title, and interest in and to the data it submits or generates through the Services (“Customer Data”), including incident reports, audit records, risk assessments, and related documentation.":
    "فيما بين EHSWatch والمؤسسة العميلة، يحتفظ العميل بجميع الحقوق والملكية والمصلحة في البيانات التي يقدمها أو ينشئها من خلال الخدمات (\"بيانات العميل\")، بما في ذلك تقارير الحوادث وسجلات التدقيق وتقييمات المخاطر والوثائق ذات الصلة.",
  "EHSWatch is granted a limited licence to access, use, process, and store Customer Data solely for the purpose of providing, maintaining, supporting, and improving the Services, in accordance with our Privacy Policy and any applicable customer agreement.":
    "تُمنح EHSWatch ترخيصاً محدوداً للوصول إلى بيانات العميل واستخدامها ومعالجتها وتخزينها، لغرض تقديم الخدمات وصيانتها ودعمها وتحسينها فقط، وفقاً لسياسة الخصوصية الخاصة بنا وأي اتفاقية عميل معمول بها.",
  "4. Acceptable Use": "4. الاستخدام المقبول",
  "You agree not to:": "توافق على عدم القيام بما يلي:",
  "Use the Services for any unlawful purpose or in violation of any applicable regulation.":
    "استخدام الخدمات لأي غرض غير قانوني أو بما يخالف أي لائحة معمول بها.",
  "Attempt to gain unauthorised access to the Services, other accounts, or our systems and networks.":
    "محاولة الوصول غير المصرح به إلى الخدمات أو حسابات أخرى أو أنظمتنا وشبكاتنا.",
  "Interfere with or disrupt the integrity or performance of the Services.":
    "التدخل في سلامة الخدمات أو أدائها أو تعطيلهما.",
  "Upload or transmit any content that is unlawful, defamatory, or infringes on the rights of any third party.":
    "تحميل أو نقل أي محتوى غير قانوني أو تشهيري أو ينتهك حقوق أي طرف ثالث.",
  "Reverse engineer, decompile, or attempt to extract the source code of the Services, except as permitted by law.":
    "إجراء هندسة عكسية أو تفكيك أو محاولة استخراج الشيفرة المصدرية للخدمات، إلا بالقدر الذي يسمح به القانون.",
  "Use automated means (bots, scrapers) to access the Services without our prior written consent.":
    "استخدام وسائل آلية (برامج آلية أو أدوات جمع بيانات) للوصول إلى الخدمات دون موافقتنا الخطية المسبقة.",
  "We reserve the right to suspend or terminate access for any user found to be in violation of these Terms.":
    "نحتفظ بالحق في تعليق أو إنهاء وصول أي مستخدم يثبت مخالفته لهذه الشروط.",
  "5. Subscription, Fees, and Payment": "5. الاشتراك والرسوم والدفع",
  "Access to certain features of the Services may require a paid subscription, governed by a separate order form or agreement between EHSWatch and the customer organisation. Fees, billing cycles, and payment terms will be set out in that agreement. Failure to make timely payment may result in suspension or termination of access to the Services, subject to the terms of the applicable agreement.":
    "قد يتطلب الوصول إلى ميزات معينة من الخدمات اشتراكاً مدفوعاً، يخضع لنموذج طلب أو اتفاقية منفصلة بين EHSWatch والمؤسسة العميلة. سيتم تحديد الرسوم ودورات الفوترة وشروط الدفع في تلك الاتفاقية. قد يؤدي عدم السداد في الوقت المحدد إلى تعليق أو إنهاء الوصول إلى الخدمات، وفقاً لشروط الاتفاقية المعمول بها.",
  "6. Intellectual Property": "6. الملكية الفكرية",
  "The Services, including all software, designs, text, graphics, logos, and other content (excluding Customer Data), are the property of EHSWatch or its licensors and are protected by intellectual property laws. Nothing in these Terms grants you any right, title, or interest in the Services, other than the limited right to use the Services as expressly permitted herein.":
    "الخدمات، بما في ذلك جميع البرمجيات والتصاميم والنصوص والرسومات والشعارات والمحتوى الآخر (باستثناء بيانات العميل)، هي ملك لشركة EHSWatch أو الجهات المرخِّصة لها، وهي محمية بموجب قوانين الملكية الفكرية. لا يمنحك أي شيء في هذه الشروط أي حق أو ملكية أو مصلحة في الخدمات، بخلاف الحق المحدود في استخدام الخدمات وفق المسموح به صراحةً هنا.",
  "7. Third-Party Links and Integrations": "7. روابط وتكاملات الأطراف الثالثة",
  "The Services may contain links to, or integrations with, third-party websites or platforms (including WhatsApp). EHSWatch does not control or endorse these third parties and is not responsible for their content, products, services, or privacy practices. Your use of any third-party services is at your own risk and subject to their respective terms.":
    "قد تحتوي الخدمات على روابط لمواقع أو منصات أطراف ثالثة أو تكاملات معها (بما في ذلك واتساب). لا تتحكم EHSWatch في هذه الأطراف الثالثة ولا تؤيدها، وهي غير مسؤولة عن محتواها أو منتجاتها أو خدماتها أو ممارسات الخصوصية الخاصة بها. استخدامك لأي خدمات لأطراف ثالثة يكون على مسؤوليتك الخاصة ويخضع لشروطها الخاصة.",
  "8. Disclaimers": "8. إخلاء المسؤولية",
  "The Services are provided on an “as is” and “as available” basis, without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. EHSWatch does not warrant that the Services will be uninterrupted, error-free, or completely secure.":
    "تُقدَّم الخدمات \"كما هي\" و\"وفق توافرها\"، دون أي ضمانات من أي نوع، صريحة كانت أم ضمنية، بما في ذلك على سبيل المثال لا الحصر ضمانات القابلية للتسويق والملاءمة لغرض معين وعدم الانتهاك. لا تضمن EHSWatch أن تكون الخدمات متواصلة دون انقطاع أو خالية من الأخطاء أو آمنة تماماً.",
  "EHSWatch’s Services are designed to support EHSQ management and compliance monitoring, but they do not replace an organisation’s own legal or regulatory compliance obligations, professional judgment, or on-the-ground safety procedures.":
    "صُممت خدمات EHSWatch لدعم إدارة EHSQ ومراقبة الامتثال، لكنها لا تحل محل التزامات المؤسسة القانونية أو التنظيمية الخاصة بها، أو تقديرها المهني، أو إجراءات السلامة الميدانية.",
  "9. Limitation of Liability": "9. حدود المسؤولية",
  "To the maximum extent permitted by applicable law, EHSWatch and its officers, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or business opportunities, arising from or related to your use of, or inability to use, the Services, even if advised of the possibility of such damages.":
    "إلى أقصى حد يسمح به القانون المعمول به، لن تكون EHSWatch ومسؤولوها وموظفوها والشركات التابعة لها مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو تأديبية، أو أي خسارة في الأرباح أو البيانات أو الفرص التجارية، ناشئة عن أو متعلقة باستخدامك للخدمات أو عدم قدرتك على استخدامها، حتى لو تم إخطارنا بإمكانية حدوث هذه الأضرار.",
  "Nothing in these Terms limits liability for matters that cannot be limited or excluded under applicable law.":
    "لا يحد أي شيء في هذه الشروط من المسؤولية عن أمور لا يمكن تحديدها أو استبعادها بموجب القانون المعمول به.",
  "10. Indemnification": "10. التعويض",
  "You agree to indemnify and hold harmless EHSWatch and its officers, employees, and affiliates from any claims, damages, liabilities, and expenses (including reasonable legal fees) arising from your breach of these Terms, misuse of the Services, or violation of any applicable law or third-party right.":
    "توافق على تعويض EHSWatch ومسؤوليها وموظفيها والشركات التابعة لها وإبرائهم من أي مطالبات أو أضرار أو التزامات أو نفقات (بما في ذلك أتعاب المحاماة المعقولة) ناشئة عن مخالفتك لهذه الشروط، أو إساءة استخدام الخدمات، أو انتهاك أي قانون معمول به أو حق لطرف ثالث.",
  "11. Termination": "11. الإنهاء",
  "We may suspend or terminate your access to the Services at any time, with or without notice, for conduct that violates these Terms or is otherwise harmful to other users, us, or third parties. Customer organisations may terminate their subscription in accordance with the terms of their specific agreement with EHSWatch.":
    "يجوز لنا تعليق أو إنهاء وصولك إلى الخدمات في أي وقت، بإشعار أو دونه، بسبب سلوك يخالف هذه الشروط أو يضر بمستخدمين آخرين أو بنا أو بأطراف ثالثة. يجوز للمؤسسات العميلة إنهاء اشتراكها وفقاً لشروط اتفاقيتها الخاصة مع EHSWatch.",
  "12. Governing Law and Dispute Resolution": "12. القانون الحاكم وتسوية النزاعات",
  "[Insert governing law and jurisdiction — e.g., laws of the State of California, USA, or as otherwise agreed with the relevant customer organisation, particularly for GCC-based customers where local law may apply.]":
    "[أدرج القانون الحاكم والاختصاص القضائي — على سبيل المثال، قوانين ولاية كاليفورنيا بالولايات المتحدة، أو حسبما يُتفق عليه مع المؤسسة العميلة المعنية، خاصة للعملاء في دول مجلس التعاون الخليجي حيث قد يُطبَّق القانون المحلي.]",
  "13. Changes to These Terms": "13. التغييرات على هذه الشروط",
  "We may revise these Terms from time to time. We will post the updated Terms on this page with a revised “Last Updated” date. Your continued use of the Services after such changes constitutes your acceptance of the updated Terms.":
    "يجوز لنا مراجعة هذه الشروط من وقت لآخر. سننشر الشروط المُحدَّثة على هذه الصفحة مع تاريخ \"آخر تحديث\" جديد. استمرارك في استخدام الخدمات بعد هذه التغييرات يشكّل قبولاً منك للشروط المُحدَّثة.",
  "14. Contact Us": "14. اتصل بنا",
  "If you have any questions about these Terms, please contact us at:":
    "إذا كانت لديك أي أسئلة بشأن هذه الشروط، يُرجى التواصل معنا على:",

  // ── /cookie-policy — legal text, same translated-at-request basis as
  // Privacy Policy above; recommend legal review before treating as binding.
  "Cookie Policy": "سياسة ملفات تعريف الارتباط",
  "This Cookie Policy explains how Exceego Infolab Inc. (“EHSWatch,” “we,” “us,” or “our”) uses cookies and similar tracking technologies on our website":
    "توضح سياسة ملفات تعريف الارتباط هذه كيفية استخدام شركة Exceego Infolab Inc. (\"EHSWatch\" أو \"نحن\" أو \"لنا\") لملفات تعريف الارتباط وتقنيات التتبع المماثلة على موقعنا الإلكتروني",
  "(the “Site”) and related services. This policy should be read alongside our Privacy Policy.":
    "(\"الموقع\") والخدمات المرتبطة به. ينبغي قراءة هذه السياسة إلى جانب سياسة الخصوصية الخاصة بنا.",
  "1. What Are Cookies?": "1. ما هي ملفات تعريف الارتباط؟",
  "Cookies are small text files placed on your computer or mobile device when you visit a website. They are widely used to make websites function more efficiently, as well as to provide reporting information and support personalisation.":
    "ملفات تعريف الارتباط هي ملفات نصية صغيرة تُوضع على جهاز الكمبيوتر أو الجهاز المحمول الخاص بك عند زيارة موقع إلكتروني. تُستخدم على نطاق واسع لجعل المواقع الإلكترونية تعمل بكفاءة أكبر، وكذلك لتوفير معلومات التقارير ودعم التخصيص.",
  "2. How We Use Cookies": "2. كيف نستخدم ملفات تعريف الارتباط",
  "We use cookies and similar technologies for the following purposes:":
    "نستخدم ملفات تعريف الارتباط والتقنيات المماثلة للأغراض التالية:",
  "a) Strictly Necessary Cookies": "أ) ملفات تعريف الارتباط الضرورية للغاية",
  "These cookies are essential for the Site and platform to function properly, such as enabling secure login to the EHSWatch platform, maintaining session information, and supporting core navigation. These cannot be switched off in our systems, as the Site and Services would not work correctly without them.":
    "هذه الملفات ضرورية لعمل الموقع والمنصة بشكل صحيح، مثل تمكين تسجيل الدخول الآمن إلى منصة EHSWatch، والحفاظ على معلومات الجلسة، ودعم التصفح الأساسي. لا يمكن إيقاف هذه الملفات في أنظمتنا، حيث لن يعمل الموقع والخدمات بشكل صحيح بدونها.",
  "b) Performance and Analytics Cookies": "ب) ملفات تعريف ارتباط الأداء والتحليلات",
  "These cookies help us understand how visitors interact with the Site, including which pages are visited most often, so we can improve the Site’s performance and content. This may include tools such as Google Analytics.":
    "تساعدنا هذه الملفات على فهم كيفية تفاعل الزوار مع الموقع، بما في ذلك الصفحات الأكثر زيارة، حتى نتمكن من تحسين أداء الموقع ومحتواه. قد يشمل ذلك أدوات مثل Google Analytics.",
  "c) Functionality Cookies": "ج) ملفات تعريف ارتباط الوظائف",
  "These cookies allow the Site to remember choices you make (such as language preference) to provide a more personalised experience.":
    "تتيح هذه الملفات للموقع تذكّر الخيارات التي تحددها (مثل تفضيل اللغة) لتوفير تجربة أكثر تخصيصاً.",
  "d) Advertising Cookies": "د) ملفات تعريف ارتباط الإعلانات",
  "We, or third-party vendors including Google, may use cookies to serve advertisements based on your prior visits to our Site and to measure the effectiveness of our marketing campaigns. These third parties may use cookies to gather information about your activity on this and other websites to provide advertisements about goods and services that may interest you.":
    "قد نستخدم نحن، أو بائعون من أطراف ثالثة بما في ذلك جوجل، ملفات تعريف الارتباط لعرض إعلانات بناءً على زياراتك السابقة لموقعنا ولقياس فعالية حملاتنا التسويقية. قد تستخدم هذه الأطراف الثالثة ملفات تعريف الارتباط لجمع معلومات عن نشاطك على هذا الموقع ومواقع أخرى لتقديم إعلانات عن سلع وخدمات قد تهمك.",
  "3. Third-Party Cookies": "3. ملفات تعريف الارتباط الخاصة بأطراف ثالثة",
  "Some cookies are placed by third-party services that appear on our Site, such as analytics providers or embedded content. We do not control these third-party cookies, and their use is governed by the respective third party’s own privacy and cookie policies. We encourage you to review those policies for further information.":
    "تُوضع بعض ملفات تعريف الارتباط بواسطة خدمات أطراف ثالثة تظهر على موقعنا، مثل مزودي خدمات التحليلات أو المحتوى المضمَّن. نحن لا نتحكم في ملفات تعريف الارتباط هذه، ويخضع استخدامها لسياسات الخصوصية وملفات تعريف الارتباط الخاصة بكل طرف ثالث. نشجعك على مراجعة تلك السياسات لمزيد من المعلومات.",
  "4. Managing Your Cookie Preferences": "4. إدارة تفضيلات ملفات تعريف الارتباط الخاصة بك",
  "You can control and manage cookies in various ways:": "يمكنك التحكم في ملفات تعريف الارتباط وإدارتها بطرق مختلفة:",
  "Browser settings": "إعدادات المتصفح",
  ": Most web browsers allow you to control cookies through their settings, including blocking or deleting cookies. Please note that disabling certain cookies may affect the functionality of the Site.":
    ": تتيح لك معظم متصفحات الويب التحكم في ملفات تعريف الارتباط من خلال إعداداتها، بما في ذلك حظرها أو حذفها. يُرجى ملاحظة أن تعطيل بعض ملفات تعريف الارتباط قد يؤثر على وظائف الموقع.",
  "Opt-out tools": "أدوات إلغاء الاشتراك",
  ": You may opt out of Google’s use of cookies for advertising by visiting the":
    ": يمكنك إلغاء الاشتراك في استخدام جوجل لملفات تعريف الارتباط لأغراض إعلانية من خلال زيارة",
  "Google Advertising opt-out page": "صفحة إلغاء الاشتراك في إعلانات جوجل",
  "Cookie consent banner": "شريط موافقة ملفات تعريف الارتباط",
  ": [If applicable, insert details of the cookie consent banner/tool used on the Site, allowing users to manage preferences at first visit and subsequently.]":
    ": [إن أمكن، أدرج تفاصيل شريط/أداة موافقة ملفات تعريف الارتباط المستخدمة على الموقع، التي تتيح للمستخدمين إدارة تفضيلاتهم عند الزيارة الأولى وما بعدها.]",
  "5. Do Not Track Signals": "5. إشارات عدم التتبع",
  "Some browsers offer a “Do Not Track” (“DNT”) feature. As there is currently no industry-agreed standard for how to respond to DNT signals, our Site does not currently respond to DNT browser signals.":
    "توفر بعض المتصفحات ميزة \"عدم التتبع\" (\"DNT\"). ونظراً لعدم وجود معيار متفق عليه في الصناعة حالياً للاستجابة لإشارات عدم التتبع، فإن موقعنا لا يستجيب حالياً لإشارات عدم التتبع من المتصفح.",
  "6. Changes to This Cookie Policy": "6. التغييرات على سياسة ملفات تعريف الارتباط هذه",
  "We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. We will post any changes on this page with a revised “Last Updated” date.":
    "قد نحدّث سياسة ملفات تعريف الارتباط هذه من وقت لآخر لتعكس تغييرات في ملفات تعريف الارتباط التي نستخدمها أو لأسباب تشغيلية أو قانونية أو تنظيمية أخرى. سننشر أي تغييرات على هذه الصفحة مع تاريخ \"آخر تحديث\" جديد.",
  "7. Contact Us": "7. اتصل بنا",
  "If you have questions about our use of cookies, please contact us at:":
    "إذا كانت لديك أسئلة حول استخدامنا لملفات تعريف الارتباط، يُرجى التواصل معنا على:",

  // Footer copyright — keep © 2026 EHSWatch, translate the rest.
  "© 2026 EHSWatch. All rights reserved.":
    "© 2026 EHSWatch. جميع الحقوق محفوظة.",
  // Home WorkEnvironments CTA — client-authored Arabic (machine output was weaker).
  "See How EHSWatch Fits Your Industry": "انظر كيف يناسب EHSWatch صناعتك.",
};

// Form field labels — label-scoped so "Company" here → اسم الشركة (a form field),
// distinct from the footer/nav "Company" → الشركة above. Applied to the label's
// own text node so a required-field asterisk (a sibling <span>) is preserved.
// Curated HTML titles: keyed on the English textContent, value is the Arabic
// innerHTML. Applied ONLY in Arabic (English keeps its server-rendered markup),
// so we can render a multi-line heading with its highlight span intact.
const EN_TO_AR_HTML: Record<string, string> = {
  "EHSQ Insights, Beyond The Dashboard":
    '\u0645\u0642\u0627\u0644\u0627\u062a EHSQ<br /><span style="color:#1d4ed8">\u0645\u0627 \u0648\u0631\u0627\u0621 \u0644\u0648\u062d\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a</span>',
};

const LABEL_EN_TO_AR: Record<string, string> = {
  "Your name": "الاسم الكامل",
  "Full name": "الاسم الكامل",
  "Full Name": "الاسم الكامل",
  "Name": "الاسم الكامل",
  "Company": "اسم الشركة",
  "Company Name": "اسم الشركة",
  // Contact form fields — confirmed untranslated in a client screenshot.
  "Work Email": "البريد الإلكتروني للعمل",
  "Mobile Number": "رقم الجوال",
  "Comments": "تعليقات",
};

// Overrides whose text starts with a Latin brand ("EHSWatch: …"): force the
// element to LTR so the brand stays on the left and the Arabic phrase follows,
// instead of the brand being reordered to the right by the RTL page.
const FORCE_LTR = new Set([
  "EHSWatch: One Platform for Everyday Safety",
  // "About IRIS" is forced LTR with the brand first ("IRIS عن") so it always
  // renders IRIS on the left and عن on the right. A bare dir="rtl" on the inline
  // span was overridden by an ancestor and put عن on the left instead.
  "About IRIS",
]);

const FORCE_RTL = new Set<string>([
]);

// Machine-Arabic → corrected Arabic (used when there's no stable English key).
const AR_FIX: Record<string, string> = {
  "تعرّف على كيف يناسب برنامج EHSWatch قطاعك الصناعي":
    "تعرّف على كيفية ملاءمة برنامج EHSWatch لنشاطك الصناعي.",
};

// Terms that must stay in English (never translated/transliterated).
// Brand + acronyms, plus testimonial attribution lines (name, title, company)
// — proper nouns that Google's live API would otherwise be free to mangle
// for any fragment not covered by a curated EN_TO_AR entry above.
// Exported: GoogleTranslate.tsx unions this into its own text-node-level KEEP
// set, so there's one source of truth instead of two lists that can drift.
export const KEEP_ENGLISH = new Set([
  "IRIS",
  "EHSWatch",
  "WhatsApp",
  "Google",
  "Muhammad Fahad A, SR. QHSE ADVISOR, BARIK GROUP",
  "Afad K, HSE OFFICER, AL BARAKA OILFIELD SERVICES",
  "Dijin D, HSE ENGINEER, POWER CHINA – HDEC",
  "Mohammed Al Harthy, HSE MANAGER, AL SUMRI TRANSPORT CO.",
  "GK Yuvaraj P, OMAN NATIONAL ENGINEERING AND INVESTMENT CO.",
  "Anish R, SPECIAL OILFIELD SERVICES",
  "Basma, HSE OFFICER, OMAN CABLES",
  "Amwaj A, QUALITY ASSURANCE ENGINEER, OMAN CABLES",
  "Asif Ali, QUALITY MANAGER, SPECIAL OILFIELD SERVICES",
]);

// Only look at elements that hold short, translatable text.
const CANDIDATE = "h1,h2,h3,h4,p,span,a,button,li,label,div";

const norm = (s: string | null) => (s ?? "").replace(/\s+/g, " ").trim();
const isArabic = () => /(?:^|;\s*)googtrans=\/en\/ar/.test(document.cookie) || /(?:^|;\s*)locale=ar/.test(document.cookie);

// True when a descendant ELEMENT holds the exact same text — i.e. this element
// is just a wrapper. We must NOT setTextContent on it (that would wipe the inner
// heading/span and its styling); let the more specific inner element handle it.
const isWrapperFor = (el: Element, text: string) =>
  Array.from(el.querySelectorAll("h1,h2,h3,h4,p,span,a,button,li,label"))
    .some((c) => c !== el && norm(c.textContent) === text);

export default function ArabicOverrides() {
  useEffect(() => {
    let raf = 0;

    const apply = () => {
      const ar = isArabic();
      const els = document.querySelectorAll<HTMLElement>(CANDIDATE);
      els.forEach((el) => {
        const text = norm(el.textContent);
        if (!text) return;

        // Keep-English terms (e.g. IRIS): pin them translate="no".
        if (KEEP_ENGLISH.has(text)) {
          el.setAttribute("translate", "no");
          el.classList.add("notranslate");
          return;
        }

        // Form field labels: translate ONLY the label's own text node so a
        // trailing required-asterisk span survives, using the label-scoped map.
        if (el.tagName === "LABEL") {
          const tn = Array.from(el.childNodes).find(
            (n) => n.nodeType === 3 && (n.textContent || "").trim(),
          ) as Text | undefined;
          const stored = el.getAttribute("data-ar-label");
          const cur = tn ? norm(tn.textContent) : "";
          const key =
            stored && LABEL_EN_TO_AR[stored] !== undefined
              ? stored
              : LABEL_EN_TO_AR[cur] !== undefined
                ? cur
                : null;
          if (tn && key) {
            if (!stored) el.setAttribute("data-ar-label", key);
            el.setAttribute("translate", "no");
            el.classList.add("notranslate");
            const want = ar ? LABEL_EN_TO_AR[key] : key;
            if (norm(tn.textContent) !== want) tn.textContent = want;
            return;
          }
        }

        // Curated HTML overrides (multi-line titles w/ highlight) — Arabic only.
        if (ar && Object.prototype.hasOwnProperty.call(EN_TO_AR_HTML, text)) {
          if (el.getAttribute("data-ar-html") !== "1") {
            el.setAttribute("translate", "no");
            el.classList.add("notranslate");
            el.setAttribute("data-ar-html", "1");
            el.innerHTML = EN_TO_AR_HTML[text];
          }
          return;
        }

        // English-keyed overrides.
        const enHit = Object.prototype.hasOwnProperty.call(EN_TO_AR, text) ? text : el.getAttribute("data-ar-en");
        if (enHit && EN_TO_AR[enHit] !== undefined) {
          // Skip wrapper containers — target the inner element so we keep its styling.
          if (isWrapperFor(el, enHit)) return;
          // Skip elements that hold non-text children (icons, nested spans) —
          // el.textContent = "..." below would silently delete them (e.g. the
          // "Resources" nav button's dropdown-chevron <svg>). GoogleTranslate's
          // own text-node-level pass (which this map also feeds) still swaps
          // the visible text correctly without touching siblings.
          if (el.children.length > 0) return;
          if (!el.getAttribute("data-ar-en")) el.setAttribute("data-ar-en", enHit);
          el.setAttribute("translate", "no");
          el.classList.add("notranslate");
          // Keep a Latin-brand-led header reading left-to-right in both languages.
          if (FORCE_LTR.has(enHit)) el.setAttribute("dir", "ltr");
          else if (FORCE_RTL.has(enHit)) el.setAttribute("dir", "rtl");
          const want = ar ? EN_TO_AR[enHit] : enHit;
          if (norm(el.textContent) !== want) el.textContent = want;
          return;
        }

        // Machine-Arabic corrections (only meaningful while Arabic is on).
        if (ar && AR_FIX[text] !== undefined && !isWrapperFor(el, text)) {
          el.setAttribute("translate", "no");
          el.classList.add("notranslate");
          el.textContent = AR_FIX[text];
        }
      });

      // Brand consistency: the machine transliterates "IRIS" to "ايريس" inside
      // sentences (KEEP_ENGLISH only catches a standalone "IRIS"). Replace every
      // "ايريس" back to "IRIS" and pin the node so it is not re-transliterated.
      if (ar) {
        const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const hits: Text[] = [];
        let node: Node | null;
        while ((node = tw.nextNode())) {
          if (node.nodeValue && node.nodeValue.indexOf("ايريس") !== -1) hits.push(node as Text);
        }
        hits.forEach((t) => {
          t.nodeValue = (t.nodeValue as string).replace(/ايريس/g, "IRIS");
          const pe = t.parentElement;
          if (pe) { pe.setAttribute("translate", "no"); pe.classList.add("notranslate"); }
        });
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };

    apply();
    // Re-apply as Google Translate mutates the DOM and on client navigation.
    const obs = new MutationObserver(schedule);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    // A few timed passes catch Google's late first translation.
    const timers = [300, 800, 1500, 2500, 4000].map((t) => window.setTimeout(apply, t));

    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
