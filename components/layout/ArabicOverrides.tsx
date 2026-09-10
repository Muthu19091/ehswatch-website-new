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
  "AI-Powered EHSQ platform helping teams stay safe, compliant, and in control.":
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
  // Split lead-in + highlighted-span text nodes (see EN_TO_AR export note) —
  // "Get in Touch with Our Team" as one key never matched, since the DOM is
  // "Get in Touch with <span>Our Team</span>": two separate text nodes.
  "Get in Touch with": "تواصل مع",
  "Our Team": "فريقنا",
  "Submit": "إرسال",
  "Support Ticket": "تذكرة الدعم",
  // Contact page hero.
  "Talk to an EHS Digital Transformation Specialist": "تحدث إلى أخصائي التحول الرقمي في EHS",
  "Schedule a tailored platform walkthrough, explore custom module configurations, or consult with our regional safety technology experts.":
    "حدد موعداً لجولة مخصصة في المنصة، أو استكشف تهيئات وحدات مخصصة، أو استشر خبراء تقنية السلامة الإقليميين لدينا.",
  "ISO 27001 Certified": "معتمدة وفق ISO 27001",
  "4-Hour SLA Response": "استجابة خلال 4 ساعات وفق اتفاقية مستوى الخدمة",
  "Rapid Deployment": "نشر سريع",
  "Most enquiries get a response within one business day.": "تحصل معظم الاستفسارات على رد خلال يوم عمل واحد.",
  // Support Ticket tab form (distinct fields from the Contact Us tab form).
  "Email": "البريد الإلكتروني",
  "Your Name": "اسمك",
  "Issue Category": "فئة المشكلة",
  "Select Issue Category": "حدد فئة المشكلة",
  "Subject": "الموضوع",
  "One-line summary": "ملخص من سطر واحد",
  "Priority": "الأولوية",
  "Urgent": "عاجل",
  "High": "مرتفعة",
  "Normal": "عادية",
  "Low": "منخفضة",
  "Describe the Issue": "صف المشكلة",
  "Include reproduction steps if it's a bug.": "أدرج خطوات إعادة إنتاج المشكلة إن كانت خللاً برمجياً.",
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
  // IRISChatShowcase.tsx — animated chat mockup (MSGS array). Renders each
  // string into its own stable <p>/<span>, so whole-element exact match
  // catches these; must include the emoji prefixes verbatim since the
  // match is on the full rendered text.
  "Oil spill in hallway, main building sector A, Hyderabad. No immediate actions taken.":
    "انسكاب زيت في الممر، المبنى الرئيسي القطاع A، حيدر أباد. لم تُتخذ أي إجراءات فورية.",
  "Environmental incident pre-filled ✅": "تمت التعبئة المسبقة للحادثة البيئية ✅",
  "📍 Main Building, Sector A, Hyderabad": "📍 المبنى الرئيسي، القطاع A، حيدر أباد",
  "⚠️ Type: Environmental - Oil Spill": "⚠️ النوع: بيئي - انسكاب زيت",
  "🔴 Severity: Medium  ·  Actions: None taken": "🔴 الخطورة: متوسطة  ·  الإجراءات: لم تُتخذ",
  "What should we do next?": "ماذا يجب أن نفعل بعد ذلك؟",
  "Prioritised corrective actions - 47 similar incidents analysed:":
    "إجراءات تصحيحية ذات أولوية - تم تحليل 47 حادثة مشابهة:",
  "🔴 Deploy absorbent mats & cordon off area now": "🔴 انشر حصائر ماصة وقم بتطويق المنطقة الآن",
  "🟡 Identify oil source; inspect adjacent machinery": "🟡 حدّد مصدر الزيت؛ افحص الآلات المجاورة",
  "🟢 Schedule deep clean & update MSDS register": "🟢 جدول تنظيفاً عميقاً وحدّث سجل صحائف بيانات السلامة",
  "Can you identify the root cause?": "هل يمكنك تحديد السبب الجذري؟",
  "5-Why Root Cause Analysis:": "تحليل السبب الجذري بطريقة الأسباب الخمسة:",
  "Hydraulic line leak → Machine B-04": "تسرب في خط هيدروليكي → الآلة B-04",
  "Maintenance overdue by 18 days": "الصيانة متأخرة بمقدار 18 يوماً",
  "Root cause: PM system integration gap": "السبب الجذري: فجوة في تكامل نظام الصيانة الوقائية",
  "Have we seen anything like this before?": "هل رأينا شيئاً مشابهاً لهذا من قبل؟",
  "🔍 3 similar clusters across 1,240 records:": "🔍 3 مجموعات مشابهة عبر 1,240 سجلاً:",
  "Sector A - oil spill (2× in last 6 months)": "القطاع A - انسكاب زيت (مرتان خلال آخر 6 أشهر)",
  "Machine B-series failures - 4 events Q3–Q4": "أعطال سلسلة الآلات B - 4 أحداث في الربعين الثالث والرابع",
  "Overdue PM trend → emerging leading indicator ⚠️": "اتجاه تأخر الصيانة الوقائية → مؤشر استباقي ناشئ ⚠️",
  "Summarise this for my board report.": "لخّص هذا لتقرير مجلس الإدارة الخاص بي.",
  "Executive EHS summary - board-ready:": "ملخص تنفيذي للصحة والسلامة والبيئة - جاهز لمجلس الإدارة:",
  "3 spills linked to maintenance scheduling gap": "3 انسكابات مرتبطة بفجوة في جدولة الصيانة",
  "Corrective actions 87% closed": "الإجراءات التصحيحية مغلقة بنسبة 87%",
  "17.5 hrs saved on reporting this month": "توفير 17.5 ساعة في الإبلاغ هذا الشهر",
  "Sending field photo…": "جارٍ إرسال صورة ميدانية…",
  "🤖 Image Analysis Complete:": "🤖 اكتمل تحليل الصورة:",
  "⚠️ PPE violation - missing hard hat & hi-vis vest": "⚠️ مخالفة معدات الحماية الشخصية - خوذة صلبة وسترة عاكسة مفقودتان",
  "📍 Location: Warehouse Bay 3": "📍 الموقع: مستودع الرصيف 3",
  "Supervisor Rajan M. alerted in real-time. Confirm to submit?": "تم تنبيه المشرف Rajan M. فورياً. أكّد للإرسال؟",

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
  // Shared bottom CTA — appears on blog and other listing pages.
  "Reading is a start. Now is your time to take action.": "القراءة هي البداية. حان الآن وقت التحرك.",

  // ── /case-studies — hero (lead-in + highlighted span, same pattern). ────
  "Proof from the Field,": "دليل من الميدان،",
  "Not the Pitch": "لا العرض التسويقي",
  "EHSQ teams across construction, energy, manufacturing, logistics and other sectors use EHSWatch to cut reporting time, accelerate audits, close actions faster and gain clear visibility into risk across every site.":
    "تستخدم فرق EHSQ في قطاعات البناء والطاقة والتصنيع والخدمات اللوجستية وقطاعات أخرى EHSWatch لتقليل وقت الإبلاغ، وتسريع التدقيقات، وإغلاق الإجراءات بشكل أسرع، واكتساب رؤية واضحة للمخاطر عبر كل موقع.",
  "Talk to Experts": "تحدث إلى الخبراء",
  "Explore Case Studies": "استكشف دراسات الحالة",
  "Know more": "اعرف المزيد",

  // ── /case-studies/reducing-incident-reporting-time-by-68-across-12-industrial-sites
  "Reducing Incident Reporting Time by 68% Across 12 Industrial Sites":
    "تقليل وقت الإبلاغ عن الحوادث بنسبة 68% عبر 12 موقعاً صناعياً",
  "Overview": "نظرة عامة",
  "Al Fanar Petrochemicals partnered with EHSWatch to replace fragmented, paper-based safety processes with a single digital platform. Within six months of rollout, the company cut incident reporting time by more than two-thirds and brought real-time visibility to EHS performance across every site.":
    "تعاونت شركة الفنار للبتروكيماويات مع EHSWatch لاستبدال عمليات السلامة الورقية المجزأة بمنصة رقمية واحدة. خلال ستة أشهر من التطبيق، خفّضت الشركة وقت الإبلاغ عن الحوادث بأكثر من الثلثين وحققت رؤية فورية لأداء الصحة والسلامة والبيئة عبر كل موقع.",
  "About the Client": "عن العميل",
  "Al Fanar Petrochemicals is a mid-sized petrochemical manufacturer operating 12 production and storage facilities across the GCC, employing over 3,200 staff and contractors. Prior to EHSWatch, the company relied on a mix of paper logs, spreadsheets, and disconnected email threads to manage incident reporting, permits, and audits. This created significant blind spots: safety data took days to consolidate across sites, permit approvals were often delayed or duplicated, and leadership had no unified view of compliance status until monthly reports were manually compiled.":
    "شركة الفنار للبتروكيماويات هي شركة تصنيع بتروكيماويات متوسطة الحجم تدير 12 منشأة إنتاج وتخزين عبر دول الخليج، وتوظف أكثر من 3,200 موظف ومقاول. قبل EHSWatch، كانت الشركة تعتمد على مزيج من السجلات الورقية وجداول البيانات وسلاسل بريد إلكتروني منفصلة لإدارة الإبلاغ عن الحوادث والتصاريح والتدقيقات. وقد خلق ذلك نقاط عمياء كبيرة: استغرقت بيانات السلامة أياماً لتجميعها عبر المواقع، وكانت موافقات التصاريح غالباً متأخرة أو مكررة، ولم تكن لدى القيادة رؤية موحدة لحالة الامتثال حتى يتم تجميع التقارير الشهرية يدوياً.",
  "Challenges": "التحديات",
  "Incident reports took an average of 3–4 days to reach EHS leadership, delaying corrective action":
    "استغرقت تقارير الحوادث في المتوسط 3-4 أيام للوصول إلى قيادة الصحة والسلامة والبيئة، مما أخّر الإجراءات التصحيحية",
  "No centralised system for tracking Permit to Work approvals across 12 geographically dispersed sites":
    "لا يوجد نظام مركزي لتتبع موافقات تصاريح العمل عبر 12 موقعاً متفرقاً جغرافياً",
  "Safety meetings and action items were tracked inconsistently, with follow-ups frequently lost across email chains":
    "كانت اجتماعات السلامة وبنود الإجراءات تُتبَّع بشكل غير متسق، مع ضياع المتابعات بشكل متكرر عبر سلاسل البريد الإلكتروني",
  "Manual audit scheduling led to missed inspection deadlines and inconsistent compliance documentation":
    "أدت جدولة التدقيق اليدوية إلى تفويت مواعيد التفتيش النهائية وتوثيق امتثال غير متسق",
  "Leadership lacked real-time visibility into open corrective actions, risking recurring incidents going unaddressed":
    "افتقرت القيادة إلى رؤية فورية للإجراءات التصحيحية المفتوحة، مما عرّض الحوادث المتكررة لخطر عدم المعالجة",
  "Solution": "الحل",
  "EHSWatch worked with Al Fanar’s EHS team to roll out a phased implementation starting with Incident Management and Permit to Work, followed by Meetings Management and Action Tracker across all 12 sites. Site supervisors were trained to log incidents directly from the EHSWatch mobile app, triggering automated notifications to relevant safety officers. Permit approvals moved to a digital workflow with built-in accountability checkpoints, while Meetings Management centralised safety huddles and toolbox talks into a single, searchable record. Action Tracker gave leadership a live dashboard of open, overdue, and completed corrective actions across all facilities, replacing a manual, spreadsheet-driven process.":
    "عملت EHSWatch مع فريق الصحة والسلامة والبيئة في الفنار لتنفيذ طرح مرحلي بدأ بإدارة الحوادث وتصريح العمل، تلته إدارة الاجتماعات ومتتبع الإجراءات عبر كل المواقع الـ 12. تم تدريب مشرفي المواقع على تسجيل الحوادث مباشرة من تطبيق EHSWatch للجوال، مما يُطلق إشعارات تلقائية لضباط السلامة المعنيين. انتقلت موافقات التصاريح إلى سير عمل رقمي بنقاط مساءلة مدمجة، بينما مركزت إدارة الاجتماعات جلسات السلامة اليومية وجلسات صندوق الأدوات في سجل واحد قابل للبحث. منح متتبع الإجراءات القيادة لوحة معلومات حية للإجراءات التصحيحية المفتوحة والمتأخرة والمكتملة عبر كل المنشآت، لتحل محل عملية يدوية معتمدة على جداول البيانات.",
  "Results & Metrics": "النتائج والمقاييس",
  "Metric": "المقياس",
  "Before EHSWatch": "قبل EHSWatch",
  "After EHSWatch": "بعد EHSWatch",
  "Improvement": "التحسن",
  "Average incident reporting time": "متوسط وقت الإبلاغ عن الحوادث",
  "3.5 days": "3.5 أيام",
  "1.1 days": "1.1 يوم",
  "68% reduction": "انخفاض بنسبة 68%",
  "Permit to Work approval time": "وقت اعتماد تصريح العمل",
  "2.2 days": "2.2 يوم",
  "0.6 days": "0.6 يوم",
  "73% reduction": "انخفاض بنسبة 73%",
  "Overdue corrective actions (monthly avg.)": "الإجراءات التصحيحية المتأخرة (متوسط شهري)",
  "79% reduction": "انخفاض بنسبة 79%",
  "Safety audits completed on schedule": "تدقيقات السلامة المكتملة في موعدها",
  "33-point increase": "زيادة بمقدار 33 نقطة",
  "Sites with real-time EHS dashboard visibility": "المواقع ذات رؤية فورية للوحة معلومات الصحة والسلامة والبيئة",
  "0 of 12": "0 من 12",
  "12 of 12": "12 من 12",
  "100% coverage": "تغطية 100%",
  "Faster incident response, reducing the window for repeat safety events":
    "استجابة أسرع للحوادث، مما يقلل نافذة تكرار أحداث السلامة",
  "Centralised permit approvals, eliminating duplicate or delayed sign-offs":
    "موافقات تصاريح مركزية، تلغي التوقيعات المكررة أو المتأخرة",
  "Consistent, searchable records of safety meetings and toolbox talks across all sites":
    "سجلات متسقة وقابلة للبحث لاجتماعات السلامة وجلسات صندوق الأدوات عبر كل المواقع",
  "Real-time leadership visibility into open corrective actions and audit status":
    "رؤية فورية للقيادة على الإجراءات التصحيحية المفتوحة وحالة التدقيق",
  "Reduced administrative burden on site supervisors, freeing time for on-ground safety work":
    "عبء إداري أقل على مشرفي المواقع، مما يوفر وقتاً لعمل السلامة الميداني",
  "EHSWatch Applications": "تطبيقات EHSWatch",
  "Ready to bring this level of visibility to your EHS operations?":
    "هل أنت مستعد لجلب هذا المستوى من الرؤية إلى عمليات الصحة والسلامة والبيئة لديك؟",

  // ── /blog/scaling-ai-in-ehs-sustainability ────────────────────────────────
  "Scaling AI in EHS & Sustainability: From Pilot to Enterprise Value":
    "توسيع نطاق الذكاء الاصطناعي في الصحة والسلامة والبيئة والاستدامة: من التجربة إلى قيمة المؤسسة",
  "Introduction": "مقدمة",
  "Artificial Intelligence (AI) is rapidly reshaping the way organizations manage Environment, Health & Safety (EHS) and sustainability. With increasing regulatory pressure, rising safety expectations, and the need for sustainable operations, businesses are turning to AI-powered solutions to stay ahead.":
    "يعيد الذكاء الاصطناعي بسرعة تشكيل طريقة إدارة المؤسسات للبيئة والصحة والسلامة والاستدامة. مع تزايد الضغط التنظيمي وارتفاع توقعات السلامة والحاجة إلى عمليات مستدامة، تتجه الشركات إلى حلول مدعومة بالذكاء الاصطناعي للبقاء في الصدارة.",
  "While many companies begin with small pilot programs, the real value of AI is realized when it is scaled across the enterprise. From improving workplace safety to enhancing environmental performance, AI is becoming a critical driver of modern EHS management.":
    "بينما تبدأ العديد من الشركات ببرامج تجريبية صغيرة، تتحقق القيمة الحقيقية للذكاء الاصطناعي عند توسيع نطاقه عبر المؤسسة. من تحسين سلامة مكان العمل إلى تعزيز الأداء البيئي، يصبح الذكاء الاصطناعي محركاً أساسياً لإدارة الصحة والسلامة والبيئة الحديثة.",
  "Understanding AI in EHS & Sustainability": "فهم الذكاء الاصطناعي في الصحة والسلامة والبيئة والاستدامة",
  "AI in EHS refers to the use of advanced technologies such as machine learning, automation, and data analytics to improve safety processes, ensure compliance, and support sustainability goals.":
    "يشير الذكاء الاصطناعي في الصحة والسلامة والبيئة إلى استخدام تقنيات متقدمة مثل التعلم الآلي والأتمتة وتحليلات البيانات لتحسين عمليات السلامة وضمان الامتثال ودعم أهداف الاستدامة.",
  "By integrating AI into EHS systems, organizations can analyze large volumes of data, identify patterns, and generate actionable insights in real time. This enables a shift from reactive safety management to proactive risk prevention.":
    "من خلال دمج الذكاء الاصطناعي في أنظمة الصحة والسلامة والبيئة، يمكن للمؤسسات تحليل كميات كبيرة من البيانات وتحديد الأنماط وإنشاء رؤى قابلة للتنفيذ في الوقت الفعلي. يتيح ذلك الانتقال من إدارة السلامة التفاعلية إلى الوقاية الاستباقية من المخاطر.",
  "AI also plays a significant role in sustainability by helping organizations monitor emissions, optimize resource usage, and meet environmental regulations more efficiently":
    "يلعب الذكاء الاصطناعي أيضاً دوراً مهماً في الاستدامة من خلال مساعدة المؤسسات على مراقبة الانبعاثات وتحسين استخدام الموارد وتلبية اللوائح البيئية بكفاءة أكبر",
  "AI Pilot Programs: The Starting Point": "برامج الذكاء الاصطناعي التجريبية: نقطة البداية",
  "Most organizations begin their AI journey in EHS with pilot programs focused on specific use cases. These pilots help test the feasibility of AI and demonstrate its potential value.":
    "تبدأ معظم المؤسسات رحلتها مع الذكاء الاصطناعي في الصحة والسلامة والبيئة ببرامج تجريبية تركز على حالات استخدام محددة. تساعد هذه التجارب في اختبار جدوى الذكاء الاصطناعي وإظهار قيمته المحتملة.",
  "Common applications include predictive analytics for incident prevention, automated incident reporting, and real-time environmental monitoring. These initial implementations often deliver promising results, such as improved reporting accuracy and better visibility into workplace risks.":
    "تشمل التطبيقات الشائعة التحليلات التنبؤية للوقاية من الحوادث، والإبلاغ الآلي عن الحوادث، والمراقبة البيئية الفورية. غالباً ما تقدم هذه التطبيقات الأولية نتائج واعدة، مثل تحسين دقة الإبلاغ ورؤية أفضل لمخاطر مكان العمل.",
  "However, pilot programs are only the first step. The true impact of AI is achieved when these solutions move beyond isolated use cases and become part of a larger, integrated system.":
    "لكن البرامج التجريبية ليست سوى الخطوة الأولى. يتحقق التأثير الحقيقي للذكاء الاصطناعي عندما تتجاوز هذه الحلول حالات الاستخدام المعزولة وتصبح جزءاً من نظام أكبر ومتكامل.",
  "Impact of AI on Workplace Safety": "تأثير الذكاء الاصطناعي على سلامة مكان العمل",
  "One of the most significant benefits of AI in EHS is its ability to improve workplace safety. By analyzing historical data and identifying patterns, AI can predict potential hazards before they result in incidents.":
    "من أبرز فوائد الذكاء الاصطناعي في الصحة والسلامة والبيئة قدرته على تحسين سلامة مكان العمل. من خلال تحليل البيانات التاريخية وتحديد الأنماط، يمكن للذكاء الاصطناعي التنبؤ بالمخاطر المحتملة قبل أن تتحول إلى حوادث.",
  "This predictive capability allows organizations to take preventive actions, reducing the likelihood of accidents and injuries. AI also improves incident reporting by automating data capture and classification, ensuring more accurate and timely records.":
    "تتيح هذه القدرة التنبؤية للمؤسسات اتخاذ إجراءات وقائية، مما يقلل احتمالية وقوع الحوادث والإصابات. يحسّن الذكاء الاصطناعي أيضاً الإبلاغ عن الحوادث من خلال أتمتة التقاط البيانات وتصنيفها، بما يضمن سجلات أكثر دقة وفي وقتها.",
  "Additionally, technologies such as computer vision can detect unsafe behaviors in real time, helping organizations create safer work environments.":
    "بالإضافة إلى ذلك، يمكن لتقنيات مثل الرؤية الحاسوبية اكتشاف السلوكيات غير الآمنة في الوقت الفعلي، مما يساعد المؤسسات على إنشاء بيئات عمل أكثر أماناً.",
  "Enhancing Sustainability with AI": "تعزيز الاستدامة بالذكاء الاصطناعي",
  "AI is also transforming sustainability management by enabling organizations to track and optimize their environmental impact. Through real-time monitoring and data analysis, businesses can gain better visibility into energy consumption, emissions, and waste generation.":
    "يعيد الذكاء الاصطناعي أيضاً تشكيل إدارة الاستدامة من خلال تمكين المؤسسات من تتبع أثرها البيئي وتحسينه. من خلال المراقبة الفورية وتحليل البيانات، يمكن للشركات اكتساب رؤية أفضل لاستهلاك الطاقة والانبعاثات وتوليد النفايات.",
  "This allows companies to identify inefficiencies, reduce resource usage, and align with sustainability goals and ESG standards. AI-driven insights make it easier to comply with environmental regulations while improving overall operational performance.":
    "يتيح ذلك للشركات تحديد أوجه القصور وتقليل استخدام الموارد والتوافق مع أهداف الاستدامة ومعايير الحوكمة البيئية والاجتماعية. تُسهّل الرؤى المدعومة بالذكاء الاصطناعي الامتثال للوائح البيئية مع تحسين الأداء التشغيلي العام.",
  "Future of AI in EHS & Sustainability": "مستقبل الذكاء الاصطناعي في الصحة والسلامة والبيئة والاستدامة",
  "The future of AI in EHS and sustainability lies in more advanced and integrated systems. Emerging technologies will further enhance predictive capabilities, automate complex processes, and provide deeper insights into safety and environmental performance.":
    "يكمن مستقبل الذكاء الاصطناعي في الصحة والسلامة والبيئة والاستدامة في أنظمة أكثر تقدماً وتكاملاً. ستعزز التقنيات الناشئة القدرات التنبؤية بشكل أكبر، وتؤتمت العمليات المعقدة، وتوفر رؤى أعمق لأداء السلامة والبيئة.",
  "As organizations continue to adopt digital solutions, AI will play a central role in shaping safer workplaces and more sustainable operations.":
    "مع استمرار المؤسسات في تبني الحلول الرقمية، سيلعب الذكاء الاصطناعي دوراً محورياً في تشكيل أماكن عمل أكثر أماناً وعمليات أكثر استدامة.",
  "Conclusion": "الخاتمة",
  "Scaling AI in EHS and sustainability is transforming how organizations approach safety, compliance, and environmental responsibility. Moving from pilot programs to enterprise-wide implementation enables businesses to unlock the full potential of AI.":
    "يعيد توسيع نطاق الذكاء الاصطناعي في الصحة والسلامة والبيئة والاستدامة تشكيل نهج المؤسسات تجاه السلامة والامتثال والمسؤولية البيئية. يتيح الانتقال من البرامج التجريبية إلى التنفيذ على مستوى المؤسسة للشركات إطلاق كامل إمكانات الذكاء الاصطناعي.",
  "With improved visibility, predictive insights, and enhanced efficiency, AI is not just a technological advancement-it is a strategic enabler for building safer, smarter, and more sustainable organizations.":
    "بفضل الرؤية المحسّنة والرؤى التنبؤية والكفاءة المعززة، لا يُعد الذكاء الاصطناعي مجرد تقدم تقني — بل عامل تمكين استراتيجي لبناء مؤسسات أكثر أماناً وذكاءً واستدامة.",

  // ── /blog/manual-incident-reporting-vs-digital-reporting-which-is-better-for-workplace-safety
  "Manual Incident Reporting vs Digital Reporting: Which Is Better for Workplace Safety?":
    "الإبلاغ اليدوي عن الحوادث مقابل الإبلاغ الرقمي: أيهما أفضل لسلامة مكان العمل؟",
  "Every workplace faces incidents at some point - from near misses to equipment failures or employee injuries. But in many companies, the real challenge starts after the incident happens: reporting and managing it properly.":
    "يواجه كل مكان عمل حوادث في مرحلة ما — من الحوادث الوشيكة إلى أعطال المعدات أو إصابات الموظفين. لكن في العديد من الشركات، يبدأ التحدي الحقيقي بعد وقوع الحادث: الإبلاغ عنه وإدارته بشكل صحيح.",
  "Many organizations still rely on paper forms, Excel sheets, emails, or WhatsApp messages to record incidents. While this may seem manageable, it often creates delays, missing information, and confusion between teams. Important corrective actions can also get delayed because the data is scattered across different platforms.":
    "لا تزال العديد من المؤسسات تعتمد على النماذج الورقية أو جداول إكسل أو البريد الإلكتروني أو رسائل واتساب لتسجيل الحوادث. وبينما قد يبدو هذا قابلاً للإدارة، إلا أنه غالباً ما يخلق تأخيرات ومعلومات ناقصة وارتباكاً بين الفرق. يمكن أيضاً أن تتأخر الإجراءات التصحيحية المهمة لأن البيانات مبعثرة عبر منصات مختلفة.",
  "That’s why more businesses are shifting toward digital incident reporting systems.":
    "لهذا السبب تتجه المزيد من الشركات نحو أنظمة الإبلاغ الرقمي عن الحوادث.",
  "Problems with Manual Incident Reporting": "مشكلات الإبلاغ اليدوي عن الحوادث",
  "Manual reporting mainly depends on paperwork and back-and-forth communication. Employees report issues to supervisors, who then pass the details to safety teams through calls, emails, or spreadsheets. As operations grow, this process becomes difficult to manage.":
    "يعتمد الإبلاغ اليدوي بشكل أساسي على الأعمال الورقية والتواصل المتكرر ذهاباً وإياباً. يُبلغ الموظفون المشرفين بالمشكلات، الذين ينقلون بدورهم التفاصيل إلى فرق السلامة عبر المكالمات أو البريد الإلكتروني أو جداول البيانات. مع نمو العمليات، تصبح هذه العملية صعبة الإدارة.",
  "Common challenges include:": "تشمل التحديات الشائعة:",
  "Delayed reporting": "الإبلاغ المتأخر",
  "Missing or incomplete records": "سجلات مفقودة أو غير مكتملة",
  "Human errors in data entry": "أخطاء بشرية في إدخال البيانات",
  "Difficulty tracking corrective actions": "صعوبة تتبع الإجراءات التصحيحية",
  "Slow investigations and approvals": "تحقيقات وموافقات بطيئة",
  "Lack of real-time visibility": "غياب الرؤية الفورية",
  "Over time, these issues increase workload for safety teams and slow down response times.":
    "بمرور الوقت، تزيد هذه المشكلات عبء العمل على فرق السلامة وتبطئ أوقات الاستجابة.",
  "How Digital Incident Reporting Helps": "كيف يساعد الإبلاغ الرقمي عن الحوادث",
  "Digital systems simplify the entire reporting process. Employees can report incidents instantly through a mobile app or web platform, and the information immediately reaches the concerned teams.":
    "تبسّط الأنظمة الرقمية عملية الإبلاغ بأكملها. يمكن للموظفين الإبلاغ عن الحوادث فوراً عبر تطبيق جوال أو منصة ويب، وتصل المعلومات على الفور إلى الفرق المعنية.",
  "This helps organizations:": "يساعد هذا المؤسسات على:",
  "Respond faster to incidents": "الاستجابة بشكل أسرع للحوادث",
  "Store all records in one place": "تخزين كل السجلات في مكان واحد",
  "Reduce manual errors": "تقليل الأخطاء اليدوية",
  "Track corrective actions easily": "تتبع الإجراءات التصحيحية بسهولة",
  "Monitor safety trends through dashboards": "مراقبة اتجاهات السلامة عبر لوحات المعلومات",
  "Simplify compliance and audits": "تبسيط الامتثال والتدقيقات",
  "Digital reporting also encourages employees to report hazards more quickly because the process becomes simple and accessible.":
    "يشجع الإبلاغ الرقمي أيضاً الموظفين على الإبلاغ عن المخاطر بشكل أسرع لأن العملية تصبح بسيطة وسهلة الوصول.",
  "Manual vs Digital Reporting": "الإبلاغ اليدوي مقابل الرقمي",
  "Feature": "الميزة",
  "Manual Reporting": "الإبلاغ اليدوي",
  "Digital Reporting": "الإبلاغ الرقمي",
  "Reporting Speed": "سرعة الإبلاغ",
  "Slow": "بطيء",
  "Instant": "فوري",
  "Record Keeping": "حفظ السجلات",
  "Hard to manage": "صعب الإدارة",
  "Centralized": "مركزي",
  "Tracking": "التتبع",
  "Manual follow-up": "متابعة يدوية",
  "Automated": "آلي",
  "Accuracy": "الدقة",
  "Higher chance of errors": "احتمالية أعلى للأخطاء",
  "More consistent": "أكثر اتساقاً",
  "Accessibility": "سهولة الوصول",
  "Limited": "محدودة",
  "Real-time access": "وصول فوري",
  "Why Businesses Are Moving Digital": "لماذا تتجه الشركات نحو الرقمنة",
  "Modern workplaces need faster communication, better visibility, and organized safety management. Paper-based systems often fail to provide that level of efficiency. Digital reporting helps companies improve accountability, reduce delays, and manage workplace safety more effectively.":
    "تحتاج أماكن العمل الحديثة إلى تواصل أسرع ورؤية أفضل وإدارة سلامة منظمة. غالباً ما تفشل الأنظمة الورقية في توفير هذا المستوى من الكفاءة. يساعد الإبلاغ الرقمي الشركات على تحسين المساءلة وتقليل التأخيرات وإدارة سلامة مكان العمل بفعالية أكبر.",
  "Final Thoughts": "أفكار ختامية",
  "Manual reporting methods may still work for some businesses, but they often create unnecessary delays and increase administrative effort. Digital incident reporting offers a faster, smarter, and more organized way to manage workplace safety.":
    "قد لا تزال طرق الإبلاغ اليدوي تعمل لبعض الشركات، لكنها غالباً ما تخلق تأخيرات غير ضرورية وتزيد الجهد الإداري. يقدم الإبلاغ الرقمي عن الحوادث طريقة أسرع وأذكى وأكثر تنظيماً لإدارة سلامة مكان العمل.",
  "As companies continue focusing on employee safety and compliance, digital EHS solutions are becoming an essential part of modern incident management.":
    "مع استمرار الشركات في التركيز على سلامة الموظفين والامتثال، تصبح حلول الصحة والسلامة والبيئة الرقمية جزءاً أساسياً من إدارة الحوادث الحديثة.",

  // ── /blog/what-is-ehs-compliance-and-why-do-businesses-and-industries-need-it
  "What is EHS Compliance and Why Do Businesses and Industries Need It?":
    "ما هو الامتثال للصحة والسلامة والبيئة ولماذا تحتاجه الشركات والصناعات؟",
  "In today's fast-paced industrial environment, maintaining a safe, healthy, and environmentally responsible workplace is no longer optional-it's a business necessity. Organizations across manufacturing, construction, pharmaceuticals, logistics, oil & gas, and other sectors are expected to comply with Environmental, Health, and Safety (EHS) regulations to protect employees, communities, and the environment.":
    "في البيئة الصناعية سريعة الوتيرة اليوم، لم يعد الحفاظ على مكان عمل آمن وصحي ومسؤول بيئياً أمراً اختيارياً — بل ضرورة تجارية. يُتوقع من المؤسسات في التصنيع والبناء والأدوية والخدمات اللوجستية والنفط والغاز وقطاعات أخرى الامتثال للوائح البيئة والصحة والسلامة لحماية الموظفين والمجتمعات والبيئة.",
  "EHS compliance is not just about meeting legal requirements; it is about creating a culture of safety, reducing operational risks, and ensuring long-term business sustainability.":
    "الامتثال للصحة والسلامة والبيئة ليس مجرد تلبية للمتطلبات القانونية؛ بل يتعلق ببناء ثقافة سلامة وتقليل المخاطر التشغيلية وضمان استدامة الأعمال على المدى الطويل.",
  "With digital solutions like EHSWatch, organizations can streamline compliance management, identify workplace hazards proactively, and improve overall safety performance.":
    "باستخدام حلول رقمية مثل EHSWatch، يمكن للمؤسسات تبسيط إدارة الامتثال وتحديد مخاطر مكان العمل بشكل استباقي وتحسين أداء السلامة العام.",
  "What is EHS Compliance?": "ما هو الامتثال للصحة والسلامة والبيئة؟",
  "EHS Compliance refers to an organization's adherence to environmental, health, and safety laws, regulations, standards, and internal policies designed to protect people, property, and the environment.":
    "يشير الامتثال للصحة والسلامة والبيئة إلى التزام المؤسسة بالقوانين واللوائح والمعايير والسياسات الداخلية البيئية والصحية والسلامية المصممة لحماية الأشخاص والممتلكات والبيئة.",
  "1. Environmental Compliance": "1. الامتثال البيئي",
  "Environmental regulations focus on reducing an organization's impact on the environment. This includes:":
    "تركز اللوائح البيئية على تقليل تأثير المؤسسة على البيئة. ويشمل ذلك:",
  "Waste management": "إدارة النفايات",
  "Air and water pollution control": "التحكم في تلوث الهواء والماء",
  "Hazardous material handling": "التعامل مع المواد الخطرة",
  "Energy efficiency initiatives": "مبادرات كفاءة الطاقة",
  "Environmental reporting and audits": "التقارير والتدقيقات البيئية",
  "2. Health Compliance": "2. الامتثال الصحي",
  "Health compliance ensures employee well-being by addressing:": "يضمن الامتثال الصحي رفاهية الموظفين من خلال معالجة:",
  "Occupational health risks": "مخاطر الصحة المهنية",
  "Exposure to hazardous substances": "التعرض للمواد الخطرة",
  "Ergonomic assessments": "تقييمات بيئة العمل",
  "Employee wellness programs": "برامج رفاهية الموظفين",
  "Health monitoring and medical surveillance": "المراقبة الصحية والإشراف الطبي",
  "3. Safety Compliance": "3. الامتثال للسلامة",
  "Safety compliance aims to prevent workplace accidents and injuries through:":
    "يهدف الامتثال للسلامة إلى منع حوادث وإصابات مكان العمل من خلال:",
  "Hazard identification and risk assessment": "تحديد المخاطر وتقييمها",
  "Incident reporting and investigation": "الإبلاغ عن الحوادث والتحقيق فيها",
  "Safety training and awareness programs": "برامج التدريب والتوعية بالسلامة",
  "Personal Protective Equipment (PPE) management": "إدارة معدات الحماية الشخصية",
  "Emergency preparedness and response planning": "التخطيط للاستعداد والاستجابة للطوارئ",
  "Why Do Businesses and Industries Need EHS Compliance?": "لماذا تحتاج الشركات والصناعات إلى الامتثال للصحة والسلامة والبيئة؟",
  "1. Protect Employee Health and Safety": "1. حماية صحة وسلامة الموظفين",
  "Employees are the backbone of every organization. A safe workplace reduces accidents, injuries, illnesses, and fatalities while improving employee morale and productivity.":
    "الموظفون هم العمود الفقري لأي مؤسسة. يقلل مكان العمل الآمن من الحوادث والإصابات والأمراض والوفيات مع تحسين معنويات الموظفين وإنتاجيتهم.",
  "Organizations that prioritize EHS compliance demonstrate their commitment to workforce well-being.":
    "تُظهر المؤسسات التي تُولي الأولوية للامتثال للصحة والسلامة والبيئة التزامها برفاهية القوى العاملة.",
  "2. Meet Legal and Regulatory Requirements": "2. تلبية المتطلبات القانونية والتنظيمية",
  "Governments and regulatory authorities have established strict EHS regulations to protect workers and the environment.":
    "وضعت الحكومات والجهات التنظيمية لوائح صارمة للصحة والسلامة والبيئة لحماية العمال والبيئة.",
  "Non-compliance can result in:": "يمكن أن يؤدي عدم الامتثال إلى:",
  "Heavy fines and penalties": "غرامات وعقوبات باهظة",
  "Legal action": "إجراءات قانونية",
  "Business interruptions": "توقف الأعمال",
  "License suspension": "تعليق التراخيص",
  "Reputational damage": "الإضرار بالسمعة",
  "Maintaining compliance helps organizations avoid these risks while ensuring smooth operations.":
    "يساعد الحفاظ على الامتثال المؤسسات على تجنب هذه المخاطر مع ضمان سير العمليات بسلاسة.",
  "3. Reduce Workplace Incidents": "3. تقليل حوادث مكان العمل",
  "Many workplace incidents occur because hazards go unnoticed or are not addressed promptly.":
    "تقع العديد من حوادث مكان العمل لأن المخاطر تمر دون ملاحظة أو لا تُعالَج بسرعة.",
  "An effective EHS compliance program helps organizations:": "يساعد برنامج امتثال فعال للصحة والسلامة والبيئة المؤسسات على:",
  "Identify hazards early": "تحديد المخاطر مبكراً",
  "Conduct risk assessments": "إجراء تقييمات المخاطر",
  "Implement corrective actions": "تنفيذ الإجراءات التصحيحية",
  "Prevent accidents before they occur": "منع الحوادث قبل وقوعها",
  "4. Improve Operational Efficiency": "4. تحسين الكفاءة التشغيلية",
  "A safe and compliant workplace experiences fewer disruptions caused by accidents, equipment damage, investigations, and downtime.":
    "يشهد مكان العمل الآمن والملتزم اضطرابات أقل ناتجة عن الحوادث وتلف المعدات والتحقيقات وتوقف العمل.",
  "This leads to:": "يؤدي هذا إلى:",
  "Higher productivity": "إنتاجية أعلى",
  "Reduced operational costs": "تكاليف تشغيلية أقل",
  "Better resource utilization": "استخدام أفضل للموارد",
  "Improved business continuity": "استمرارية أعمال محسّنة",
  "5. Enhance Corporate Reputation": "5. تعزيز سمعة الشركة",
  "Customers, investors, employees, and stakeholders increasingly expect businesses to operate responsibly.":
    "يتوقع العملاء والمستثمرون والموظفون وأصحاب المصلحة بشكل متزايد أن تعمل الشركات بمسؤولية.",
  "Organizations with strong EHS practices are viewed as:": "يُنظر إلى المؤسسات ذات الممارسات القوية للصحة والسلامة والبيئة على أنها:",
  "Reliable": "موثوقة",
  "Responsible": "مسؤولة",
  "Sustainable": "مستدامة",
  "Employee-focused": "تُركّز على الموظفين",
  "A strong safety culture can significantly enhance brand reputation and stakeholder trust.":
    "يمكن لثقافة السلامة القوية أن تعزز بشكل كبير سمعة العلامة التجارية وثقة أصحاب المصلحة.",
  "6. Support Sustainability Goals": "6. دعم أهداف الاستدامة",
  "Environmental compliance plays a critical role in achieving sustainability objectives.":
    "يلعب الامتثال البيئي دوراً حاسماً في تحقيق أهداف الاستدامة.",
  "Businesses can reduce their environmental footprint through:": "يمكن للشركات تقليل بصمتها البيئية من خلال:",
  "Responsible waste management": "إدارة نفايات مسؤولة",
  "Pollution prevention": "الوقاية من التلوث",
  "Resource conservation": "الحفاظ على الموارد",
  "Sustainable operations": "عمليات مستدامة",
  "This contributes to long-term business growth while supporting environmental stewardship.":
    "يساهم هذا في نمو الأعمال على المدى الطويل مع دعم الإشراف البيئي.",
  "Common EHS Compliance Challenges": "التحديات الشائعة للامتثال للصحة والسلامة والبيئة",
  "Many organizations still rely on manual processes, spreadsheets, and paper-based systems, making compliance management difficult.":
    "لا تزال العديد من المؤسسات تعتمد على العمليات اليدوية وجداول البيانات والأنظمة الورقية، مما يجعل إدارة الامتثال صعبة.",
  "Delayed hazard reporting": "الإبلاغ المتأخر عن المخاطر",
  "Incomplete safety records": "سجلات سلامة غير مكتملة",
  "Missed inspections and audits": "تفتيشات وتدقيقات فائتة",
  "Poor corrective action tracking": "تتبع ضعيف للإجراءات التصحيحية",
  "Compliance documentation issues": "مشكلات في توثيق الامتثال",
  "These challenges can increase compliance risks and hinder safety performance.":
    "يمكن أن تزيد هذه التحديات مخاطر الامتثال وتعيق أداء السلامة.",
  "How EHSWatch Helps Organizations Stay Compliant": "كيف تساعد EHSWatch المؤسسات على البقاء ممتثلة",
  "EHSWatch is an intelligent workplace safety and compliance management platform designed to simplify EHS processes and strengthen safety cultures.":
    "EHSWatch منصة ذكية لإدارة سلامة مكان العمل والامتثال مصممة لتبسيط عمليات الصحة والسلامة والبيئة وتعزيز ثقافات السلامة.",
  "Key Benefits of EHSWatch": "الفوائد الرئيسية لـ EHSWatch",
  "Real-Time Hazard Reporting - Enable employees to report hazards instantly using digital tools, ensuring faster response and corrective action.":
    "الإبلاغ الفوري عن المخاطر - تمكين الموظفين من الإبلاغ عن المخاطر فوراً باستخدام أدوات رقمية، بما يضمن استجابة وإجراءً تصحيحياً أسرع.",
  "Incident Management - Capture, investigate, and track workplace incidents from a centralized platform.":
    "إدارة الحوادث - تسجيل حوادث مكان العمل والتحقيق فيها وتتبعها من منصة مركزية.",
  "Compliance Monitoring - Monitor regulatory requirements, inspections, and corrective actions to ensure ongoing compliance.":
    "مراقبة الامتثال - مراقبة المتطلبات التنظيمية والتفتيشات والإجراءات التصحيحية لضمان استمرار الامتثال.",
  "Safety Audits and Inspections - Digitize audits and inspections to improve accuracy, accountability, and efficiency.":
    "تدقيقات وتفتيشات السلامة - رقمنة التدقيقات والتفتيشات لتحسين الدقة والمساءلة والكفاءة.",
  "Data-Driven Insights - Leverage analytics and dashboards to identify trends, evaluate risks, and make informed decisions.":
    "رؤى مبنية على البيانات - الاستفادة من التحليلات ولوحات المعلومات لتحديد الاتجاهات وتقييم المخاطر واتخاذ قرارات مستنيرة.",
  "Improved Workplace Safety Culture - Empower employees to actively participate in safety initiatives and hazard identification.":
    "ثقافة سلامة مكان عمل محسّنة - تمكين الموظفين من المشاركة الفعالة في مبادرات السلامة وتحديد المخاطر.",
  "The Future of EHS Compliance": "مستقبل الامتثال للصحة والسلامة والبيئة",
  "As industries continue to embrace digital transformation, EHS compliance is evolving from reactive management to proactive risk prevention.":
    "مع استمرار الصناعات في تبني التحول الرقمي، يتطور الامتثال للصحة والسلامة والبيئة من الإدارة التفاعلية إلى الوقاية الاستباقية من المخاطر.",
  "Technologies such as Artificial Intelligence (AI), predictive analytics, mobile reporting, and automated compliance tracking are helping organizations identify potential risks before incidents occur.":
    "تساعد تقنيات مثل الذكاء الاصطناعي والتحليلات التنبؤية والإبلاغ عبر الجوال وتتبع الامتثال الآلي المؤسسات على تحديد المخاطر المحتملة قبل وقوع الحوادث.",
  "Modern EHS platforms like EHSWatch enable businesses to move beyond basic compliance and build safer, smarter, and more resilient workplaces.":
    "تُمكّن منصات الصحة والسلامة والبيئة الحديثة مثل EHSWatch الشركات من تجاوز الامتثال الأساسي وبناء أماكن عمل أكثر أماناً وذكاءً ومرونة.",
  "EHS compliance is essential for protecting employees, meeting regulatory requirements, reducing risks, and ensuring sustainable business growth. Organizations that invest in effective EHS programs not only avoid legal and financial consequences but also create safer and more productive workplaces.":
    "الامتثال للصحة والسلامة والبيئة ضروري لحماية الموظفين وتلبية المتطلبات التنظيمية وتقليل المخاطر وضمان نمو مستدام للأعمال. لا تتجنب المؤسسات التي تستثمر في برامج فعالة للصحة والسلامة والبيئة العواقب القانونية والمالية فحسب، بل تُنشئ أيضاً أماكن عمل أكثر أماناً وإنتاجية.",
  "By leveraging digital solutions like EHSWatch, businesses can simplify compliance management, proactively identify hazards, and foster a culture of continuous safety improvement.":
    "من خلال الاستفادة من حلول رقمية مثل EHSWatch، يمكن للشركات تبسيط إدارة الامتثال وتحديد المخاطر بشكل استباقي وتعزيز ثقافة التحسين المستمر للسلامة.",
  "In a world where workplace safety and sustainability are increasingly important, EHS compliance is not just a requirement-it is a strategic advantage.":
    "في عالم تزداد فيه أهمية سلامة مكان العمل والاستدامة، لا يُعد الامتثال للصحة والسلامة والبيئة مجرد متطلب — بل ميزة استراتيجية.",

  // ── /blog/impact-of-ai-in-industrial-safety ───────────────────────────────
  "Impact of AI in Industrial Safety: Transforming Workplace Safety Through Smart Technology":
    "تأثير الذكاء الاصطناعي على السلامة الصناعية: تحويل سلامة مكان العمل عبر التقنية الذكية",
  "Industrial safety has always been a top priority for organizations operating in manufacturing, construction, oil and gas, mining, and other high-risk industries. Traditional safety practices, while effective, often rely on manual inspections, paper-based reporting, and reactive approaches to incident management.":
    "كانت السلامة الصناعية دائماً أولوية قصوى للمؤسسات العاملة في التصنيع والبناء والنفط والغاز والتعدين وغيرها من الصناعات عالية الخطورة. وبينما تكون ممارسات السلامة التقليدية فعالة، إلا أنها غالباً ما تعتمد على التفتيش اليدوي والإبلاغ الورقي والنهج التفاعلي في إدارة الحوادث.",
  "Today, Artificial Intelligence (AI) is changing the way organizations identify, prevent, and respond to workplace hazards. By analyzing large volumes of data, detecting risks in real time, and supporting informed decision-making, AI is helping industries create safer and more efficient work environments.":
    "اليوم، يغيّر الذكاء الاصطناعي طريقة تحديد المؤسسات لمخاطر مكان العمل والوقاية منها والاستجابة لها. من خلال تحليل كميات كبيرة من البيانات واكتشاف المخاطر في الوقت الفعلي ودعم اتخاذ قرارات مستنيرة، يساعد الذكاء الاصطناعي الصناعات على إنشاء بيئات عمل أكثر أماناً وكفاءة.",
  "This article explores the impact of AI on industrial safety and how businesses can leverage this technology to reduce risks, improve compliance, and protect their workforce. What is AI in Industrial Safety?":
    "تستكشف هذه المقالة تأثير الذكاء الاصطناعي على السلامة الصناعية وكيف يمكن للشركات الاستفادة من هذه التقنية لتقليل المخاطر وتحسين الامتثال وحماية قوتها العاملة. ما هو الذكاء الاصطناعي في السلامة الصناعية؟",
  "Artificial Intelligence refers to computer systems that can perform tasks requiring human intelligence, such as learning, analyzing data, recognizing patterns, and making predictions.":
    "يشير الذكاء الاصطناعي إلى الأنظمة الحاسوبية القادرة على أداء مهام تتطلب ذكاءً بشرياً، مثل التعلم وتحليل البيانات والتعرف على الأنماط والتنبؤ.",
  "In industrial safety, AI is used to:": "في السلامة الصناعية، يُستخدم الذكاء الاصطناعي من أجل:",
  "Monitor workplace conditions in real time": "مراقبة ظروف مكان العمل في الوقت الفعلي",
  "Identify potential hazards before incidents occur": "تحديد المخاطر المحتملة قبل وقوع الحوادث",
  "Analyze safety data and trends": "تحليل بيانات واتجاهات السلامة",
  "Automate safety reporting and inspections": "أتمتة الإبلاغ والتفتيش المتعلقين بالسلامة",
  "Improve emergency response planning": "تحسين التخطيط للاستجابة للطوارئ",
  "By turning safety data into actionable insights, AI helps organizations move from reactive safety management to proactive risk prevention.":
    "من خلال تحويل بيانات السلامة إلى رؤى قابلة للتنفيذ، يساعد الذكاء الاصطناعي المؤسسات على الانتقال من إدارة السلامة التفاعلية إلى الوقاية الاستباقية من المخاطر.",
  "Key Applications of AI in Industrial Safety": "التطبيقات الرئيسية للذكاء الاصطناعي في السلامة الصناعية",
  "1. Predictive Risk Analysis": "1. تحليل المخاطر التنبؤي",
  "One of the most valuable contributions of AI is its ability to predict potential safety risks before they become incidents.":
    "من أهم مساهمات الذكاء الاصطناعي قدرته على التنبؤ بمخاطر السلامة المحتملة قبل أن تتحول إلى حوادث.",
  "AI systems analyze data from:": "تحلل أنظمة الذكاء الاصطناعي البيانات من:",
  "Previous incidents": "الحوادث السابقة",
  "Near-miss reports": "تقارير الحوادث الوشيكة",
  "Equipment performance records": "سجلات أداء المعدات",
  "Environmental conditions": "الظروف البيئية",
  "Employee safety observations": "ملاحظات سلامة الموظفين",
  "By identifying patterns and trends, AI can alert safety managers to emerging risks, allowing corrective actions to be taken before accidents occur.":
    "من خلال تحديد الأنماط والاتجاهات، يمكن للذكاء الاصطناعي تنبيه مديري السلامة إلى المخاطر الناشئة، مما يتيح اتخاذ إجراءات تصحيحية قبل وقوع الحوادث.",
  "2. Real-Time Hazard Detection": "2. الكشف الفوري عن المخاطر",
  "AI-powered cameras and sensors can continuously monitor workplaces and identify unsafe conditions instantly.":
    "يمكن للكاميرات والمستشعرات المدعومة بالذكاء الاصطناعي مراقبة أماكن العمل باستمرار وتحديد الظروف غير الآمنة فوراً.",
  "Examples include:": "تشمل الأمثلة:",
  "Detecting workers not wearing PPE": "اكتشاف العمال الذين لا يرتدون معدات الحماية الشخصية",
  "Identifying unauthorized entry into restricted areas": "تحديد الدخول غير المصرح به إلى المناطق المحظورة",
  "Monitoring unsafe worker behavior": "مراقبة سلوك العمال غير الآمن",
  "Detecting fire, smoke, or gas leaks": "اكتشاف الحرائق أو الدخان أو تسرب الغاز",
  "Real-time alerts enable organizations to address hazards immediately and prevent serious incidents.":
    "تتيح التنبيهات الفورية للمؤسسات معالجة المخاطر فوراً ومنع الحوادث الجسيمة.",
  "3. Smart Video Surveillance": "3. المراقبة الفيديوية الذكية",
  "Modern AI-enabled surveillance systems go beyond recording footage.": "تتجاوز أنظمة المراقبة الحديثة المدعومة بالذكاء الاصطناعي مجرد تسجيل اللقطات.",
  "These systems can:": "يمكن لهذه الأنظمة:",
  "Recognize safety violations": "التعرف على مخالفات السلامة",
  "Monitor worker movements": "مراقبة تحركات العمال",
  "Detect slips, trips, and falls": "اكتشاف الانزلاقات والتعثرات والسقوط",
  "Identify unsafe equipment operation": "تحديد تشغيل المعدات غير الآمن",
  "This allows safety teams to focus on prevention rather than reviewing hours of recorded video after an incident occurs.":
    "يتيح هذا لفرق السلامة التركيز على الوقاية بدلاً من مراجعة ساعات من الفيديو المسجل بعد وقوع الحادث.",
  "4. Automated Incident Reporting": "4. الإبلاغ الآلي عن الحوادث",
  "Manual incident reporting can be time-consuming and prone to errors.": "يمكن أن يكون الإبلاغ اليدوي عن الحوادث مستهلكاً للوقت وعرضة للأخطاء.",
  "AI-powered safety platforms streamline the process by:": "تبسّط منصات السلامة المدعومة بالذكاء الاصطناعي العملية من خلال:",
  "Capturing incident details automatically": "التقاط تفاصيل الحادث تلقائياً",
  "Categorizing incidents": "تصنيف الحوادث",
  "Suggesting root causes": "اقتراح الأسباب الجذرية",
  "Generating reports instantly": "إنشاء التقارير فوراً",
  "This improves reporting accuracy while reducing administrative workload.": "يحسّن هذا دقة الإبلاغ مع تقليل عبء العمل الإداري.",
  "5. Equipment Monitoring and Predictive Maintenance": "5. مراقبة المعدات والصيانة التنبؤية",
  "Equipment failure is a major cause of workplace accidents.": "يُعد عطل المعدات سبباً رئيسياً لحوادث مكان العمل.",
  "AI continuously monitors machinery performance and identifies signs of wear, malfunction, or abnormal behavior.":
    "يراقب الذكاء الاصطناعي أداء الآلات باستمرار ويحدد علامات التآكل أو العطل أو السلوك غير الطبيعي.",
  "Benefits include:": "تشمل الفوائد:",
  "Reduced equipment downtime": "تقليل توقف المعدات",
  "Prevention of unexpected failures": "منع الأعطال غير المتوقعة",
  "Improved worker safety": "تحسين سلامة العمال",
  "Lower maintenance costs": "تكاليف صيانة أقل",
  "Predictive maintenance helps organizations fix issues before they become safety hazards.":
    "تساعد الصيانة التنبؤية المؤسسات على إصلاح المشكلات قبل أن تتحول إلى مخاطر سلامة.",
  "6. Enhanced Safety Training": "6. تدريب سلامة محسّن",
  "AI is transforming employee training through personalized learning experiences.": "يعيد الذكاء الاصطناعي تشكيل تدريب الموظفين عبر تجارب تعلم مخصصة.",
  "AI-based training platforms can:": "يمكن لمنصات التدريب المعتمدة على الذكاء الاصطناعي:",
  "Assess employee knowledge levels": "تقييم مستويات معرفة الموظفين",
  "Identify skill gaps": "تحديد فجوات المهارات",
  "Recommend targeted safety training": "التوصية بتدريب سلامة مستهدف",
  "Track training effectiveness": "تتبع فعالية التدريب",
  "Some organizations are also using AI-powered virtual simulations to train workers for emergency situations without exposing them to real-world risks.":
    "تستخدم بعض المؤسسات أيضاً محاكاة افتراضية مدعومة بالذكاء الاصطناعي لتدريب العمال على حالات الطوارئ دون تعريضهم لمخاطر العالم الحقيقي.",
  "Benefits of AI in Industrial Safety": "فوائد الذكاء الاصطناعي في السلامة الصناعية",
  "1. Improved Hazard Prevention": "1. وقاية محسّنة من المخاطر",
  "AI helps identify risks before incidents happen, reducing workplace accidents and injuries.":
    "يساعد الذكاء الاصطناعي على تحديد المخاطر قبل وقوع الحوادث، مما يقلل حوادث وإصابات مكان العمل.",
  "2. Faster Decision-Making": "2. اتخاذ قرارات أسرع",
  "Real-time data and intelligent insights enable safety managers to make quicker and more informed decisions.":
    "تتيح البيانات الفورية والرؤى الذكية لمديري السلامة اتخاذ قرارات أسرع وأكثر استنارة.",
  "3. Increased Compliance": "3. امتثال متزايد",
  "AI systems can automatically track safety activities, inspections, and documentation, helping organizations maintain regulatory compliance.":
    "يمكن لأنظمة الذكاء الاصطناعي تتبع أنشطة السلامة والتفتيشات والتوثيق تلقائياً، مما يساعد المؤسسات على الحفاظ على الامتثال التنظيمي.",
  "4. Better Resource Utilization": "4. استخدام أفضل للموارد",
  "Automation reduces manual tasks, allowing safety professionals to focus on high-value activities such as risk management and employee engagement.":
    "تقلل الأتمتة المهام اليدوية، مما يتيح لمتخصصي السلامة التركيز على الأنشطة عالية القيمة مثل إدارة المخاطر وإشراك الموظفين.",
  "5. Enhanced Workplace Culture": "5. ثقافة مكان عمل محسّنة",
  "When employees see that safety is actively monitored and supported through technology, they are more likely to participate in safety initiatives and follow best practices.":
    "عندما يرى الموظفون أن السلامة تُراقَب وتُدعَم بنشاط من خلال التقنية، يصبحون أكثر ميلاً للمشاركة في مبادرات السلامة واتباع أفضل الممارسات.",
  "Challenges of Implementing AI in Safety Management": "تحديات تطبيق الذكاء الاصطناعي في إدارة السلامة",
  "While AI offers significant benefits, organizations should also consider potential challenges:":
    "بينما يقدم الذكاء الاصطناعي فوائد كبيرة، يجب على المؤسسات أيضاً مراعاة التحديات المحتملة:",
  "1. Data Quality Requirements": "1. متطلبات جودة البيانات",
  "AI systems rely on accurate and complete data. Poor-quality data can lead to inaccurate predictions and recommendations.":
    "تعتمد أنظمة الذكاء الاصطناعي على بيانات دقيقة وكاملة. يمكن أن تؤدي البيانات ضعيفة الجودة إلى تنبؤات وتوصيات غير دقيقة.",
  "2. Initial Investment Costs": "2. تكاليف الاستثمار الأولية",
  "Implementing AI technology may require investments in software, sensors, cameras, and employee training.":
    "قد يتطلب تطبيق تقنية الذكاء الاصطناعي استثمارات في البرمجيات والمستشعرات والكاميرات وتدريب الموظفين.",
  "3. Employee Acceptance": "3. قبول الموظفين",
  "Workers may initially have concerns about increased monitoring. Transparent communication is essential to build trust and encourage adoption.":
    "قد يكون لدى العمال في البداية مخاوف بشأن زيادة المراقبة. التواصل الشفاف ضروري لبناء الثقة وتشجيع التبني.",
  "4. Cybersecurity Risks": "4. مخاطر الأمن السيبراني",
  "Connected AI systems must be protected against cyber threats to ensure the security of sensitive safety data.":
    "يجب حماية أنظمة الذكاء الاصطناعي المتصلة من التهديدات السيبرانية لضمان أمان بيانات السلامة الحساسة.",
  "The Future of AI in Industrial Safety": "مستقبل الذكاء الاصطناعي في السلامة الصناعية",
  "As AI technology continues to evolve, its role in industrial safety will expand significantly.":
    "مع استمرار تطور تقنية الذكاء الاصطناعي، سيتوسع دورها في السلامة الصناعية بشكل كبير.",
  "Future developments may include:": "قد تشمل التطورات المستقبلية:",
  "Autonomous safety inspections": "تفتيشات سلامة مستقلة",
  "Advanced wearable safety devices": "أجهزة سلامة قابلة للارتداء متقدمة",
  "AI-powered digital safety assistants": "مساعدون رقميون للسلامة مدعومون بالذكاء الاصطناعي",
  "Predictive emergency response systems": "أنظمة استجابة تنبؤية للطوارئ",
  "Integration with IoT and smart factories": "التكامل مع إنترنت الأشياء والمصانع الذكية",
  "Organizations that embrace AI today will be better positioned to create safer, more resilient workplaces in the future.":
    "ستكون المؤسسات التي تتبنى الذكاء الاصطناعي اليوم في وضع أفضل لإنشاء أماكن عمل أكثر أماناً ومرونة في المستقبل.",
  "Artificial Intelligence is revolutionizing industrial safety by helping organizations identify risks earlier, respond faster, and make smarter safety decisions. From predictive analytics and real-time hazard detection to automated reporting and intelligent training, AI is enabling a proactive approach to workplace safety.":
    "يُحدث الذكاء الاصطناعي ثورة في السلامة الصناعية من خلال مساعدة المؤسسات على تحديد المخاطر مبكراً والاستجابة بشكل أسرع واتخاذ قرارات سلامة أذكى. من التحليلات التنبؤية والكشف الفوري عن المخاطر إلى الإبلاغ الآلي والتدريب الذكي، يُمكّن الذكاء الاصطناعي نهجاً استباقياً لسلامة مكان العمل.",
  "While successful implementation requires proper planning, quality data, and employee engagement, the benefits far outweigh the challenges. As industries continue their digital transformation journey, AI will play a critical role in building safer workplaces, protecting employees, and improving operational efficiency.":
    "بينما يتطلب التطبيق الناجح تخطيطاً سليماً وبيانات عالية الجودة ومشاركة الموظفين، فإن الفوائد تفوق التحديات بكثير. مع استمرار الصناعات في رحلة التحول الرقمي، سيلعب الذكاء الاصطناعي دوراً حاسماً في بناء أماكن عمل أكثر أماناً وحماية الموظفين وتحسين الكفاءة التشغيلية.",
  "Investing in AI-powered safety solutions is no longer just an innovation-it's becoming a necessity for organizations committed to creating a safer and smarter future.":
    "لم يعد الاستثمار في حلول السلامة المدعومة بالذكاء الاصطناعي مجرد ابتكار — بل أصبح ضرورة للمؤسسات الملتزمة بخلق مستقبل أكثر أماناً وذكاءً.",

  // ── /blog/encouraging-hazard-observation-reporting ────────────────────────
  "Encouraging Hazard and Observation Reporting for a Safer Workplace":
    "تشجيع الإبلاغ عن المخاطر والملاحظات من أجل مكان عمل أكثر أماناً",
  "Creating a safe and healthy workplace requires more than compliance with safety regulations-it requires active participation from employees at every level. One of the most effective ways to prevent workplace incidents is by encouraging employees to report hazards, unsafe conditions, near misses, and safety observations before they result in accidents or injuries.":
    "يتطلب إنشاء مكان عمل آمن وصحي أكثر من مجرد الامتثال للوائح السلامة — بل يتطلب مشاركة فعالة من الموظفين على كل المستويات. من أكثر الطرق فعالية لمنع حوادث مكان العمل تشجيع الموظفين على الإبلاغ عن المخاطر والظروف غير الآمنة والحوادث الوشيكة وملاحظات السلامة قبل أن تؤدي إلى حوادث أو إصابات.",
  "An effective hazard and observation reporting program empowers employees to identify risks, improve safety awareness, and contribute to a proactive safety culture. Organizations that prioritize reporting can reduce workplace incidents, strengthen compliance, and create a safer environment for everyone.":
    "يمكّن برنامج فعال للإبلاغ عن المخاطر والملاحظات الموظفين من تحديد المخاطر وتحسين الوعي بالسلامة والمساهمة في ثقافة سلامة استباقية. يمكن للمؤسسات التي تُولي الأولوية للإبلاغ تقليل حوادث مكان العمل وتعزيز الامتثال وإنشاء بيئة أكثر أماناً للجميع.",
  "Why Hazard and Observation Reporting Matters": "لماذا يهم الإبلاغ عن المخاطر والملاحظات",
  "Hazard and observation reporting is a critical component of any Environmental, Health, and Safety (EHS) program. It enables organizations to identify potential risks early, take preventive action, and continuously improve workplace safety performance.":
    "يُعد الإبلاغ عن المخاطر والملاحظات عنصراً حاسماً في أي برنامج للبيئة والصحة والسلامة. فهو يمكّن المؤسسات من تحديد المخاطر المحتملة مبكراً واتخاذ إجراءات وقائية وتحسين أداء سلامة مكان العمل باستمرار.",
  "Benefits of hazard reporting include:": "تشمل فوائد الإبلاغ عن المخاطر:",
  "Early identification of workplace hazards": "التحديد المبكر لمخاطر مكان العمل",
  "Prevention of accidents and injuries": "الوقاية من الحوادث والإصابات",
  "Improved employee engagement in safety programs": "تحسين مشاركة الموظفين في برامج السلامة",
  "Enhanced regulatory compliance": "تعزيز الامتثال التنظيمي",
  "Stronger safety culture across the organization": "ثقافة سلامة أقوى عبر المؤسسة",
  "Effective Strategies to Encourage Hazard and Observation Reporting": "استراتيجيات فعالة لتشجيع الإبلاغ عن المخاطر والملاحظات",
  "1. Communicate the Importance of Reporting": "1. توضيح أهمية الإبلاغ",
  "Employees are more likely to report hazards when they understand the value of their contributions. Organizations should clearly communicate how hazard and observation reporting helps prevent incidents, protects workers, and improves overall workplace safety.":
    "يكون الموظفون أكثر ميلاً للإبلاغ عن المخاطر عندما يفهمون قيمة مساهماتهم. يجب على المؤسسات توضيح كيف يساعد الإبلاغ عن المخاطر والملاحظات في منع الحوادث وحماية العمال وتحسين سلامة مكان العمل بشكل عام.",
  "Key actions include:": "تشمل الإجراءات الرئيسية:",
  "Sharing real-world examples of incident prevention": "مشاركة أمثلة واقعية للوقاية من الحوادث",
  "Discussing the benefits of proactive reporting": "مناقشة فوائد الإبلاغ الاستباقي",
  "Reinforcing safety messages through meetings and communications": "تعزيز رسائل السلامة عبر الاجتماعات والاتصالات",
  "Demonstrating management commitment to workplace safety": "إظهار التزام الإدارة بسلامة مكان العمل",
  "2. Provide Comprehensive Training": "2. توفير تدريب شامل",
  "Employees should be trained to recognize potential hazards and understand the reporting process. Regular training ensures that workers have the knowledge and confidence needed to identify and report safety concerns effectively.":
    "يجب تدريب الموظفين على التعرف على المخاطر المحتملة وفهم عملية الإبلاغ. يضمن التدريب المنتظم أن يكون لدى العمال المعرفة والثقة اللازمتين لتحديد مخاوف السلامة والإبلاغ عنها بفعالية.",
  "Training programs should cover:": "يجب أن تغطي برامج التدريب:",
  "Hazard identification techniques": "تقنيات تحديد المخاطر",
  "Near-miss reporting procedures": "إجراءات الإبلاغ عن الحوادث الوشيكة",
  "Observation reporting best practices": "أفضل ممارسات الإبلاغ عن الملاحظات",
  "Workplace safety responsibilities": "مسؤوليات سلامة مكان العمل",
  "Regular refresher training helps maintain awareness and encourages ongoing participation.":
    "يساعد التدريب التنشيطي المنتظم في الحفاظ على الوعي ويشجع المشاركة المستمرة.",
  "3. Implement an Easy-to-Use Reporting System": "3. تطبيق نظام إبلاغ سهل الاستخدام",
  "A complicated reporting process can discourage employees from reporting hazards. Organizations should provide a simple, accessible, and user-friendly reporting system that allows employees to submit reports quickly and efficiently.":
    "يمكن لعملية إبلاغ معقدة أن تُثني الموظفين عن الإبلاغ عن المخاطر. يجب على المؤسسات توفير نظام إبلاغ بسيط وسهل الوصول وسهل الاستخدام يتيح للموظفين تقديم التقارير بسرعة وكفاءة.",
  "An effective reporting system should include:": "يجب أن يشمل نظام الإبلاغ الفعال:",
  "Mobile and desktop accessibility": "إمكانية الوصول عبر الجوال وسطح المكتب",
  "Simple reporting forms": "نماذج إبلاغ بسيطة",
  "Anonymous reporting options": "خيارات إبلاغ مجهولة",
  "Real-time submission tracking": "تتبع فوري للتقديمات",
  "Automated notifications and follow-ups": "إشعارات ومتابعات تلقائية",
  "Digital EHS software solutions can significantly improve reporting rates by making the process more convenient and transparent.":
    "يمكن لحلول برمجيات الصحة والسلامة والبيئة الرقمية تحسين معدلات الإبلاغ بشكل كبير من خلال جعل العملية أكثر ملاءمة وشفافية.",
  "4. Provide Timely Feedback": "4. تقديم ملاحظات في الوقت المناسب",
  "Employees want to know that their concerns are being taken seriously. When hazards or observations are reported, organizations should provide feedback regarding the actions taken and the status of the issue.":
    "يريد الموظفون معرفة أن مخاوفهم تُؤخذ على محمل الجد. عند الإبلاغ عن المخاطر أو الملاحظات، يجب على المؤسسات تقديم ملاحظات حول الإجراءات المتخذة وحالة المشكلة.",
  "Benefits of providing feedback include:": "تشمل فوائد تقديم الملاحظات:",
  "Increased employee trust": "زيادة ثقة الموظفين",
  "Higher reporting participation": "مشاركة أعلى في الإبلاغ",
  "Improved transparency": "شفافية محسّنة",
  "Stronger engagement in safety initiatives": "مشاركة أقوى في مبادرات السلامة",
  "When employees see positive outcomes from their reports, they are more likely to continue participating in safety programs.":
    "عندما يرى الموظفون نتائج إيجابية من تقاريرهم، يصبحون أكثر ميلاً لمواصلة المشاركة في برامج السلامة.",
  "5. Recognize and Reward Safety Participation": "5. الاعتراف بالمشاركة في السلامة ومكافأتها",
  "Recognition plays a significant role in encouraging workplace safety engagement. Organizations should acknowledge employees who actively contribute to hazard and observation reporting.":
    "يلعب التقدير دوراً مهماً في تشجيع المشاركة في سلامة مكان العمل. يجب على المؤسسات الاعتراف بالموظفين الذين يساهمون بنشاط في الإبلاغ عن المخاطر والملاحظات.",
  "Recognition strategies may include:": "قد تشمل استراتيجيات التقدير:",
  "Employee safety awards": "جوائز سلامة الموظفين",
  "Public recognition during meetings": "التقدير العلني خلال الاجتماعات",
  "Safety achievement certificates": "شهادات إنجاز السلامة",
  "Incentive and reward programs": "برامج الحوافز والمكافآت",
  "Recognizing safety contributions reinforces positive behavior and motivates others to participate.":
    "يعزز الاعتراف بمساهمات السلامة السلوك الإيجابي ويحفز الآخرين على المشاركة.",
  "6. Foster an Open and Supportive Safety Culture": "6. تعزيز ثقافة سلامة منفتحة وداعمة",
  "A positive safety culture encourages employees to report concerns without fear of blame, punishment, or retaliation. Organizations should create an environment where employees feel comfortable raising concerns and sharing suggestions for improvement.":
    "تشجع ثقافة السلامة الإيجابية الموظفين على الإبلاغ عن المخاوف دون خوف من اللوم أو العقاب أو الانتقام. يجب على المؤسسات إنشاء بيئة يشعر فيها الموظفون بالراحة عند إثارة المخاوف ومشاركة اقتراحات التحسين.",
  "To build a supportive culture:": "لبناء ثقافة داعمة:",
  "Encourage open communication": "تشجيع التواصل المفتوح",
  "Promote a non-punitive reporting approach": "تعزيز نهج إبلاغ غير عقابي",
  "Involve employees in safety discussions": "إشراك الموظفين في مناقشات السلامة",
  "Demonstrate leadership commitment to safety": "إظهار التزام القيادة بالسلامة",
  "When employees trust that their voices will be heard, reporting rates naturally increase.":
    "عندما يثق الموظفون بأن أصواتهم ستُسمع، ترتفع معدلات الإبلاغ بشكل طبيعي.",
  "The Role of EHS Software in Hazard Reporting": "دور برمجيات الصحة والسلامة والبيئة في الإبلاغ عن المخاطر",
  "Modern EHS software solutions simplify hazard and observation reporting by providing centralized platforms for capturing, tracking, and managing safety concerns. Employees can quickly report hazards through mobile devices, while managers can monitor trends, assign corrective actions, and track resolutions in real time.":
    "تبسّط حلول برمجيات الصحة والسلامة والبيئة الحديثة الإبلاغ عن المخاطر والملاحظات من خلال توفير منصات مركزية لتسجيل مخاوف السلامة وتتبعها وإدارتها. يمكن للموظفين الإبلاغ عن المخاطر بسرعة عبر الأجهزة المحمولة، بينما يمكن للمديرين مراقبة الاتجاهات وإسناد الإجراءات التصحيحية وتتبع الحلول في الوقت الفعلي.",
  "Key features include:": "تشمل الميزات الرئيسية:",
  "Mobile hazard reporting": "الإبلاغ عن المخاطر عبر الجوال",
  "Automated workflows and notifications": "سير عمل وإشعارات آلية",
  "Corrective action tracking": "تتبع الإجراءات التصحيحية",
  "Real-time dashboards and analytics": "لوحات معلومات وتحليلات فورية",
  "Centralized safety data management": "إدارة مركزية لبيانات السلامة",
  "These capabilities help organizations respond faster to risks and continuously improve workplace safety performance.":
    "تساعد هذه القدرات المؤسسات على الاستجابة بشكل أسرع للمخاطر وتحسين أداء سلامة مكان العمل باستمرار.",
  "Benefits of a Strong Hazard Reporting Program": "فوائد برنامج قوي للإبلاغ عن المخاطر",
  "Organizations that actively encourage hazard and observation reporting can achieve significant safety and operational improvements, including:":
    "يمكن للمؤسسات التي تشجع بنشاط الإبلاغ عن المخاطر والملاحظات تحقيق تحسينات كبيرة في السلامة والعمليات، بما في ذلك:",
  "Reduced workplace incidents and injuries": "تقليل حوادث وإصابات مكان العمل",
  "Improved regulatory compliance": "تحسين الامتثال التنظيمي",
  "Faster risk identification and mitigation": "تحديد المخاطر والتخفيف منها بشكل أسرع",
  "Increased employee engagement": "زيادة مشاركة الموظفين",
  "Enhanced safety performance metrics": "مقاييس أداء سلامة محسّنة",
  "Stronger organizational safety culture": "ثقافة سلامة مؤسسية أقوى",
  "Encouraging hazard and observation reporting is essential for building a proactive and effective workplace safety program. By providing training, simplifying reporting processes, recognizing employee contributions, and fostering a supportive safety culture, organizations can significantly reduce risks and prevent workplace incidents.":
    "يُعد تشجيع الإبلاغ عن المخاطر والملاحظات ضرورياً لبناء برنامج سلامة استباقي وفعال لمكان العمل. من خلال توفير التدريب وتبسيط عمليات الإبلاغ والاعتراف بمساهمات الموظفين وتعزيز ثقافة سلامة داعمة، يمكن للمؤسسات تقليل المخاطر بشكل كبير ومنع حوادث مكان العمل.",
  "With the support of modern EHS software and strong leadership commitment, businesses can create an environment where employees actively participate in identifying hazards and improving workplace safety, leading to safer, healthier, and more productive operations.":
    "بدعم من برمجيات الصحة والسلامة والبيئة الحديثة والتزام قيادي قوي، يمكن للشركات إنشاء بيئة يشارك فيها الموظفون بنشاط في تحديد المخاطر وتحسين سلامة مكان العمل، مما يؤدي إلى عمليات أكثر أماناً وصحة وإنتاجية.",

  // ── /blog/how-to-select-ehs-software-guide ────────────────────────────────
  "How to Select EHS Software: A Complete Guide for Businesses":
    "كيفية اختيار برمجيات الصحة والسلامة والبيئة: دليل كامل للشركات",
  "Choosing the right Environment, Health, and Safety (EHS) software is a critical decision that can significantly improve workplace safety, regulatory compliance, and operational efficiency. With numerous EHS solutions available in the market, selecting the best platform for your organization's unique requirements can be challenging.":
    "يُعد اختيار برمجيات البيئة والصحة والسلامة المناسبة قراراً حاسماً يمكن أن يحسّن بشكل كبير سلامة مكان العمل والامتثال التنظيمي والكفاءة التشغيلية. مع توفر العديد من حلول الصحة والسلامة والبيئة في السوق، يمكن أن يكون اختيار أفضل منصة لمتطلبات مؤسستك الفريدة أمراً صعباً.",
  "This guide explains the key factors you should consider before investing in an EHS management software solution.":
    "يشرح هذا الدليل العوامل الرئيسية التي يجب مراعاتها قبل الاستثمار في حل برمجيات لإدارة الصحة والسلامة والبيئة.",
  "Why Choosing the Right EHS Software Matters": "لماذا يهم اختيار برمجيات الصحة والسلامة والبيئة المناسبة",
  "An effective EHS software solution helps organizations:": "يساعد حل برمجيات فعال للصحة والسلامة والبيئة المؤسسات على:",
  "Improve workplace safety": "تحسين سلامة مكان العمل",
  "Reduce workplace incidents and risks": "تقليل حوادث ومخاطر مكان العمل",
  "Ensure regulatory compliance": "ضمان الامتثال التنظيمي",
  "Streamline audits and inspections": "تبسيط التدقيقات والتفتيشات",
  "Manage incidents and corrective actions": "إدارة الحوادث والإجراءات التصحيحية",
  "Track employee training": "تتبع تدريب الموظفين",
  "Generate real-time reports and analytics": "إنشاء تقارير وتحليلات فورية",
  "Selecting software that aligns with your business processes ensures long-term value and supports a proactive safety culture.":
    "يضمن اختيار برمجيات تتوافق مع عمليات أعمالك قيمة طويلة الأمد ويدعم ثقافة سلامة استباقية.",
  "1. Identify Your Organization's EHS Requirements": "1. حدّد متطلبات مؤسستك للصحة والسلامة والبيئة",
  "The first step is understanding your organization's specific Environment, Health, and Safety needs. Every business operates differently, so your software should address your operational challenges.":
    "الخطوة الأولى هي فهم احتياجات مؤسستك المحددة للبيئة والصحة والسلامة. تعمل كل شركة بشكل مختلف، لذا يجب أن تعالج برمجياتك تحدياتك التشغيلية.",
  "Consider whether you need features for:": "فكّر فيما إذا كنت تحتاج ميزات لـ:",
  "Incident and accident reporting": "الإبلاغ عن الحوادث والإصابات",
  "Hazard identification": "تحديد المخاطر",
  "Risk assessments": "تقييمات المخاطر",
  "Safety inspections and audits": "تفتيشات وتدقيقات السلامة",
  "Compliance management": "إدارة الامتثال",
  "Employee safety training": "تدريب سلامة الموظفين",
  "Environmental reporting": "الإبلاغ البيئي",
  "Corrective and preventive actions (CAPA)": "الإجراءات التصحيحية والوقائية (CAPA)",
  "Clearly identifying your requirements will help you choose software that supports your safety objectives.":
    "سيساعدك تحديد متطلباتك بوضوح على اختيار برمجيات تدعم أهداف السلامة لديك.",
  "2. Evaluate Core Features": "2. قيّم الميزات الأساسية",
  "Not all EHS software offers the same capabilities. Compare available features and ensure they align with your current and future business needs.":
    "لا تقدم كل برمجيات الصحة والسلامة والبيئة نفس القدرات. قارن الميزات المتاحة وتأكد من توافقها مع احتياجات أعمالك الحالية والمستقبلية.",
  "Essential EHS software features include:": "تشمل ميزات برمجيات الصحة والسلامة والبيئة الأساسية:",
  "Hazard Reporting": "الإبلاغ عن المخاطر",
  "Safety Audit Management": "إدارة تدقيق السلامة",
  "Inspection Checklists": "قوائم تحقق التفتيش",
  "Compliance Tracking": "تتبع الامتثال",
  "Employee Training Management": "إدارة تدريب الموظفين",
  "Environmental Performance Monitoring": "مراقبة الأداء البيئي",
  "Corrective and Preventive Action (CAPA)": "الإجراءات التصحيحية والوقائية (CAPA)",
  "Dashboard and Analytics": "لوحة معلومات وتحليلات",
  "Mobile Accessibility": "إمكانية الوصول عبر الجوال",
  "Choose a solution that can grow alongside your organization.": "اختر حلاً يمكن أن ينمو مع مؤسستك.",
  "3. Look for an Easy-to-Use Interface": "3. ابحث عن واجهة سهلة الاستخدام",
  "Even the most powerful software will not deliver results if employees find it difficult to use.":
    "حتى أقوى البرمجيات لن تحقق نتائج إذا وجد الموظفون صعوبة في استخدامها.",
  "An ideal EHS platform should provide:": "يجب أن توفر منصة الصحة والسلامة والبيئة المثالية:",
  "Simple and intuitive navigation": "تنقلاً بسيطاً وبديهياً",
  "User-friendly dashboards": "لوحات معلومات سهلة الاستخدام",
  "Quick incident reporting": "إبلاغاً سريعاً عن الحوادث",
  "Automated notifications and reminders": "إشعارات وتذكيرات تلقائية",
  "Easy report generation": "إنشاء تقارير سهلاً",
  "Mobile-friendly access": "وصولاً ملائماً للجوال",
  "A clean interface improves user adoption and increases reporting accuracy across the organization.":
    "تحسّن الواجهة النظيفة تبني المستخدمين وتزيد دقة الإبلاغ عبر المؤسسة.",
  "4. Check Integration Capabilities": "4. تحقق من قدرات التكامل",
  "Your EHS software should integrate seamlessly with your existing business systems.":
    "يجب أن تتكامل برمجيات الصحة والسلامة والبيئة لديك بسلاسة مع أنظمة أعمالك الحالية.",
  "Look for integration with:": "ابحث عن تكامل مع:",
  "HR Management Systems": "أنظمة إدارة الموارد البشرية",
  "ERP Solutions": "حلول تخطيط موارد المؤسسات",
  "Payroll Software": "برمجيات الرواتب",
  "Asset Management Systems": "أنظمة إدارة الأصول",
  "Document Management Platforms": "منصات إدارة المستندات",
  "Business Intelligence Tools": "أدوات ذكاء الأعمال",
  "Integration eliminates duplicate data entry, improves efficiency, and ensures data consistency across departments.":
    "يلغي التكامل إدخال البيانات المكرر، ويحسّن الكفاءة، ويضمن اتساق البيانات عبر الأقسام.",
  "5. Assess the Vendor's Experience and Reputation": "5. قيّم خبرة المزوّد وسمعته",
  "Choosing the right software provider is just as important as selecting the software itself.":
    "اختيار مزوّد البرمجيات المناسب لا يقل أهمية عن اختيار البرمجيات نفسها.",
  "Before making a decision:": "قبل اتخاذ القرار:",
  "Review customer testimonials": "راجع شهادات العملاء",
  "Read online reviews": "اقرأ المراجعات عبر الإنترنت",
  "Request case studies": "اطلب دراسات حالة",
  "Evaluate industry experience": "قيّم الخبرة في القطاع",
  "Ask for product demonstrations": "اطلب عروضاً توضيحية للمنتج",
  "Check implementation success stories": "تحقق من قصص نجاح التطبيق",
  "A trusted vendor with industry expertise is more likely to deliver reliable support and continuous product improvements.":
    "من المرجح أن يقدم المزوّد الموثوق ذو الخبرة القطاعية دعماً موثوقاً وتحسينات مستمرة للمنتج.",
  "6. Evaluate Customer Support": "6. قيّم دعم العملاء",
  "Reliable customer support is essential for successful implementation and long-term software adoption.":
    "دعم العملاء الموثوق ضروري للتطبيق الناجح والتبني طويل الأمد للبرمجيات.",
  "Ensure the vendor provides:": "تأكد من أن المزوّد يوفر:",
  "Quick technical support": "دعماً تقنياً سريعاً",
  "Implementation assistance": "مساعدة في التطبيق",
  "User training": "تدريب المستخدمين",
  "Knowledge base and documentation": "قاعدة معرفة وتوثيق",
  "Regular software updates": "تحديثات برمجية منتظمة",
  "Dedicated account management": "إدارة حساب مخصصة",
  "Strong customer support minimizes downtime and helps your organization maximize the value of the software.":
    "يقلل دعم العملاء القوي من وقت التوقف ويساعد مؤسستك على تعظيم قيمة البرمجيات.",
  "7. Prioritize Security and Data Privacy": "7. أعطِ الأولوية للأمان وخصوصية البيانات",
  "EHS systems store sensitive business and employee information, making data security a top priority.":
    "تخزّن أنظمة الصحة والسلامة والبيئة معلومات حساسة عن الأعمال والموظفين، مما يجعل أمان البيانات أولوية قصوى.",
  "Choose software that offers:": "اختر برمجيات توفر:",
  "Role-based access control": "التحكم في الوصول بناءً على الأدوار",
  "Data encryption": "تشفير البيانات",
  "Secure cloud infrastructure": "بنية تحتية سحابية آمنة",
  "Regular security audits": "تدقيقات أمنية منتظمة",
  "Automated backups": "نسخ احتياطية تلقائية",
  "Compliance with international security standards": "الامتثال لمعايير الأمان الدولية",
  "Robust security measures protect your organization's confidential information and ensure regulatory compliance.":
    "تحمي إجراءات الأمان القوية معلومات مؤسستك السرية وتضمن الامتثال التنظيمي.",
  "8. Consider the Total Cost of Ownership": "8. راعِ التكلفة الإجمالية للملكية",
  "The lowest-priced solution is not always the most cost-effective.": "الحل الأقل سعراً ليس دائماً الأكثر فعالية من حيث التكلفة.",
  "Evaluate the complete investment, including:": "قيّم الاستثمار الكامل، بما في ذلك:",
  "Software licensing": "ترخيص البرمجيات",
  "Implementation costs": "تكاليف التطبيق",
  "Customization": "التخصيص",
  "Employee training": "تدريب الموظفين",
  "Maintenance": "الصيانة",
  "Technical support": "الدعم التقني",
  "Future upgrades": "الترقيات المستقبلية",
  "Focus on long-term value rather than just the initial purchase price.":
    "ركّز على القيمة طويلة الأمد بدلاً من سعر الشراء الأولي فقط.",
  "Questions to Ask Before Purchasing EHS Software": "أسئلة يجب طرحها قبل شراء برمجيات الصحة والسلامة والبيئة",
  "Before finalizing your decision, ask the vendor:": "قبل إنهاء قرارك، اسأل المزوّد:",
  "Does the software meet our current and future business requirements?": "هل تلبي البرمجيات متطلبات أعمالنا الحالية والمستقبلية؟",
  "Is it scalable as our organization grows?": "هل قابلة للتوسع مع نمو مؤسستنا؟",
  "How easy is implementation?": "ما مدى سهولة التطبيق؟",
  "Is mobile access available?": "هل الوصول عبر الجوال متاح؟",
  "How secure is our data?": "ما مدى أمان بياناتنا؟",
  "What support options are included?": "ما خيارات الدعم المشمولة؟",
  "Can the software integrate with our existing systems?": "هل يمكن للبرمجيات التكامل مع أنظمتنا الحالية؟",
  "Are software updates included?": "هل التحديثات البرمجية مشمولة؟",
  "These questions will help you compare vendors more effectively.": "ستساعدك هذه الأسئلة على مقارنة المزوّدين بفعالية أكبر.",
  "Selecting the right EHS software is an investment in your organization's safety, compliance, and operational excellence. By carefully evaluating your business needs, software features, usability, integration capabilities, vendor reputation, customer support, security, and overall cost, you can choose a solution that delivers long-term value.":
    "اختيار برمجيات الصحة والسلامة والبيئة المناسبة استثمار في سلامة مؤسستك وامتثالها وتميزها التشغيلي. من خلال التقييم الدقيق لاحتياجات أعمالك وميزات البرمجيات وسهولة استخدامها وقدرات التكامل وسمعة المزوّد ودعم العملاء والأمان والتكلفة الإجمالية، يمكنك اختيار حل يحقق قيمة طويلة الأمد.",
  "A well-designed EHS management system not only helps organizations stay compliant with regulations but also promotes a safer workplace, improves employee engagement, reduces risks, and drives continuous improvement across all safety processes.":
    "لا يساعد نظام إدارة الصحة والسلامة والبيئة المصمم جيداً المؤسسات على البقاء ممتثلة للوائح فحسب، بل يعزز أيضاً مكان عمل أكثر أماناً، ويحسّن مشاركة الموظفين، ويقلل المخاطر، ويدفع التحسين المستمر عبر كل عمليات السلامة.",
  "Choosing the right EHS software today lays the foundation for a safer, smarter, and more resilient organization tomorrow.":
    "يضع اختيار برمجيات الصحة والسلامة والبيئة المناسبة اليوم الأساس لمؤسسة أكثر أماناً وذكاءً ومرونة غداً.",

  // ── /modules/* — shared template strings (identical across all 14 module
  // pages), highest leverage: each translated once here, applies everywhere.
  "See Key Features": "شاهد الميزات الرئيسية",
  "Key Features of": "الميزات الرئيسية لـ",
  "What Sets EHSWatch": "ما الذي يميز",
  "Apart": "EHSWatch",
  "Frequently Asked Questions": "الأسئلة الشائعة",
  "Get Free Trial Access": "احصل على وصول تجريبي مجاني",
  "Explore More": "استكشف المزيد",
  "EHSWatch Modules": "وحدات EHSWatch",
  "See all modules": "شاهد جميع الوحدات",

  // ── /modules/* — hero headline + "What Sets EHSWatch [X] Apart" heading,
  // FULL COMBINED STRING per module (not the split lead/span/trailing pattern
  // used elsewhere). ModuleTemplate.tsx deliberately renders these as ONE
  // plain text node (no nested span) specifically when Arabic is active —
  // an existing, intentional fix (comment cites "FE QA #17") to stop the
  // machine translator producing wrong word order from two independently-
  // translated fragments. Since there's no span once Arabic renders, only a
  // key matching the FULL sentence can ever match here.
  "See Every Risk Before It Becomes an Incident": "اكتشف كل خطر قبل أن يتحول إلى حادثة",
  "Respond Fast. Prevent More.": "استجب بسرعة. امنع المزيد.",
  "Every Worker Trained, Qualified and Current": "كل عامل مدرَّب ومؤهل ومحدَّث",
  "The Last Line of Defence, Digitised.": "خط الدفاع الأخير، بصيغة رقمية.",
  "Track, Tackle and Transform Every Non-Conformance": "تتبّع كل حالة عدم مطابقة، وعالجها، وحوّلها إلى تحسين",
  "Where Safety Commitments Become Safety Actions": "حيث تتحول التزامات السلامة إلى إجراءات سلامة فعلية",
  "Control Every Change Before It Becomes a Risk": "تحكّم في كل تغيير قبل أن يتحول إلى خطر",
  "Never Miss a Compliance Obligation Again": "لن تفوّت التزام امتثال بعد الآن",
  "Turn Every Inspection Into Actionable Safety Intelligence.": "حوّل كل عملية تفتيش إلى معلومات سلامة قابلة للتنفيذ.",
  "Control Your Critical Documents With Confidence": "تحكّم في مستنداتك الحيوية بثقة",
  "Train Like It's Real. Respond Like It's Life.": "تدرّب كأنه حقيقي. استجب كأنه حياة.",
  "Every Complaint Deserves a Clear Resolution": "كل شكوى تستحق حلاً واضحاً",
  "Plan Every Audit. Close Every Gap.": "خطّط لكل تدقيق. أغلق كل فجوة.",
  "See Risks Earlier. Act Before Incidents Happen.": "اكتشف المخاطر مبكراً. تصرف قبل وقوع الحوادث.",
  "What Sets EHSWatch Risk Assessment Apart": "ما الذي يميز تقييم المخاطر في EHSWatch",
  "What Sets EHSWatch Incident Management Apart": "ما الذي يميز إدارة الحوادث في EHSWatch",
  "What Sets EHSWatch Training Management Apart": "ما الذي يميز إدارة التدريب في EHSWatch",
  "What Sets EHSWatch Permit to Work Apart": "ما الذي يميز تصريح العمل في EHSWatch",
  "What Sets EHSWatch Non-Conformance Apart": "ما الذي يميز عدم المطابقة في EHSWatch",
  "What Sets EHSWatch Meetings Management Apart": "ما الذي يميز إدارة الاجتماعات في EHSWatch",
  "What Sets EHSWatch Management of Change Apart": "ما الذي يميز إدارة التغيير في EHSWatch",
  "What Sets EHSWatch Legal Register Apart": "ما الذي يميز السجل القانوني في EHSWatch",
  "What Sets EHSWatch Inspections Apart": "ما الذي يميز عمليات التفتيش في EHSWatch",
  "What Sets EHSWatch File Management Apart": "ما الذي يميز إدارة الملفات في EHSWatch",
  "What Sets EHSWatch Emergency Response Drills Apart": "ما الذي يميز تدريبات الاستجابة للطوارئ في EHSWatch",
  "What Sets EHSWatch Customer Complaints Apart": "ما الذي يميز شكاوى العملاء في EHSWatch",
  "What Sets EHSWatch Audit Management Apart": "ما الذي يميز إدارة التدقيق في EHSWatch",
  "What Sets EHSWatch HSE Observations Apart": "ما الذي يميز ملاحظات الصحة والسلامة والبيئة في EHSWatch",
  "Modules": "الوحدات",

  // ── /modules/risk-assessment ─────────────────────────────────────────────
  "See Every": "شاهد كل",
  "Risk": "خطر",
  "Before It Becomes an Incident": "قبل أن يتحول إلى حادثة",
  "EHSWatch Risk Assessment gives your teams the tools to get ahead of risk — identify hazards systematically, score and prioritise by probability and impact, assign and track mitigating controls, and monitor a live risk register continuously from one place.":
    "تمنح وحدة تقييم المخاطر من EHSWatch فرقك الأدوات اللازمة للاستباق في مواجهة المخاطر — تحديد المخاطر بشكل منهجي، وتقييمها وترتيب أولوياتها حسب الاحتمالية والتأثير، وإسناد ضوابط التخفيف وتتبعها، ومراقبة سجل مخاطر حي باستمرار من مكان واحد.",
  "Spot the hazard. Score the risk. Stop the incident.": "اكتشف الخطر. قيّم المخاطرة. أوقف الحادثة.",
  "Why Risk Assessment?": "لماذا تقييم المخاطر؟",
  "A risk that sits unrecorded in someone's head. An assessment buried in a spreadsheet no one has updated in months. A mitigation action assigned by email to someone who has since left. These are the gaps where preventable incidents take root — not because the hazard was invisible, but because the process to identify, document and track it was too fragmented to work.":
    "خطر يظل غير مسجَّل في ذهن أحدهم. تقييم مدفون في جدول بيانات لم يُحدَّث منذ أشهر. إجراء تخفيف أُسند عبر بريد إلكتروني لشخص غادر المؤسسة منذ ذلك الحين. هذه هي الفجوات التي تتجذر فيها الحوادث التي يمكن تجنبها — ليس لأن الخطر كان غير مرئي، بل لأن عملية تحديده وتوثيقه وتتبعه كانت مجزأة أكثر من اللازم لتعمل.",
  "EHSWatch Risk Assessment closes those gaps. Hazards are captured through a structured, configurable process, and risks are scored consistently by probability and impact — so the most serious rise to the top of the register. Mitigating controls are assigned, tracked and verified, and when an incident occurs, the linked assessment is immediately accessible to inform the investigation.":
    "تسد وحدة تقييم المخاطر من EHSWatch هذه الفجوات. يتم رصد المخاطر من خلال عملية منظمة وقابلة للتخصيص، وتُقيَّم المخاطر باستمرار حسب الاحتمالية والتأثير — بحيث تظهر الأخطر منها في مقدمة السجل. تُسند ضوابط التخفيف وتُتبع وتُتحقق منها، وعند وقوع حادثة، يكون التقييم المرتبط بها متاحاً فوراً للاستعانة به في التحقيق.",
  "See Risk Assessment in Action": "شاهد تقييم المخاطر أثناء العمل",
  "From hazard identification to verified control — all in one connected risk management workflow.":
    "من تحديد الخطر إلى التحقق من الضابط — كل ذلك ضمن سير عمل واحد متصل لإدارة المخاطر.",
  "Streamlined Hazard Identification": "تحديد مبسّط للمخاطر",
  "Capture hazards through configurable digital forms that prompt structured identification — keeping hazard capture consistent, thorough and repeatable across all sites, assets and activity types.":
    "سجّل المخاطر من خلال نماذج رقمية قابلة للتخصيص توجّه عملية تحديد منظمة — بما يحافظ على اتساق رصد المخاطر وشموليته وقابليته للتكرار عبر جميع المواقع والأصول وأنواع الأنشطة.",
  "Flexible Risk Scoring & Methodology": "تقييم مرن للمخاطر ومنهجية مرنة",
  "Score identified risks using qualitative, semi-quantitative or quantitative methodologies — fully configurable to match your organisation's existing risk framework.":
    "قيّم المخاطر المحددة باستخدام منهجيات نوعية أو شبه كمية أو كمية — قابلة للتخصيص بالكامل لتتوافق مع إطار المخاطر الحالي في مؤسستك.",
  "Risk Matrix Visualisation": "تصور مصفوفة المخاطر",
  "View the whole risk landscape through a live risk matrix that positions every identified risk by its current probability and impact score, at a glance.":
    "شاهد المشهد الكامل للمخاطر من خلال مصفوفة مخاطر حية تحدد موقع كل خطر مُحدد حسب درجة احتماليته وتأثيره الحاليين، بنظرة واحدة.",
  "Comprehensive Live Risk Register": "سجل مخاطر حي وشامل",
  "Maintain a complete, real-time register that tracks every risk, its current score, assigned controls, responsible owner and last review date — across all sites.":
    "احتفظ بسجل كامل وفوري يتتبع كل خطر ودرجته الحالية والضوابط المسندة والمسؤول المكلف وتاريخ آخر مراجعة — عبر جميع المواقع.",
  "Hierarchy of Controls Documentation": "توثيق التسلسل الهرمي للضوابط",
  "Document the controls applied to each risk using the hierarchy of controls, with every control assigned to a named owner, a review date and a verification requirement.":
    "وثّق الضوابط المطبقة على كل خطر باستخدام التسلسل الهرمي للضوابط، مع إسناد كل ضابط إلى مسؤول محدد وتاريخ مراجعة ومتطلب تحقق.",
  "Real-Time Reporting & Analytics": "تقارير وتحليلات فورية",
  "Generate risk profile reports, control effectiveness summaries, overdue action dashboards and risk trend analyses across sites, asset types, activity categories and time periods.":
    "أنشئ تقارير ملف المخاطر، وملخصات فعالية الضوابط، ولوحات معلومات الإجراءات المتأخرة، وتحليلات اتجاهات المخاطر عبر المواقع وأنواع الأصول وفئات الأنشطة والفترات الزمنية.",
  "Flexible methodologies that adapt to your organisation's existing risk framework , rather than forcing a single rigid model across all activity types.":
    "منهجيات مرنة تتكيف مع إطار المخاطر الحالي في مؤسستك، بدلاً من فرض نموذج واحد صارم على جميع أنواع الأنشطة.",
  "Standardised risk scoring that brings objectivity and consistency to how risks are prioritised across teams and sites.":
    "تقييم موحّد للمخاطر يضفي الموضوعية والاتساق على طريقة ترتيب أولويات المخاطر عبر الفرق والمواقع.",
  "Links to live incident and observation data — risk assessments are updated by what is actually happening in the field, not just by what was anticipated at the last assessment cycle.":
    "روابط ببيانات الحوادث والملاحظات الحية — تُحدَّث تقييمات المخاطر بناءً على ما يحدث فعلياً في الميدان، لا فقط بناءً على ما كان متوقعاً في دورة التقييم الأخيرة.",
  "Continuous monitoring through a live risk register turns risk assessment from a periodic compliance exercise into an ongoing operational discipline — with every risk visible, every control tracked and every review date managed.":
    "تحوّل المراقبة المستمرة عبر سجل مخاطر حي تقييم المخاطر من ممارسة امتثال دورية إلى انضباط تشغيلي مستمر — مع رؤية كل خطر وتتبع كل ضابط وإدارة كل تاريخ مراجعة.",
  "Role-based access control that protects sensitive risk data while keeping the right people informed.":
    "تحكم في الوصول قائم على الأدوار يحمي بيانات المخاطر الحساسة مع إبقاء الأشخاص المعنيين على اطلاع.",
  "Part of a unified EHSWatch platform, so mitigating actions and findings connect seamlessly with the wider safety system.":
    "جزء من منصة EHSWatch الموحدة، بحيث تتصل إجراءات التخفيف والنتائج بسلاسة مع نظام السلامة الأوسع.",
  "Trusted by Safety Teams Across Industries": "موثوقة من فرق السلامة في مختلف القطاعات",
  "What does EHSWatch Risk Assessment do?": "ماذا تفعل وحدة تقييم المخاطر من EHSWatch؟",
  "What are the benefits of conducting one?": "ما فوائد إجراء تقييم للمخاطر؟",
  "Which risk assessment methodologies does the module support?": "ما منهجيات تقييم المخاطر التي تدعمها الوحدة؟",
  "How does the module prioritise risks?": "كيف ترتّب الوحدة أولويات المخاطر؟",
  "Can mitigation actions be tracked to closure?": "هل يمكن تتبع إجراءات التخفيف حتى إغلاقها؟",
  "How does it help with ISO 45001 compliance?": "كيف تساعد في الامتثال لمعيار ISO 45001؟",
  "Is access to risk data controlled?": "هل الوصول إلى بيانات المخاطر مضبوط؟",
  "Ready To Manage Risk Before It Manages You?": "هل أنت مستعد لإدارة المخاطر قبل أن تديرك؟",
  "Investigate incidents and link findings directly to the risk assessments that covered the activity — using real incident data to inform and update the live risk register.":
    "حقق في الحوادث واربط النتائج مباشرة بتقييمات المخاطر التي غطت النشاط — باستخدام بيانات حوادث حقيقية لإثراء سجل المخاطر الحي وتحديثه.",
  "Link task-specific risk assessments directly to permit records — ensuring every high-risk work authorisation is based on a current, documented hazard assessment for the specific activity":
    "اربط تقييمات المخاطر الخاصة بالمهمة مباشرة بسجلات التصاريح — بما يضمن استناد كل تصريح عمل عالي الخطورة إلى تقييم مخاطر موثق وحديث للنشاط المحدد",
  "Conduct site safety inspections, link inspection findings to the corresponding risk assessments they validate or challenge, and update risk scores based on field evidence.":
    "نفّذ عمليات تفتيش السلامة في الموقع، واربط نتائج التفتيش بتقييمات المخاطر المقابلة التي تؤكدها أو تتحداها، وحدّث درجات المخاطر بناءً على الأدلة الميدانية.",
  "Assign and close mitigation actions from risk assessments with defined ownership, escalation paths and verified closure confirmation for every identified control gap.":
    "أسند إجراءات التخفيف من تقييمات المخاطر وأغلقها بمسؤولية محددة ومسارات تصعيد وتأكيد إغلاق موثّق لكل فجوة ضابط محددة.",
  "Apply AI analysis to risk register data and incident patterns — surfacing risk areas where the assessment may be underestimating likelihood based on what is actually occurring in the field.":
    "طبّق تحليل الذكاء الاصطناعي على بيانات سجل المخاطر وأنماط الحوادث — للكشف عن مجالات المخاطر التي قد يقلل فيها التقييم من احتمالية وقوعها بناءً على ما يحدث فعلياً في الميدان.",
  "Give your teams a simple way to report, respond and prevent incidents – without adding more admins.":
    "امنح فرقك طريقة بسيطة للإبلاغ والاستجابة ومنع الحوادث — دون إضافة المزيد من الإداريين.",

  // ── /modules/incident-management ─────────────────────────────────────────
  "Respond Fast.": "استجب بسرعة.",
  "Prevent": "امنع",
  "More.": "المزيد.",
  "EHSWatch Incident Management gives your safety teams a single, structured platform to capture every incident, accident and near miss the moment it happens, investigate it thoroughly with built-in root cause analysis, generate statutory reporting outputs and drive corrective actions to verified closure.":
    "تمنح وحدة إدارة الحوادث من EHSWatch فرق السلامة لديك منصة واحدة منظمة لرصد كل حادثة وإصابة وحادثة وشيكة لحظة وقوعها، والتحقيق فيها بدقة عبر تحليل مدمج للسبب الجذري، وإنشاء مخرجات إبلاغ نظامية، ودفع الإجراءات التصحيحية حتى إغلاقها الموثّق.",
  "Why Incident Management?": "لماذا إدارة الحوادث؟",
  "When an incident happens, every minute matters — yet paper forms and email chains slow everything down. Reports arrive late and incomplete, investigations lose momentum while findings wait to be typed up, corrective actions get lost in inboxes, and without a clear view of root causes, the same incidents keep returning.":
    "عند وقوع حادثة، تهم كل دقيقة — لكن النماذج الورقية وسلاسل البريد الإلكتروني تُبطئ كل شيء. تصل التقارير متأخرة وغير مكتملة، وتفقد التحقيقات زخمها أثناء انتظار كتابة النتائج، وتضيع الإجراءات التصحيحية في صناديق البريد، وبدون رؤية واضحة للأسباب الجذرية، تستمر الحوادث ذاتها في التكرار.",
  "EHSWatch Incident Management removes those failure points. Anyone can report in moments from any device, online or offline in the field. Investigations are structured with built-in 5-Why and Fishbone tools, corrective actions are tracked automatically to closure, and every incident feeds live analytics that surface recurring patterns before they generate the next event.":
    "تزيل وحدة إدارة الحوادث من EHSWatch نقاط الإخفاق هذه. يمكن لأي شخص الإبلاغ في لحظات من أي جهاز، متصلاً أو غير متصل في الميدان. تُنظَّم التحقيقات بأدوات مدمجة لتحليل الأسباب الخمسة ومخطط إيشيكاوا، وتُتبع الإجراءات التصحيحية تلقائياً حتى إغلاقها، وتغذي كل حادثة تحليلات حية تكشف الأنماط المتكررة قبل أن تولّد الحدث التالي.",
  "See Incident Management in Action": "شاهد إدارة الحوادث أثناء العمل",
  "Capture, investigate and resolve every safety event, with the analytics to prevent the next.":
    "سجّل كل حدث سلامة وحقق فيه وحُلّه، مع التحليلات اللازمة لمنع الحدث التالي.",
  "Instant Incident & Near-Miss Reporting": "إبلاغ فوري عن الحوادث والحوادث الوشيكة",
  "Report incidents, accidents and near misses from any device in moments — mobile-first with offline capture from the field. One system manages every event type, from injuries and property damage to environmental releases and near misses that surface risk early.":
    "أبلغ عن الحوادث والإصابات والحوادث الوشيكة من أي جهاز في لحظات — بتصميم يُراعي الجوال أولاً مع رصد دون اتصال من الميدان. يدير نظام واحد كل نوع حدث، من الإصابات وأضرار الممتلكات إلى الانبعاثات البيئية والحوادث الوشيكة التي تكشف المخاطر مبكراً.",
  "Severity Classification & Risk Scoring": "تصنيف الخطورة وتقييم المخاطر",
  "Classify every incident by severity, from first-aid and medical-treatment cases to lost-time injuries, high-potential events and fatalities. Automatic scoring supports TRIR, LTIR and DART calculations and feeds safety performance dashboards in real time.":
    "صنّف كل حادثة حسب الخطورة، من حالات الإسعافات الأولية والعلاج الطبي إلى الإصابات المسببة لفقدان وقت العمل والأحداث عالية الاحتمالية والوفيات. يدعم التقييم التلقائي حسابات TRIR وLTIR وDART ويغذي لوحات معلومات أداء السلامة في الوقت الفعلي.",
  "Built-In Root Cause Analysis": "تحليل مدمج للسبب الجذري",
  "Conduct structured investigations using built-in 5-Why, Fishbone (Ishikawa), SCAT and ICAM methodologies — with report forms, workflows, approval chains and notifications all configurable to your processes, without IT support.":
    "أجرِ تحقيقات منظمة باستخدام منهجيات مدمجة مثل الأسباب الخمسة ومخطط إيشيكاوا وSCAT وICAM — مع نماذج تقارير وسير عمل وسلاسل موافقات وإشعارات قابلة للتخصيص حسب عملياتك، دون الحاجة لدعم تقني.",
  "Integrated Corrective Action Tracking": "تتبع متكامل للإجراءات التصحيحية",
  "Investigation findings convert automatically into tracked corrective and preventive actions in Action Tracker — with assigned owners, due dates, escalation paths and closure confirmation.":
    "تتحول نتائج التحقيق تلقائياً إلى إجراءات تصحيحية ووقائية متتبَّعة في متتبع الإجراءات — مع مسؤولين مُسندين ومواعيد استحقاق ومسارات تصعيد وتأكيد إغلاق.",
  "Statutory & Regulatory Reporting": "الإبلاغ النظامي والتنظيمي",
  "Generate RIDDOR reports for the UK HSE, OSHA 300/300A/301 forms for US reporting, and configurable outputs for GCC and other regional requirements — directly from the incident record, no manual reformatting.":
    "أنشئ تقارير RIDDOR لهيئة الصحة والسلامة البريطانية، ونماذج OSHA 300/300A/301 للإبلاغ الأمريكي، ومخرجات قابلة للتخصيص لمتطلبات دول مجلس التعاون الخليجي والمناطق الأخرى — مباشرة من سجل الحادثة، دون إعادة تنسيق يدوي.",
  "Real-Time Analytics & Trend Reporting": "تحليلات وتقارير اتجاهات فورية",
  "Monitor incident rates, near-miss frequencies, root cause categories, site performance and action close-out rates through live dashboards that surface emerging risk trends before they generate the next incident.":
    "راقب معدلات الحوادث وتكرار الحوادث الوشيكة وفئات الأسباب الجذرية وأداء المواقع ومعدلات إغلاق الإجراءات من خلال لوحات معلومات حية تكشف اتجاهات المخاطر الناشئة قبل أن تولّد الحادثة التالية.",
  "Part of a unified EHSQ platform, so corrective actions flow straight into Action Tracker and wider workflows.":
    "جزء من منصة EHSQ موحدة، بحيث تنتقل الإجراءات التصحيحية مباشرة إلى متتبع الإجراءات وسير العمل الأوسع.",
  "Goes beyond reporting to structured root cause analysis - addressing the systemic cause that prevents recurrence, not just recording the event that already occurred.":
    "يتجاوز مجرد الإبلاغ إلى تحليل منظم للسبب الجذري — معالجة السبب المنهجي الذي يمنع التكرار، لا مجرد تسجيل الحدث الذي وقع بالفعل.",
  "Severity classification and automatic rate calculation (TRIR, LTIR, DART) provide the safety performance metrics that leadership, auditors and regulators measure against.":
    "يوفر تصنيف الخطورة والحساب التلقائي للمعدلات (TRIR وLTIR وDART) مقاييس أداء السلامة التي تقيس القيادة والمدققون والجهات التنظيمية بموجبها.",
  "Statutory reporting outputs for RIDDOR, OSHA and regional requirements — generated directly from the incident record, eliminating the manual reformatting step that delays regulatory submission.":
    "مخرجات إبلاغ نظامية لـ RIDDOR وOSHA والمتطلبات الإقليمية — تُنشأ مباشرة من سجل الحادثة، مما يلغي خطوة إعادة التنسيق اليدوية التي تؤخر التقديم التنظيمي.",
  "Mobile-first with offline capability — incidents are captured the moment they happen, directly from the field, rather than reconstructed hours later with incomplete details.":
    "تصميم يُراعي الجوال أولاً مع إمكانية العمل دون اتصال — تُرصد الحوادث لحظة وقوعها مباشرة من الميدان، بدلاً من إعادة بنائها بعد ساعات بتفاصيل ناقصة.",
  "Real-time analytics that turn incident data into forward-looking safety intelligence — identifying where the next incident is most likely to occur before it does.":
    "تحليلات فورية تحوّل بيانات الحوادث إلى معلومات سلامة استشرافية — تحدد أين يُرجَّح وقوع الحادثة التالية قبل حدوثها.",
  "Trusted By EHSQ Teams Across Industries": "موثوقة من فرق EHSQ في مختلف القطاعات",
  "What types of incidents can EHSWatch Incident Management handle?": "ما أنواع الحوادث التي تتعامل معها وحدة إدارة الحوادث من EHSWatch؟",
  "Does the module support RIDDOR, OSHA and other statutory reporting requirements?": "هل تدعم الوحدة متطلبات الإبلاغ النظامي مثل RIDDOR وOSHA؟",
  "Does it support root cause analysis?": "هل تدعم تحليل السبب الجذري؟",
  "Can EHSWatch Incident Management integrate with other EHSQ modules?": "هل يمكن لوحدة إدارة الحوادث من EHSWatch التكامل مع وحدات EHSQ الأخرى؟",
  "Can it be accessed from mobile devices?": "هل يمكن الوصول إليها من الأجهزة المحمولة؟",
  "Can the module be customised for our organisation?": "هل يمكن تخصيص الوحدة لمؤسستنا؟",
  "How secure is incident data?": "ما مدى أمان بيانات الحوادث؟",
  "Ready to Respond Faster and Prevent More?": "هل أنت مستعد للاستجابة بسرعة أكبر ومنع المزيد؟",
  "Plan and conduct safety management system audits — incident data and investigation records feed directly into audit evidence and finding analysis.":
    "خطّط لتدقيقات نظام إدارة السلامة ونفّذها — تغذي بيانات الحوادث وسجلات التحقيق مباشرة أدلة التدقيق وتحليل النتائج.",
  "Schedule and conduct site safety inspections — link inspection findings to the incident types and locations they correspond to for a complete risk control picture.":
    "جدول عمليات تفتيش السلامة في الموقع ونفّذها — اربط نتائج التفتيش بأنواع الحوادث ومواقعها المقابلة للحصول على صورة كاملة للسيطرة على المخاطر.",
  "Assign, track and close corrective actions generated by incident investigations — with defined ownership, escalation paths and a complete audit trail from finding to verified closure.":
    "أسند الإجراءات التصحيحية الناتجة عن تحقيقات الحوادث وتتبعها وأغلقها — بمسؤولية محددة ومسارات تصعيد ومسار تدقيق كامل من النتيجة إلى الإغلاق الموثّق.",
  "Identify hazards and document controls — use incident trend data and root cause findings to update risk assessments and validate control effectiveness across sites.":
    "حدّد المخاطر ووثّق الضوابط — استخدم بيانات اتجاهات الحوادث ونتائج الأسباب الجذرية لتحديث تقييمات المخاطر والتحقق من فعالية الضوابط عبر المواقع.",
  "Apply AI root cause analysis, event similarity detection and predictive risk scoring to incident data — surfacing patterns and systemic risks automatically across your safety record.":
    "طبّق تحليل السبب الجذري بالذكاء الاصطناعي وكشف تشابه الأحداث وتقييم المخاطر التنبؤي على بيانات الحوادث — للكشف التلقائي عن الأنماط والمخاطر المنهجية عبر سجل السلامة لديك.",

  // ── /modules/training-management ─────────────────────────────────────────
  "Why Training Management?": "لماذا إدارة التدريب؟",
  "EHSWatch Training Management removes all three failure modes. A configurable competency matrix defines what each role requires — by site, risk level and jurisdiction — and applies it automatically to every worker in that role. Expiry alerts trigger well in advance, so certifications are renewed before they lapse, and a complete training record for any worker is ready in seconds.":
    "تزيل وحدة إدارة التدريب من EHSWatch أنماط الفشل الثلاثة جميعها. تحدد مصفوفة كفاءة قابلة للتخصيص ما يتطلبه كل دور — حسب الموقع ومستوى الخطورة والنطاق القانوني — وتطبقه تلقائياً على كل عامل في ذلك الدور. تُطلَق تنبيهات الانتهاء قبل وقت كافٍ، بحيث تُجدَّد الشهادات قبل انتهائها، ويكون سجل تدريب كامل لأي عامل جاهزاً في ثوانٍ.",
  "See Training Management in Action": "شاهد إدارة التدريب أثناء العمل",
  "From role requirements to verified competence — every worker, every site, every qualification":
    "من متطلبات الدور إلى الكفاءة الموثّقة — كل عامل، وكل موقع، وكل مؤهل",
  "Centralised Training Records": "سجلات تدريب مركزية",
  "Competency Matrix Builder": "أداة بناء مصفوفة الكفاءة",
  "Define the exact training and certification requirements for every role, and apply them automatically to each worker assigned to that role — so nothing is left to manual tracking.":
    "حدّد متطلبات التدريب والشهادات الدقيقة لكل دور، وطبّقها تلقائياً على كل عامل مُسند إلى ذلك الدور — بحيث لا يُترك شيء للتتبع اليدوي.",
  "Automated Expiry Tracking & Alerts": "تتبع تلقائي لانتهاء الصلاحية وتنبيهات",
  "Track certification expiry dates across every qualification, and send configurable alerts to the worker, their line manager and the training coordinator at defined intervals before each one lapses.":
    "تتبّع تواريخ انتهاء صلاحية الشهادات عبر كل مؤهل، وأرسل تنبيهات قابلة للتخصيص إلى العامل ومديره المباشر ومنسّق التدريب في فترات محددة قبل انتهاء كل شهادة.",
  "Training Gap Matrix": "مصفوفة فجوات التدريب",
  "Identify every worker missing a required qualification for their role, site or upcoming task before a visit — generated in real time and exportable for HSE reviews, tender submissions and contract compliance.":
    "حدّد كل عامل تنقصه مؤهل مطلوب لدوره أو موقعه أو مهمته القادمة قبل الزيارة — يُنشأ في الوقت الفعلي وقابل للتصدير لمراجعات الصحة والسلامة وتقديم العطاءات والامتثال التعاقدي.",
  "HRMS Integration": "تكامل مع نظام إدارة الموارد البشرية",
  "Integrate with your existing HR system to synchronise worker data automatically, keeping records aligned across platforms without duplicate entry.":
    "تكامل مع نظام الموارد البشرية الحالي لديك لمزامنة بيانات العمال تلقائياً، مع إبقاء السجلات متوافقة عبر المنصات دون إدخال مكرر.",
  "Multi-Site & Multi-Jurisdiction Support": "دعم مواقع متعددة ونطاقات قانونية متعددة",
  "Manage different training and certification requirements across sites, countries and operating contexts — including jurisdiction-specific mandatory qualifications and client-mandated standards — all in one system.":
    "أدر متطلبات تدريب وشهادات مختلفة عبر المواقع والدول وسياقات التشغيل — بما في ذلك المؤهلات الإلزامية الخاصة بكل نطاق قانوني والمعايير التي يفرضها العملاء — كل ذلك في نظام واحد.",
  "A configurable competency matrix at its core, mapping exactly what every worker needs by role, siteand task, and applying it automatically so no requirement is missed.":
    "مصفوفة كفاءة قابلة للتخصيص في صميمها، تحدد بدقة ما يحتاجه كل عامل حسب الدور والموقع والمهمة، وتطبّقه تلقائياً بحيث لا تُفوَّت أي متطلبات.",
  "Proactive expiry management with advance alerts, so certifications are renewed before they lapse.":
    "إدارة استباقية لانتهاء الصلاحية بتنبيهات مسبقة، بحيث تُجدَّد الشهادات قبل انتهائها.",
  "New starters are auto-assigned with their required trainings from day one using the pre-configure role matrix requirement.":
    "يُسند للموظفين الجدد تدريباتهم المطلوبة تلقائياً منذ اليوم الأول باستخدام متطلبات مصفوفة الدور المُعدَّة مسبقاً.",
  "Update the matrix when a regulation changes and instantly see every worker affected.":
    "حدّث المصفوفة عند تغيّر لائحة ما، وشاهد فوراً كل عامل متأثر بذلك.",
  "Built to support global frameworks and schemes, including ISO 45001, OSHA, UK HSE, and other industry schemes.":
    "مصممة لدعم الأطر والأنظمة العالمية، بما في ذلك ISO 45001 وOSHA وهيئة الصحة والسلامة البريطانية وأنظمة صناعية أخرى.",
  "Part of a unified EHSWatch platform, so workforce competence connects directly with permits, risk assessments and incident investigations.":
    "جزء من منصة EHSWatch الموحدة، بحيث ترتبط كفاءة القوى العاملة مباشرة بالتصاريح وتقييمات المخاطر وتحقيقات الحوادث.",
  "Trusted by Workforce Safety and Competence Teams Across Industries": "موثوقة من فرق سلامة وكفاءة القوى العاملة في مختلف القطاعات",
  "What does EHSWatch Training Management do?": "ماذا تفعل وحدة إدارة التدريب من EHSWatch؟",
  "What is the competency matrix and how does it work?": "ما هي مصفوفة الكفاءة وكيف تعمل؟",
  "How does the module handle certification expiries?": "كيف تتعامل الوحدة مع انتهاء صلاحية الشهادات؟",
  "Can it integrate with our HR and learning management systems?": "هل يمكنها التكامل مع أنظمة الموارد البشرية وإدارة التعلم لدينا؟",
  "Can it manage different training requirements across different sites and countries?": "هل يمكنها إدارة متطلبات تدريب مختلفة عبر مواقع ودول مختلفة؟",
  "How does it help during audits and contract safety reviews?": "كيف تساعد أثناء التدقيقات ومراجعات السلامة التعاقدية؟",
  "Ready to See Exactly Who Is Qualified — and Who Is Not?": "هل أنت مستعد لمعرفة من هو مؤهل بالضبط — ومن ليس كذلك؟",
  "Verify worker competency within the permit authorisation workflow — preventing unqualified personnel from being authorised for high-risk activities before their certification is confirmed.":
    "تحقق من كفاءة العامل ضمن سير عمل اعتماد التصاريح — لمنع اعتماد أفراد غير مؤهلين لأنشطة عالية الخطورة قبل تأكيد شهاداتهم.",
  "Connect training requirements to specific high-hazard activitie ensuring every task-level risk assessment identifies the qualifications required to perform the work safely.":
    "اربط متطلبات التدريب بأنشطة محددة عالية الخطورة بما يضمن تحديد كل تقييم مخاطر على مستوى المهمة للمؤهلات اللازمة لأداء العمل بأمان.",
  "Investigate incidents and identify competency gaps as contributing factors — link training record evidence to investigation findings and corrective action plans.":
    "حقق في الحوادث وحدّد فجوات الكفاءة كعوامل مساهمة — اربط أدلة سجل التدريب بنتائج التحقيق وخطط الإجراءات التصحيحية.",
  "Assign and track corrective actions arising from training gap analyses, expired certification reviews and competency audit findings with defined ownership and escalation.":
    "أسند وتتبع الإجراءات التصحيحية الناشئة عن تحليلات فجوات التدريب ومراجعات الشهادات المنتهية ونتائج تدقيق الكفاءة بمسؤولية محددة وتصعيد.",
  "Conduct ISO 45001 and internal competence audits so training records and gap analyses are accessible as audit evidence without manual assembly from multiple systems.":
    "نفّذ تدقيقات ISO 45001 والكفاءة الداخلية بحيث تكون سجلات التدريب وتحليلات الفجوات متاحة كأدلة تدقيق دون تجميع يدوي من أنظمة متعددة.",

  // ── /modules/permit-to-work ───────────────────────────────────────────────
  "EHSWatch Permit to Work gives your teams a structured, fully digital system to request, assess, review, authorise and monitor every work permit — from hot work and confined space entry to electrical isolation and work at height. Every critical safety step is enforced in the workflow before work can begin.":
    "تمنح وحدة تصريح العمل من EHSWatch فرقك نظاماً منظماً ورقمياً بالكامل لطلب كل تصريح عمل وتقييمه ومراجعته واعتماده ومراقبته — من الأعمال الساخنة والدخول إلى الأماكن المحصورة إلى العزل الكهربائي والعمل في الأماكن المرتفعة. تُفرض كل خطوة سلامة حاسمة ضمن سير العمل قبل بدء العمل.",
  "Control every permit with confidence. Let nothing reach the field unchecked.":
    "تحكّم في كل تصريح بثقة. لا تدع شيئاً يصل إلى الميدان دون فحص.",
  "Why Permit to Work?": "لماذا تصريح العمل؟",
  "See Permit to Work in Action": "شاهد تصريح العمل أثناء العمل",
  "Enforce every step. Authorise every permit with confidence.": "افرض كل خطوة. اعتمد كل تصريح بثقة.",
  "Digital Permit Initiation": "إنشاء تصريح رقمي",
  "Create permits from any device — no paper forms or email attachments. Configurable templates capture all required hazard identification, pre-work safety information and resource details at initiation, so reviews begin with complete data.":
    "أنشئ التصاريح من أي جهاز — دون نماذج ورقية أو مرفقات بريد إلكتروني. تلتقط القوالب القابلة للتخصيص كل تحديد المخاطر المطلوب ومعلومات السلامة قبل العمل وتفاصيل الموارد عند الإنشاء، بحيث تبدأ المراجعات ببيانات كاملة.",
  "Configurable Permit Types": "أنواع تصاريح قابلة للتخصيص",
  "Support Hot Work, Confined Space Entry, Electrical Isolation, Work at Height, Excavation, Radiography, Chemical Handling and any custom permit types specific to your sites or regulatory requirements.":
    "دعم الأعمال الساخنة، والدخول إلى الأماكن المحصورة، والعزل الكهربائي، والعمل في الأماكن المرتفعة، والحفر، والتصوير الإشعاعي، والتعامل مع المواد الكيميائية، وأي أنواع تصاريح مخصصة خاصة بمواقعك أو متطلباتك التنظيمية.",
  "Multi-Level Approval Workflow": "سير عمل موافقات متعدد المستويات",
  "Route permits through required approvers, issuers, area authorities and safety officers with configurable sign-off steps — so every permit reaches the right people, in the right order, before work is authorised.":
    "وجّه التصاريح عبر الموافقين والمُصدرين ومسؤولي المنطقة وضباط السلامة المطلوبين بخطوات اعتماد قابلة للتخصيص — بحيث يصل كل تصريح إلى الأشخاص المناسبين، بالترتيب الصحيح، قبل اعتماد العمل.",
  "Isolation & LOTO Management": "إدارة العزل والإغلاق والوسم (LOTO)",
  "Link Lockout/Tagout registers and isolation schedules directly to permit records, so energy isolation is verified and documented before high-risk work begins — with isolation point status tracked in real time for all stakeholders.":
    "اربط سجلات الإغلاق والوسم وجداول العزل مباشرة بسجلات التصاريح، بحيث يُتحقق من عزل الطاقة ويُوثَّق قبل بدء العمل عالي الخطورة — مع تتبع حالة نقاط العزل في الوقت الفعلي لجميع الأطراف المعنية.",
  "Expiry & Extension Management": "إدارة انتهاء الصلاحية والتمديد",
  "Track permit validity in real time with automated alerts before expiry. Extension requests follow the same approval workflow as the original permit, preventing informal verbal extensions that bypass authorisation.":
    "تتبّع صلاحية التصريح في الوقت الفعلي بتنبيهات تلقائية قبل الانتهاء. تتبع طلبات التمديد نفس سير عمل الموافقة الخاص بالتصريح الأصلي، بما يمنع التمديدات الشفهية غير الرسمية التي تتجاوز الاعتماد.",
  "Real-Time Permit Dashboard": "لوحة معلومات فورية للتصاريح",
  "View every open, pending, suspended and expired permit across all sites and work areas in one central dashboard — with complete real-time visibility of authorised work, pending conflicts and expiry alerts.":
    "شاهد كل تصريح مفتوح أو معلّق أو موقوف أو منتهي الصلاحية عبر جميع المواقع ومناطق العمل في لوحة معلومات مركزية واحدة — مع رؤية فورية كاملة للعمل المعتمد والتعارضات المعلّقة وتنبيهات الانتهاء.",
  "The last line of defence, genuinely digitised — enforcement is structural, not procedural. A permit cannot be issued with a step skipped, a signatory missing or a safety check bypassed. The process works by design, not by memory.":
    "خط الدفاع الأخير، رقمي بالكامل فعلاً — الفرض هيكلي لا إجرائي. لا يمكن إصدار تصريح مع تخطي خطوة أو غياب موقّع أو تجاوز فحص سلامة. تعمل العملية بالتصميم، لا بالاعتماد على الذاكرة.",
  "Gas testing and atmospheric monitoring results are captured within the permit workflow with configurable pass/fail thresholds.":
    "تُلتقط نتائج اختبار الغازات ومراقبة الأجواء ضمن سير عمل التصريح بعتبات نجاح/فشل قابلة للتخصيص.",
  "Real-time active permit dashboard gives permit controllers and HSE officers a complete, live picture of all authorised work across every site.":
    "تمنح لوحة معلومات التصاريح النشطة الفورية مراقبي التصاريح وضباط الصحة والسلامة صورة حية كاملة لكل العمل المعتمد عبر كل موقع.",
  "Built within the unified EHSWatch EHSQ platform, permits link directly to risk assessments, Management of Change records, incident investigations and inspection findings for full end-to-end operational safety traceability.":
    "مبنية ضمن منصة EHSQ الموحدة من EHSWatch، ترتبط التصاريح مباشرة بتقييمات المخاطر وسجلات إدارة التغيير وتحقيقات الحوادث ونتائج التفتيش لتتبع تشغيلي كامل للسلامة من البداية إلى النهاية.",
  "Helps teams stay aligned with high-risk work, isolation control and regulatory requirements.":
    "يساعد الفرق على البقاء متوافقة مع العمل عالي الخطورة والتحكم في العزل والمتطلبات التنظيمية.",
  "Permanent, retrievable audit trail for every permit demonstrating to regulators, insurers and investigators that every required step was completed, every approval was given and every safety check was documented before work began.":
    "مسار تدقيق دائم وقابل للاسترجاع لكل تصريح يثبت للجهات التنظيمية وشركات التأمين والمحققين أن كل خطوة مطلوبة اكتملت، وكل موافقة أُعطيت، وكل فحص سلامة وُثّق قبل بدء العمل.",
  "What is EHSWatch Permit to Work?": "ما هي وحدة تصريح العمل من EHSWatch؟",
  "Which types of permits does it support?": "ما أنواع التصاريح التي تدعمها؟",
  "Can permits be approved from mobile devices?": "هل يمكن اعتماد التصاريح من الأجهزة المحمولة؟",
  "Does it handle gas testing and atmospheric monitoring?": "هل تتعامل مع اختبار الغازات ومراقبة الأجواء؟",
  "Does it support isolation and LOTO controls?": "هل تدعم ضوابط العزل والإغلاق والوسم؟",
  "How does it support regulatory compliance and audit requirements?": "كيف تدعم الامتثال التنظيمي ومتطلبات التدقيق؟",
  "Does it manage permit expiry and extensions?": "هل تدير انتهاء صلاحية التصاريح وتمديدها؟",
  "Ready to Digitise Your Work Permit Process?": "هل أنت مستعد لرقمنة عملية تصاريح العمل لديك؟",
  "Control equipment, process and procedure changes before they generate new hazards — link approved MoC records directly to the permits authorising physical implementation.":
    "تحكّم في تغييرات المعدات والعمليات والإجراءات قبل أن تولّد مخاطر جديدة — اربط سجلات إدارة التغيير المعتمدة مباشرة بالتصاريح التي تعتمد التنفيذ الفعلي.",
  "Identify hazards and document controls for high-risk activities — risk assessments link directly to the permit record they underpin, ensuring permits are based on current, documented risk evaluations.":
    "حدّد المخاطر ووثّق الضوابط للأنشطة عالية الخطورة — ترتبط تقييمات المخاطر مباشرة بسجل التصريح الذي تدعمه، بما يضمن استناد التصاريح إلى تقييمات مخاطر حديثة وموثقة.",
  "Investigate work-related incidents — link incident records to the permit under which the work was being performed for a complete picture of the authorisation chain preceding the event.":
    "حقق في الحوادث المرتبطة بالعمل — اربط سجلات الحوادث بالتصريح الذي كان يُنفَّذ العمل بموجبه للحصول على صورة كاملة لسلسلة الاعتماد قبل الحدث.",
  "Track corrective actions arising from permit process audits, near-miss investigations and SIMOPS conflict reviews — with defined ownership and verified closure.":
    "تتبّع الإجراءات التصحيحية الناشئة عن تدقيقات عملية التصاريح وتحقيقات الحوادث الوشيكة ومراجعات تعارضات العمليات المتزامنة — بمسؤولية محددة وإغلاق موثّق.",
  "Apply AI analysis to permit data — identifying patterns in permit delays, recurring SIMOPS conflicts and permit-related near-miss trends automatically.":
    "طبّق تحليل الذكاء الاصطناعي على بيانات التصاريح — لتحديد أنماط تأخير التصاريح وتعارضات العمليات المتزامنة المتكررة واتجاهات الحوادث الوشيكة المرتبطة بالتصاريح تلقائياً.",

  // ── /modules/non-conformance ──────────────────────────────────────────────
  "EHSWatch Non-Conformance gives your teams a faster, more reliable way to handle every deviation — identify and log issues quickly, route them to the right people automatically, investigate root causes with structured CAPA workflows, and analyse trends to drive data-driven quality improvement.":
    "تمنح وحدة عدم المطابقة من EHSWatch فرقك طريقة أسرع وأكثر موثوقية للتعامل مع كل انحراف — تحديد المشكلات وتسجيلها بسرعة، وتوجيهها تلقائياً إلى الأشخاص المناسبين، والتحقيق في الأسباب الجذرية عبر سير عمل CAPA منظم، وتحليل الاتجاهات لدفع تحسين الجودة المبني على البيانات.",
  "Catch issues early. Address root causes completely. Stop them returning for good.":
    "اكتشف المشكلات مبكراً. عالج الأسباب الجذرية بالكامل. أوقف تكرارها نهائياً.",
  "Why Non-Conformance?": "لماذا عدم المطابقة؟",
  "When a deviation goes unlogged — or is logged but never properly investigated — the cost rarely stays contained. Issues recur because the root cause was never addressed, corrective actions are tracked in spreadsheets and quietly dropped once the pressure passes, and scattered records hide the true pattern of failures until an audit or major complaint forces it into view.":
    "عندما لا يُسجَّل الانحراف — أو يُسجَّل لكنه لا يُحقَّق فيه بشكل صحيح أبداً — نادراً ما تبقى التكلفة محدودة. تتكرر المشكلات لأن السبب الجذري لم يُعالَج أبداً، وتُتبَّع الإجراءات التصحيحية في جداول بيانات وتُهمل بهدوء بمجرد زوال الضغط، وتُخفي السجلات المشتتة نمط الإخفاقات الحقيقي حتى يُجبره تدقيق أو شكوى كبرى على الظهور.",
  "EHSWatch Non-Conformance changes that. Issues are reported quickly, routed to the right people automatically and investigated through structured CAPA workflows that address the root cause, not just the symptom. Real-time trend analytics reveal recurring non-conformance types, problem suppliers and high-failure process areas before they generate the next audit finding.":
    "تغيّر وحدة عدم المطابقة من EHSWatch ذلك. تُبلَّغ المشكلات بسرعة، وتُوجَّه تلقائياً إلى الأشخاص المناسبين، ويُحقَّق فيها عبر سير عمل CAPA منظم يعالج السبب الجذري، لا مجرد العرض. تكشف تحليلات الاتجاهات الفورية أنواع عدم المطابقة المتكررة والموردين الإشكاليين ومناطق العمليات عالية الإخفاق قبل أن تولّد نتيجة التدقيق التالية.",
  "See Non-Conformance in Action": "شاهد عدم المطابقة أثناء العمل",
  "Everything your team needs to catch, resolve and prevent quality issues.":
    "كل ما يحتاجه فريقك لاكتشاف مشكلات الجودة وحلها ومنعها.",
  "Quick Identification & Logging": "تحديد وتسجيل سريعان",
  "Log product and batch defects, in-process failures, material rejections, service deviations, supplier issues and environmental non-conformances at the point of detection — through configurable digital forms that capture full investigation detail, not reconstructed later from memory.":
    "سجّل عيوب المنتجات والدفعات، وإخفاقات العمليات، ورفض المواد، وانحرافات الخدمة، ومشكلات الموردين، وحالات عدم المطابقة البيئية عند نقطة الاكتشاف — عبر نماذج رقمية قابلة للتخصيص تلتقط تفاصيل التحقيق كاملة، لا يُعاد بناؤها لاحقاً من الذاكرة.",
  "Automated Routing & Assignment": "توجيه وإسناد تلقائيان",
  "Route every non-conformance automatically to the right quality engineer, supplier quality manager or operations lead — by type, severity, product category or site — eliminating manual triage so nothing waits for investigation.":
    "وجّه كل حالة عدم مطابقة تلقائياً إلى مهندس الجودة أو مدير جودة الموردين أو قائد العمليات المناسب — حسب النوع أو الخطورة أو فئة المنتج أو الموقع — مما يلغي الفرز اليدوي بحيث لا ينتظر شيء التحقيق.",
  "CAPA & Root Cause Analysis": "CAPA وتحليل السبب الجذري",
  "Supplier Non-Conformance Management": "إدارة عدم مطابقة الموردين",
  "Log, investigate and track supplier-originated non-conformances with automated notification to the supplier quality contact and a tracked corrective action request requiring supplier response and closure confirmation.":
    "سجّل حالات عدم المطابقة الناشئة من الموردين وحقق فيها وتتبعها مع إشعار تلقائي لجهة اتصال جودة المورد وطلب إجراء تصحيحي متتبَّع يتطلب رد المورد وتأكيد الإغلاق.",
  "Real-Time Analytics & Reporting": "تحليلات وتقارير فورية",
  "Monitor volumes, resolution cycle times, recurring failure types, supplier performance and CAPA close-out rates through live dashboards and exportable reports — surfacing the systemic issues individual records never reveal in isolation.":
    "راقب الأحجام وأوقات دورة الحل وأنواع الإخفاق المتكررة وأداء الموردين ومعدلات إغلاق CAPA من خلال لوحات معلومات حية وتقارير قابلة للتصدير — للكشف عن المشكلات المنهجية التي لا تكشفها السجلات الفردية بمعزل عن غيرها.",
  "ISO 9001 Compliance Support": "دعم الامتثال لمعيار ISO 9001",
  "The full workflow — identification, investigation, root cause, corrective action, effectiveness review and closure — is structured to satisfy ISO 9001 Clause 10.2, with every record retained on a complete audit trail for certification and customer audits.":
    "سير العمل الكامل — التحديد والتحقيق والسبب الجذري والإجراء التصحيحي ومراجعة الفعالية والإغلاق — منظَّم لتلبية البند 10.2 من ISO 9001، مع الاحتفاظ بكل سجل ضمن مسار تدقيق كامل لتدقيقات الاعتماد والعملاء.",
  "Goes beyond logging to full CAPA - every non-conformance is not just recorded but investigated to root cause and closed with verified corrective action, so issues are genuinely prevented from recurring rather than just documented.":
    "يتجاوز مجرد التسجيل إلى CAPA كامل — لا تُسجَّل كل حالة عدم مطابقة فحسب، بل يُحقَّق فيها حتى السبب الجذري وتُغلَق بإجراء تصحيحي موثَّق، بحيث تُمنع المشكلات من التكرار فعلياً لا أن تُوثَّق فقط.",
  "Built-in root cause analysis tools such as 5-Why and Fishbone that address the source of a problem, not just its symptoms.":
    "أدوات تحليل سبب جذري مدمجة مثل الأسباب الخمسة ومخطط إيشيكاوا تعالج مصدر المشكلة، لا أعراضها فقط.",
  "Workflow automation that routes tasks and notifications automatically, keeping resolution on track without manual chasing.":
    "أتمتة سير العمل التي توجّه المهام والإشعارات تلقائياً، مما يبقي الحل على المسار الصحيح دون متابعة يدوية.",
  "An ISO 9001 Clause 10.2-aligned workflow provides documented evidence of nonconformity management that certification auditors and customer quality teams can inspect, without requiring separate record-keeping outside the platform.":
    "يوفر سير عمل متوافق مع البند 10.2 من ISO 9001 دليلاً موثَّقاً على إدارة عدم المطابقة يمكن لمدققي الاعتماد وفرق جودة العملاء فحصه، دون الحاجة إلى حفظ سجلات منفصلة خارج المنصة.",
  "Real-time trend analytics identify recurring failure types and high-frequency non-conformance sources before they generate the next major quality event, audit non-compliance or customer escalation.":
    "تحدد تحليلات الاتجاهات الفورية أنواع الإخفاق المتكررة ومصادر عدم المطابقة عالية التكرار قبل أن تولّد حدث جودة كبير تالياً، أو عدم امتثال في التدقيق، أو تصعيداً من العميل.",
  "Trusted by Quality and Safety Teams Across Industries": "موثوقة من فرق الجودة والسلامة في مختلف القطاعات",
  "What is non-conformance, and why does structured management matter?": "ما هو عدم المطابقة، ولماذا تهم الإدارة المنظمة؟",
  "What types of non-conformance does the module handle?": "ما أنواع عدم المطابقة التي تتعامل معها الوحدة؟",
  "How does it improve operational efficiency?": "كيف تحسّن الكفاءة التشغيلية؟",
  "How does the module support root cause analysis?": "كيف تدعم الوحدة تحليل السبب الجذري؟",
  "Does it support supplier non-conformances?": "هل تدعم حالات عدم مطابقة الموردين؟",
  "How does the module support ISO 9001 requirements?": "كيف تدعم الوحدة متطلبات ISO 9001؟",
  "Does it integrate with other EHSWatch modules?": "هل تتكامل مع وحدات EHSWatch الأخرى؟",
  "What reporting and analytics does the module provide?": "ما التقارير والتحليلات التي توفرها الوحدة؟",
  "Ready to Turn Non-Conformances Into Permanent Improvements?": "هل أنت مستعد لتحويل حالات عدم المطابقة إلى تحسينات دائمة؟",
  "Link customer complaints directly to the non-conformances that generated them — manage both within one connected quality workflow from detection to closure.":
    "اربط شكاوى العملاء مباشرة بحالات عدم المطابقة التي ولّدتها — أدر كليهما ضمن سير عمل جودة واحد متصل من الاكتشاف إلى الإغلاق.",
  "Plan and conduct ISO 9001 quality audits — audit findings that identify non-conformances link directly to the non-conformance investigation and CAPA record.":
    "خطّط لتدقيقات جودة ISO 9001 ونفّذها — ترتبط نتائج التدقيق التي تحدد حالات عدم المطابقة مباشرة بسجل تحقيق عدم المطابقة وCAPA.",
  "Connect quality failures with safety implications to the incident management workflow — non-conformances involving hazardous materials or process safety deviations require both records.":
    "اربط إخفاقات الجودة ذات الآثار على السلامة بسير عمل إدارة الحوادث — تتطلب حالات عدم المطابقة المتعلقة بمواد خطرة أو انحرافات سلامة العمليات كلا السجلين.",
  "Track CAPA actions from non-conformance investigations — with assigned ownership, due dates, effectiveness review checkpoints and full closure accountability.":
    "تتبّع إجراءات CAPA من تحقيقات عدم المطابقة — بمسؤولية مُسندة ومواعيد استحقاق ونقاط مراجعة فعالية ومساءلة إغلاق كاملة.",
  "Conduct production and quality inspections — in-process findings and incoming inspection failures link directly to non-conformance records for structured follow-up.":
    "نفّذ عمليات تفتيش الإنتاج والجودة — ترتبط نتائج العمليات الجارية وإخفاقات الفحص الوارد مباشرة بسجلات عدم المطابقة للمتابعة المنظمة.",

  // ── /modules/meetings-management ─────────────────────────────────────────
  "EHSWatch Meetings Management gives every safety team a structured digital workflow to capture decisions in real time, assign actions with owners and deadlines during the meeting itself, and track every commitment through to verified completion — from toolbox talks and safety committee reviews to ISO 45001 management reviews.":
    "تمنح وحدة إدارة الاجتماعات من EHSWatch كل فريق سلامة سير عمل رقمياً منظماً لتسجيل القرارات في الوقت الفعلي، وإسناد الإجراءات بمسؤولين ومواعيد نهائية أثناء الاجتماع نفسه، وتتبع كل التزام حتى إتمامه الموثّق — من جلسات صندوق الأدوات ومراجعات لجنة السلامة إلى مراجعات إدارة ISO 45001.",
  "Turn every meeting into accountable action, and every action into a closed record.":
    "حوّل كل اجتماع إلى إجراء خاضع للمساءلة، وكل إجراء إلى سجل مغلق.",
  "Why Meetings Management?": "لماذا إدارة الاجتماعات؟",
  "In most organisations, meeting minutes are captured in Word documents, action lists live in spreadsheets, and follow-ups happen through a chain of emails that quickly fragments across inboxes. The result is predictable: decisions are forgotten, responsibilities are disputed, and recurring safety issues remain unresolved because the action assigned to address them three meetings ago was never properly tracked.":
    "في معظم المؤسسات، تُسجَّل محاضر الاجتماعات في مستندات وورد، وتعيش قوائم الإجراءات في جداول بيانات، وتحدث المتابعات عبر سلسلة رسائل بريد إلكتروني تتشتت بسرعة عبر صناديق الوارد. والنتيجة متوقعة: تُنسى القرارات، وتُتنازع المسؤوليات، وتبقى مشكلات السلامة المتكررة دون حل لأن الإجراء المُسند لمعالجتها قبل ثلاثة اجتماعات لم يُتبَّع بشكل صحيح أبداً.",
  "EHSWatch Meetings Management replaces that gap with a single, structured workflow. Actions are captured and assigned with named owners during the meeting itself, not typed up retrospectively from handwritten notes. Every open action is visible in one dashboard. Reminders go out automatically. Overdue actions escalate without anyone having to chase. And when your next ISO 45001 surveillance audit asks for evidence of management review compliance, the complete documented record is already there.":
    "تسد وحدة إدارة الاجتماعات من EHSWatch هذه الفجوة بسير عمل واحد منظم. تُسجَّل الإجراءات وتُسند بمسؤولين محددين أثناء الاجتماع نفسه، لا أن تُكتب لاحقاً من ملاحظات مكتوبة بخط اليد. كل إجراء مفتوح مرئي في لوحة معلومات واحدة. تُرسَل التذكيرات تلقائياً. تُصعَّد الإجراءات المتأخرة دون أن يحتاج أحد للمتابعة. وعندما يطلب تدقيق ISO 45001 الإشرافي القادم دليلاً على الامتثال لمراجعة الإدارة، يكون السجل الموثَّق الكامل موجوداً بالفعل.",
  "See Meetings Management in Action": "شاهد إدارة الاجتماعات أثناء العمل",
  "Everything your team needs to manage safety meetings with clarity and control.":
    "كل ما يحتاجه فريقك لإدارة اجتماعات السلامة بوضوح وتحكم.",
  "Live Action Capture": "تسجيل فوري للإجراءات",
  "Instant Minute Generation": "إنشاء فوري للمحاضر",
  "Generate a structured, formatted meeting record automatically at meeting close — covering attendance, agenda items, decisions, assigned actions and any referenced documents.":
    "أنشئ سجل اجتماع منظماً ومنسَّقاً تلقائياً عند إغلاق الاجتماع — يغطي الحضور وبنود جدول الأعمال والقرارات والإجراءات المُسندة وأي مستندات مرجعية.",
  "Unified Action Dashboard": "لوحة معلومات موحدة للإجراءات",
  "View every open action from every meeting — across all sites, teams and meeting types — in one consolidated dashboard, so nothing is overlooked between meetings.":
    "شاهد كل إجراء مفتوح من كل اجتماع — عبر جميع المواقع والفرق وأنواع الاجتماعات — في لوحة معلومات موحدة واحدة، بحيث لا يُتجاهل شيء بين الاجتماعات.",
  "Automated Reminders & Escalations": "تذكيرات وتصعيدات تلقائية",
  "Send configurable notifications to action owners ahead of deadlines, and escalate overdue actions automatically to the responsible manager or safety officer — with no manual chasing.":
    "أرسل إشعارات قابلة للتخصيص لمسؤولي الإجراءات قبل المواعيد النهائية، وصعّد الإجراءات المتأخرة تلقائياً إلى المدير المسؤول أو ضابط السلامة — دون متابعة يدوية.",
  "Recurring Meeting Support": "دعم الاجتماعات المتكررة",
  "Configure recurring meetings with saved templates, standing agenda items and standard attendee lists — so teams never rebuild the meeting structure each time.":
    "هيّئ الاجتماعات المتكررة بقوالب محفوظة وبنود جدول أعمال ثابتة وقوائم حضور معيارية — بحيث لا تُعيد الفرق بناء هيكل الاجتماع في كل مرة.",
  "Meeting Type Flexibility": "مرونة أنواع الاجتماعات",
  "Support every safety and compliance meeting in one system — committee meetings, ISO 45001 management reviews, incident reviews, toolbox talks, pre-task briefings and departmental reviews — each with its own configurable template.":
    "دعم كل اجتماع سلامة وامتثال في نظام واحد — اجتماعات اللجان، ومراجعات إدارة ISO 45001، ومراجعات الحوادث، وجلسات صندوق الأدوات، وإحاطات ما قبل المهمة، ومراجعات الأقسام — لكل منها قالبه القابل للتخصيص.",
  "Actions are captured and assigned with named owners during the meeting itself — not typed up retrospectively — eliminating the ambiguity that causes safety commitments to be forgotten or disputed after the fact.":
    "تُسجَّل الإجراءات وتُسند بمسؤولين محددين أثناء الاجتماع نفسه — لا تُكتب لاحقاً — مما يلغي الغموض الذي يتسبب في نسيان التزامات السلامة أو التنازع عليها لاحقاً.",
  "Unified action dashboard across all meeting types and sites gives safety leaders visibility of every open commitment — not just the ones from the last meeting they attended.":
    "تمنح لوحة معلومات الإجراءات الموحدة عبر جميع أنواع الاجتماعات والمواقع قادة السلامة رؤية لكل التزام مفتوح — لا الالتزامات من آخر اجتماع حضروه فقط.",
  "Supports structured collaboration while keeping minutes, actions and approvals organised.":
    "يدعم التعاون المنظم مع إبقاء المحاضر والإجراءات والموافقات منظمة.",
  "Automatic escalation of overdue actions ensures that missed deadlines generate management attention without anyone having to remember to chase — accountability is structural, not dependent on individual diligence.":
    "يضمن التصعيد التلقائي للإجراءات المتأخرة أن تولّد المواعيد النهائية الفائتة اهتمام الإدارة دون أن يحتاج أحد لتذكّر المتابعة — المساءلة هيكلية، لا معتمدة على اجتهاد الأفراد.",
  "ISO 45001 Clause 9.3 management review documentation is built into the workflow, with every required input, output, decision and action captured in a format that satisfies certification audit requirements.":
    "توثيق مراجعة الإدارة وفق البند 9.3 من ISO 45001 مدمج في سير العمل، مع تسجيل كل مدخل ومخرج وقرار وإجراء مطلوب بصيغة تلبي متطلبات تدقيق الاعتماد.",
  "Connected to the EHSWatch EHSQ platform — meeting actions link to incident records, audit findings, risk assessments and corrective action workflows rather than sitting in a separate meeting management tool with no connection to operational safety data.":
    "متصلة بمنصة EHSQ من EHSWatch — ترتبط إجراءات الاجتماعات بسجلات الحوادث ونتائج التدقيق وتقييمات المخاطر وسير عمل الإجراءات التصحيحية بدلاً من البقاء في أداة إدارة اجتماعات منفصلة دون اتصال ببيانات السلامة التشغيلية.",
  "Trusted by EHSQ and Compliance Teams Across Industries": "موثوقة من فرق EHSQ والامتثال في مختلف القطاعات",
  "What is EHSWatch Meetings Management?": "ما هي وحدة إدارة الاجتماعات من EHSWatch؟",
  "What types of meetings does it support?": "ما أنواع الاجتماعات التي تدعمها؟",
  "Can we assign actions during the meeting itself?": "هل يمكننا إسناد الإجراءات أثناء الاجتماع نفسه؟",
  "Does it generate meeting minutes automatically?": "هل تُنشئ محاضر الاجتماعات تلقائياً؟",
  "Can we track open actions across multiple meetings?": "هل يمكننا تتبع الإجراءات المفتوحة عبر اجتماعات متعددة؟",
  "How does it help with compliance and governance?": "كيف تساعد في الامتثال والحوكمة؟",
  "Ready to Turn Safety Meetings Into Measurable Action?": "هل أنت مستعد لتحويل اجتماعات السلامة إلى إجراءات قابلة للقياس؟",
  "Assign, track and close corrective and preventive actions generated across meetings, audits, incidents and observations — with full ownership, deadline management and audit trail.":
    "أسند الإجراءات التصحيحية والوقائية الناتجة عبر الاجتماعات والتدقيقات والحوادث والملاحظات وتتبعها وأغلقها — بمسؤولية كاملة وإدارة مواعيد نهائية ومسار تدقيق.",
  "Capture and investigate safety incidents, link incident review meeting actions to the originating investigation record and track them to verified closure.":
    "سجّل حوادث السلامة وحقق فيها، واربط إجراءات اجتماع مراجعة الحوادث بسجل التحقيق الأصلي وتتبعها حتى الإغلاق الموثّق.",
  "Plan and conduct compliance and management system audits, and link audit debrief meeting actions directly to the findings and corrective action workflows they address.":
    "خطّط لتدقيقات الامتثال ونظام الإدارة ونفّذها، واربط إجراءات اجتماع استخلاص التدقيق مباشرة بالنتائج وسير عمل الإجراءات التصحيحية التي تعالجها.",
  "Manage and update risk assessments — connect risk review meeting decisions to the relevant risk records within the same platform.":
    "أدر تقييمات المخاطر وحدّثها — اربط قرارات اجتماع مراجعة المخاطر بسجلات المخاطر ذات الصلة ضمن المنصة نفسها.",
  "Capture field observations between formal meetings and link observation trends to the safety committee agenda items they should be informing.":
    "سجّل الملاحظات الميدانية بين الاجتماعات الرسمية واربط اتجاهات الملاحظات ببنود جدول أعمال لجنة السلامة التي يجب أن تُثريها.",

  // ── /modules/management-of-change ────────────────────────────────────────
  "Control Every": "تحكّم في كل",
  "Before It Becomes a Risk": "قبل أن يتحول إلى خطر",
  "No change goes unreviewed. No approval goes undocumented.": "لا يمرّ تغيير دون مراجعة. ولا توثَّق موافقة إلا بالكامل.",
  "Why Management of Change?": "لماذا إدارة التغيير؟",
  "See Management of Change in Action": "شاهد إدارة التغيير أثناء العمل",
  "Everything your team needs to review, approve and document change — before it reaches the floor.":
    "كل ما يحتاجه فريقك لمراجعة التغيير واعتماده وتوثيقه — قبل أن يصل إلى أرض العمل.",
  "Digital MoC Initiation": "إنشاء رقمي لطلبات إدارة التغيير",
  "Initiate change requests from any device or browser — no paper forms or email attachments. Configurable templates capture all required information at initiation, so reviews begin with complete, accurate data.":
    "أنشئ طلبات التغيير من أي جهاز أو متصفح — دون نماذج ورقية أو مرفقات بريد إلكتروني. تلتقط القوالب القابلة للتخصيص كل المعلومات المطلوبة عند الإنشاء، بحيث تبدأ المراجعات ببيانات كاملة ودقيقة.",
  "Configurable Change Types": "أنواع تغيير قابلة للتخصيص",
  "Define every change category your operations need — temporary, permanent, emergency, like-for-like, organisational, procedural and process. Each type follows its own workflow, so minor replacements and major modifications are each reviewed at the rigour the risk warrants.":
    "حدّد كل فئة تغيير تحتاجها عملياتك — مؤقت، دائم، طارئ، بديل مماثل، تنظيمي، إجرائي، وعملياتي. يتبع كل نوع سير عمله الخاص، بحيث تُراجَع الاستبدالات البسيطة والتعديلات الكبرى بالدقة التي تستدعيها المخاطر.",
  "Integrated Risk Assessment": "تقييم مخاطر مدمج",
  "Risk assessment is built into the request itself — every change prompts structured hazard identification, risk scoring and control documentation before approval begins. A change cannot progress until its risk assessment is complete.":
    "تقييم المخاطر مدمج في الطلب نفسه — يستدعي كل تغيير تحديداً منظماً للمخاطر وتقييماً لدرجتها وتوثيقاً للضوابط قبل بدء الاعتماد. لا يمكن أن يتقدم التغيير حتى يكتمل تقييم مخاطره.",
  "Multi-Level Approval Routing": "توجيه موافقات متعدد المستويات",
  "Pre-Startup Safety Review (PSSR)": "مراجعة السلامة قبل بدء التشغيل (PSSR)",
  "A built-in PSSR anchors closure — the final confirmation that the change is safely implemented as approved, all tasks are complete, and the affected process, asset or team is ready to return to operation. No PSSR, no closure.":
    "ترسّخ مراجعة السلامة قبل بدء التشغيل المدمجة الإغلاق — التأكيد النهائي بأن التغيير نُفِّذ بأمان كما اعتُمد، واكتملت كل المهام، وأن العملية أو الأصل أو الفريق المتأثر جاهز للعودة إلى التشغيل. لا إغلاق دون مراجعة السلامة قبل بدء التشغيل.",
  "Linked Document Management": "إدارة مستندات مرتبطة",
  "Attach design drawings, procedure updates, safety data sheets, engineering assessments and method statements directly to the change record — so all supporting documentation lives with the change.":
    "أرفق مخططات التصميم وتحديثات الإجراءات وصحائف بيانات السلامة والتقييمات الهندسية وبيانات طرق العمل مباشرة بسجل التغيير — بحيث تبقى كل المستندات الداعمة مرتبطة بالتغيير.",
  "Enforced workflows that make non-compliance structurally impossible: a change cannot advance with a required step skipped or a signatory missing.":
    "سير عمل مفروض يجعل عدم الامتثال مستحيلاً هيكلياً: لا يمكن أن يتقدم التغيير مع تخطي خطوة مطلوبة أو غياب موقّع.",
  "Risk assessment embedded in the request itself, not an optional attachment added after approval; ensuring hazard identification and control documentation happen before commitment to a change, not after implementation.":
    "تقييم المخاطر مدمج في الطلب نفسه، لا كمرفق اختياري يُضاف بعد الاعتماد؛ بما يضمن حدوث تحديد المخاطر وتوثيق الضوابط قبل الالتزام بالتغيير، لا بعد تنفيذه.",
  "PSSR built into change closure, confirming safe implementation is a mandatory workflow step, not an optional post-change checklist that can be skipped under operational pressure.":
    "مراجعة السلامة قبل بدء التشغيل مدمجة في إغلاق التغيير، وتأكيد التنفيذ الآمن خطوة إلزامية في سير العمل، لا قائمة تحقق اختيارية بعد التغيير يمكن تخطيها تحت ضغط التشغيل.",
  "Full end-to-end integration with Permit to Work, Incident Management, Risk Register and Action Management, changes exist within the wider safety management system, not in isolation.":
    "تكامل كامل من البداية إلى النهاية مع تصريح العمل وإدارة الحوادث وسجل المخاطر وإدارة الإجراءات، بحيث توجد التغييرات ضمن نظام إدارة السلامة الأوسع، لا بمعزل عنه.",
  "Built to support ISO 45001, OSHA PSM, Seveso III, COMAH, API RP 750, IEC 61511 and industry-specific change control requirements across oil and gas, chemicals, pharma and energy.":
    "مصممة لدعم ISO 45001 وOSHA PSM وSeveso III وCOMAH وAPI RP 750 وIEC 61511 ومتطلبات ضبط التغيير الخاصة بالصناعات في النفط والغاز والكيماويات والأدوية والطاقة.",
  "Permanently searchable change history turns audit preparation from a multi-day document scramble into a few clicks, with every decision and sign-off instantly retrievable.":
    "يحوّل سجل التغييرات القابل للبحث الدائم التحضير للتدقيق من عملية بحث مستندات تستغرق أياماً إلى بضع نقرات، مع إمكانية استرجاع كل قرار وتوقيع فوراً.",
  "Trusted by Process Safety Teams Across High-Hazard Industries": "موثوقة من فرق سلامة العمليات في الصناعات عالية الخطورة",
  "What is Management of Change (MoC)?": "ما هي إدارة التغيير (MoC)؟",
  "Why use a digital MoC system rather than paper or email-based change control?": "لماذا استخدام نظام رقمي لإدارة التغيير بدلاً من ضبط التغيير الورقي أو عبر البريد الإلكتروني؟",
  "What types of changes can the module handle?": "ما أنواع التغييرات التي تتعامل معها الوحدة؟",
  "How does the module integrate with Permit to Work?": "كيف تتكامل الوحدة مع تصريح العمل؟",
  "Which compliance frameworks and regulatory standards does the module support?": "ما أطر الامتثال والمعايير التنظيمية التي تدعمها الوحدة؟",
  "What is a Pre-Startup Safety Review (PSSR), and how does the module handle it?": "ما هي مراجعة السلامة قبل بدء التشغيل، وكيف تتعامل معها الوحدة؟",
  "How does the module maintain an auditable change record?": "كيف تحافظ الوحدة على سجل تغيير قابل للتدقيق؟",
  "Ready to Take Control of Change?": "هل أنت مستعد للسيطرة على التغيير؟",
  "Authorise and control high-hazard work linked to approved changes — with enforced digital permit workflows, isolation management and live permit visibility.":
    "اعتمد وتحكّم في العمل عالي الخطورة المرتبط بتغييرات معتمدة — بسير عمل تصاريح رقمي مفروض، وإدارة عزل، ورؤية فورية للتصاريح.",
  "Link post-change incidents to the change record that preceded them, supporting root cause investigation and demonstrating that the change control process was followed correctly.":
    "اربط الحوادث اللاحقة للتغيير بسجل التغيير الذي سبقها، بما يدعم تحقيق السبب الجذري ويثبت اتباع عملية ضبط التغيير بشكل صحيح.",
  "Identify and document hazards introduced by proposed changes; risk assessments embedded in the MoC workflow connect directly to the wider risk register.":
    "حدّد ووثّق المخاطر التي تُدخلها التغييرات المقترحة؛ ترتبط تقييمات المخاطر المدمجة في سير عمل إدارة التغيير مباشرة بسجل المخاطر الأوسع.",
  "Track corrective actions arising from MoC reviews, PSSR findings and post-implementation audits with ownership, deadlines and full closure accountability.":
    "تتبّع الإجراءات التصحيحية الناشئة عن مراجعات إدارة التغيير ونتائج مراجعة السلامة قبل بدء التشغيل والتدقيقات اللاحقة للتنفيذ بمسؤولية ومواعيد نهائية ومساءلة إغلاق كاملة.",
  "Plan and conduct process safety and management system audits where MoC records and change histories are accessible as audit evidence without manual assembly.":
    "خطّط لتدقيقات سلامة العمليات ونظام الإدارة ونفّذها حيث تكون سجلات إدارة التغيير وتاريخ التغييرات متاحة كأدلة تدقيق دون تجميع يدوي.",

  // ── /modules/legal-register ───────────────────────────────────────────────
  "Never Miss a": "لا تفوّت أبداً",
  "Compliance": "امتثال",
  "Obligation Again": "التزاماً بعد الآن",
  "EHSWatch Legal Register brings every applicable environmental, health, safety and quality regulation, obligation and deadline into one structured place. Access and manage all your EHSQ legal requirements centrally, tailor compliance workflows to your organisation, and let automated notifications keep every task on track.":
    "تجمع وحدة السجل القانوني من EHSWatch كل لائحة والتزام وموعد نهائي بيئي وصحي وسلامي وجودي ساري المفعول في مكان واحد منظم. اطّلع على كل متطلباتك القانونية للصحة والسلامة والبيئة وأدرها مركزياً، وخصّص سير عمل الامتثال ليناسب مؤسستك، ودع الإشعارات التلقائية تبقي كل مهمة على المسار الصحيح.",
  "Track every regulation, deadline and duty — with reminders that keep you ahead.":
    "تتبّع كل لائحة وموعد نهائي والتزام — بتذكيرات تبقيك متقدماً.",
  "Compliance rarely fails because of one big oversight. It fails in the gaps — a regulation that changed without anyone noticing, a renewal deadline buried in a spreadsheet, an obligation owed by someone who has since left. Track all this manually across several sites, and something eventually slips, often surfacing only during an audit.":
    "نادراً ما يفشل الامتثال بسبب إغفال كبير واحد. بل يفشل في الفجوات — لائحة تغيّرت دون أن يلاحظ أحد، أو موعد تجديد مدفون في جدول بيانات، أو التزام يقع على عاتق شخص غادر منذ ذلك الحين. تتبّع كل هذا يدوياً عبر عدة مواقع، وسيفلت شيء ما في النهاية، وغالباً ما يظهر فقط أثناء التدقيق.",
  "EHSWatch Legal Register closes those gaps. Every applicable law and obligation lives in one register, mapped to the site it affects. Responsibilities are assigned, deadlines tracked, and automated reminders prompt the right people before anything falls due — so you move from scrambling to prove compliance to demonstrating it with confidence.":
    "تسد وحدة السجل القانوني من EHSWatch هذه الفجوات. يعيش كل قانون والتزام ساري المفعول في سجل واحد، مرتبط بالموقع الذي يؤثر فيه. تُسند المسؤوليات، وتُتبَّع المواعيد النهائية، وتحث الإشعارات التلقائية الأشخاص المناسبين قبل استحقاق أي شيء — بحيث تنتقل من التسابق لإثبات الامتثال إلى إثباته بثقة.",
  "Why Legal Register?": "لماذا السجل القانوني؟",
  "See Legal Register in Action": "شاهد السجل القانوني أثناء العمل",
  "Everything your team needs to stay compliant, organised and audit-ready.":
    "كل ما يحتاجه فريقك للبقاء ممتثلاً ومنظماً وجاهزاً للتدقيق.",
  "Centralised Compliance Register": "سجل امتثال مركزي",
  "Store all applicable laws, regulations, standards, codes of practice and permit conditions in one secure register — categorised by jurisdiction, topic area, business unit and site.":
    "خزّن كل القوانين واللوائح والمعايير ومدونات الممارسة وشروط التصاريح السارية في سجل آمن واحد — مصنَّفة حسب النطاق القانوني ومجال الموضوع ووحدة العمل والموقع.",
  "Jurisdiction & Site Filtering": "تصفية حسب النطاق القانوني والموقع",
  "Obligation Ownership & Assignment": "ملكية الالتزامات وإسنادها",
  "Assign every regulatory requirement to a named owner with a defined review date and compliance responsibility — so each obligation has someone accountable and a deadline by which it must be addressed.":
    "أسند كل متطلب تنظيمي إلى مالك محدد بتاريخ مراجعة ومسؤولية امتثال محددين — بحيث يكون لكل التزام شخص مسؤول وموعد نهائي يجب معالجته بحلوله.",
  "Compliance Tracking Status": "حالة تتبع الامتثال",
  "Monitor the status of every obligation in real time across sites, jurisdictions and topic areas — with leadership dashboards that surface what needs immediate attention, no manual register review required.":
    "راقب حالة كل التزام في الوقت الفعلي عبر المواقع والنطاقات القانونية ومجالات الموضوعات — بلوحات معلومات للقيادة تكشف ما يحتاج اهتماماً فورياً، دون حاجة لمراجعة السجل يدوياً.",
  "Review & Update Workflows": "سير عمل للمراجعة والتحديث",
  "Manage periodic reviews through configurable workflows — with assigned reviewers, deadlines, documented outcomes and automatic escalation for overdue reviews — creating the governance evidence ISO management standards require.":
    "أدر المراجعات الدورية عبر سير عمل قابل للتخصيص — بمراجعين مُسندين ومواعيد نهائية ونتائج موثقة وتصعيد تلقائي للمراجعات المتأخرة — مما يوفر أدلة الحوكمة التي تتطلبها معايير إدارة ISO.",
  "Compliance Audit Trail": "مسار تدقيق الامتثال",
  "Every change — additions, updates, status changes, review completions and regulatory amendments — is logged with a timestamp and user attribution, retrievable instantly for inspections, ISO audits and post-incident investigations.":
    "يُسجَّل كل تغيير — إضافات وتحديثات وتغييرات حالة واستكمال مراجعات وتعديلات تنظيمية — بطابع زمني ونسب للمستخدم، وقابل للاسترجاع فوراً للتفتيش وتدقيقات ISO وتحقيقات ما بعد الحوادث.",
  "A single source of compliance truth, replacing scattered spreadsheets with one live register mapped to every site and obligation.":
    "مصدر واحد لحقيقة الامتثال، يستبدل جداول البيانات المتناثرة بسجل حي واحد مرتبط بكل موقع والتزام.",
  "Proactive, not reactive, with automated reminders that prompt action before a deadline passes, rather than flagging it after.":
    "استباقية لا رد فعل، بإشعارات تلقائية تحث على الإجراء قبل انقضاء الموعد النهائي، لا الإبلاغ عنه بعد فوات الأوان.",
  "Built-in CAPA management, so any gap or non-compliance flows straight into tracked corrective actions instead of a separate to-do list.":
    "إدارة CAPA مدمجة، بحيث تنتقل أي فجوة أو عدم امتثال مباشرة إلى إجراءات تصحيحية متتبَّعة بدلاً من قائمة مهام منفصلة.",
  "Part of a unified EHSQ platform, connecting legal obligations with audits, risk assessments and wider workflows for joined-up compliance.":
    "جزء من منصة EHSQ موحدة، تربط الالتزامات القانونية بالتدقيقات وتقييمات المخاطر وسير العمل الأوسع لامتثال متكامل.",
  "Audit-ready by default, with accurate record-keeping and a clear compliance status you can demonstrate in seconds, not days.":
    "جاهزة للتدقيق افتراضياً، بحفظ سجلات دقيق وحالة امتثال واضحة يمكنك إثباتها في ثوانٍ، لا أيام.",
  "Cost-effective by design, delivering significant savings over the manual, labour-intensive methods of maintaining a legal register.":
    "فعّالة من حيث التكلفة بالتصميم، توفّر وفورات كبيرة مقارنة بالطرق اليدوية كثيفة العمالة لصيانة سجل قانوني.",
  "Trusted by Compliance and Safety Teams Across Industries": "موثوقة من فرق الامتثال والسلامة في مختلف القطاعات",
  "What is a legal register and why do I need one?": "ما هو السجل القانوني ولماذا أحتاج إليه؟",
  "How does EHSWatch Legal Register help with deadlines?": "كيف يساعد السجل القانوني من EHSWatch في المواعيد النهائية؟",
  "Can I maintain separate registers for different sites?": "هل يمكنني الاحتفاظ بسجلات منفصلة لمواقع مختلفة؟",
  "Does it help manage corrective actions?": "هل تساعد في إدارة الإجراءات التصحيحية؟",
  "How secure is our compliance data?": "ما مدى أمان بيانات الامتثال لدينا؟",
  "Can EHSWatch Legal Register integrate with other modules?": "هل يمكن للسجل القانوني من EHSWatch التكامل مع وحدات أخرى؟",
  "Ready to Take Control of Compliance?": "هل أنت مستعد للسيطرة على الامتثال؟",
  "Plan and conduct audits, drawing on your legal register to verify compliance against the obligations that apply to each site.":
    "خطّط للتدقيقات ونفّذها، بالاستناد إلى سجلك القانوني للتحقق من الامتثال مقابل الالتزامات السارية على كل موقع.",
  "Identify hazards and document controls, linking legal requirements to the risks they govern.":
    "حدّد المخاطر ووثّق الضوابط، واربط المتطلبات القانونية بالمخاطر التي تحكمها.",
  "Assign, track and close the corrective actions raised against compliance gaps, with full ownership and audit trail.":
    "أسند الإجراءات التصحيحية المثارة ضد فجوات الامتثال وتتبعها وأغلقها، بمسؤولية كاملة ومسار تدقيق.",
  "Report and investigate incidents, connecting regulatory reporting duties to the obligations in your register.":
    "أبلغ عن الحوادث وحقق فيها، واربط واجبات الإبلاغ التنظيمي بالالتزامات في سجلك.",
  "Apply AI to inspection data to detect recurring finding patterns, predict high-risk inspection areas and generate compliant.":
    "طبّق الذكاء الاصطناعي على بيانات التفتيش لاكتشاف أنماط النتائج المتكررة، والتنبؤ بمناطق التفتيش عالية الخطورة، وإنشاء تقارير امتثال.",

  // ── /modules/inspections ──────────────────────────────────────────────────
  "Turn Every Inspection Into Actionable Safety": "حوّل كل تفتيش إلى سلامة قابلة للتنفيذ",
  "Intelligence": "استخباراتية",
  "EHSWatch Inspections lets your teams create, schedule, conduct and analyse safety inspections from any device — with configurable checklists tailored to each site, asset or task type, automatic corrective action assignment and real-time analytics that surface risk trends before they become incidents.":
    "تتيح وحدة التفتيش من EHSWatch لفرقك إنشاء تفتيشات السلامة وجدولتها وإجراءها وتحليلها من أي جهاز — بقوائم تحقق قابلة للتخصيص مصممة لكل موقع أو أصل أو نوع مهمة، وإسناد تلقائي للإجراءات التصحيحية، وتحليلات فورية تكشف اتجاهات المخاطر قبل أن تصبح حوادث.",
  "Shift from reactive checks to proactive risk control — one inspection at a time.":
    "انتقل من الفحوصات التفاعلية إلى التحكم الاستباقي في المخاطر — تفتيشاً واحداً في كل مرة.",
  "Why Inspections?": "لماذا التفتيش؟",
  "Manual inspections are slow, inconsistent and hard to act on. Findings sit in notebooks for days before they are typed up, follow-up actions are assigned by email and lost in inboxes, and leadership only sees a safety problem once it has grown into a recordable incident or a failed audit.":
    "التفتيشات اليدوية بطيئة وغير متسقة ويصعب التصرف بناءً عليها. تبقى النتائج في الدفاتر أياماً قبل كتابتها، وتُسند إجراءات المتابعة عبر البريد الإلكتروني وتضيع في صناديق الوارد، ولا ترى القيادة مشكلة السلامة إلا بعد أن تتحول إلى حادثة قابلة للتسجيل أو تدقيق فاشل.",
  "EHSWatch Inspections closes that gap. Field teams capture findings on any device — including offline at remote sites — while corrective actions are raised, assigned and tracked automatically within the same platform. Standardised templates keep every inspection consistent, and real-time analytics surface recurring trends before they escalate.":
    "تسد وحدة التفتيش من EHSWatch هذه الفجوة. تلتقط فرق الميدان النتائج من أي جهاز — بما في ذلك دون اتصال في المواقع النائية — بينما تُثار الإجراءات التصحيحية وتُسند وتُتبَّع تلقائياً ضمن المنصة نفسها. تحافظ القوالب الموحدة على اتساق كل تفتيش، وتكشف التحليلات الفورية الاتجاهات المتكررة قبل تصاعدها.",
  "See Inspections in Action": "شاهد التفتيش أثناء العمل",
  "From inspection scheduling to corrective action closure — all in one connected workflow.":
    "من جدولة التفتيش إلى إغلاق الإجراء التصحيحي — كل ذلك في سير عمل واحد متصل.",
  "Configurable Inspection Templates": "قوالب تفتيش قابلة للتخصيص",
  "Build checklists tailored to each site, asset, work type or regulation — with custom question types and scoring. Standardised templates deploy across every location, so each site is inspected to the same standard, with results in one consolidated view for leadership.":
    "ابنِ قوائم تحقق مصممة لكل موقع أو أصل أو نوع عمل أو لائحة — بأنواع أسئلة وتقييم مخصصة. تُنشَر القوالب الموحدة عبر كل موقع، بحيث يُفتَّش كل موقع بنفس المعيار، مع النتائج في عرض موحد واحد للقيادة.",
  "Flexible Scheduling": "جدولة مرنة",
  "Schedule one-off, recurring and ad-hoc inspections in advance, with automated reminders to inspectors and supervisors so nothing is missed. Recurring schedules are managed centrally and visible across the platform in real time.":
    "جدول التفتيشات لمرة واحدة والمتكررة والعرضية مسبقاً، مع تذكيرات تلقائية للمفتشين والمشرفين بحيث لا يُفوَّت شيء. تُدار الجداول المتكررة مركزياً ومرئية عبر المنصة في الوقت الفعلي.",
  "Mobile & Offline Data Capture": "التقاط بيانات عبر الجوال ودون اتصال",
  "Conduct inspections and capture findings from any smartphone or tablet — including offline in remote, underground or low-signal sites. Data syncs automatically when connectivity returns, with no manual upload step.":
    "أجرِ التفتيشات والتقط النتائج من أي هاتف ذكي أو جهاز لوحي — بما في ذلك دون اتصال في المواقع النائية أو تحت الأرض أو ضعيفة الإشارة. تتزامن البيانات تلقائياً عند عودة الاتصال، دون خطوة رفع يدوية.",
  "Automatic Corrective Action Assignment": "إسناد تلقائي للإجراءات التصحيحية",
  "Convert findings directly into tracked corrective actions — with owners, due dates, priorities and escalation paths — no manual re-entry. Actions flow automatically into Action Tracker for full closure accountability.":
    "حوّل النتائج مباشرة إلى إجراءات تصحيحية متتبَّعة — بمسؤولين ومواعيد استحقاق وأولويات ومسارات تصعيد — دون إعادة إدخال يدوية. تتدفق الإجراءات تلقائياً إلى متعقب الإجراءات لمساءلة إغلاق كاملة.",
  "Monitor completion rates, open findings, overdue actions and recurring hazard patterns across sites, teams and time periods through live dashboards and exportable reports — shifting inspections into a forward-looking risk tool.":
    "راقب معدلات الإنجاز والنتائج المفتوحة والإجراءات المتأخرة وأنماط المخاطر المتكررة عبر المواقع والفرق والفترات الزمنية من خلال لوحات معلومات حية وتقارير قابلة للتصدير — محوّلاً التفتيش إلى أداة مخاطر استشرافية.",
  "Every record — checklist responses, findings, photo evidence, corrective actions and closure confirmations — is stored with a complete, timestamped audit trail, exportable for regulatory inspections, ISO audits and insurance reviews.":
    "يُخزَّن كل سجل — ردود قوائم التحقق والنتائج وأدلة الصور والإجراءات التصحيحية وتأكيدات الإغلاق — بمسار تدقيق كامل موثَّق زمنياً، قابل للتصدير للتفتيش التنظيمي وتدقيقات ISO ومراجعات التأمين.",
  "Part of a unified EHSQ platform, so every finding flows straight into actions, incidents and wider workflows; nothing is logged and forgotten.":
    "جزء من منصة EHSQ موحدة، بحيث تتدفق كل نتيجة مباشرة إلى الإجراءات والحوادث وسير العمل الأوسع؛ لا يُسجَّل شيء ثم يُنسى.",
  "Built for high-risk, multi-site operations, with a single source of truth for frontline inspectors and HSE leadership alike.":
    "مصممة للعمليات عالية الخطورة متعددة المواقع، بمصدر حقيقة واحد لمفتشي الخطوط الأمامية وقيادة الصحة والسلامة على حد سواء.",
  "Offline-ready mobile access that captures findings anywhere and syncs instantly once connected, ensuring inspection coverage is never limited by signal availability.":
    "وصول جوال جاهز للعمل دون اتصال يلتقط النتائج في أي مكان ويتزامن فوراً عند الاتصال، بما يضمن ألا تكون تغطية التفتيش محدودة أبداً بتوفر الإشارة.",
  "Unlimited users, so every team member can inspect and report without licence limits.":
    "مستخدمون غير محدودين، بحيث يمكن لكل عضو فريق التفتيش والإبلاغ دون حدود ترخيص.",
  "Configurable templates built for high-risk, multi-site operations — one platform that replaces multiple disconnected inspection tools and gives HSE leadership a single source of truth across the organisation.":
    "قوالب قابلة للتخصيص مصممة للعمليات عالية الخطورة متعددة المواقع — منصة واحدة تستبدل أدوات تفتيش متعددة منفصلة وتمنح قيادة الصحة والسلامة مصدر حقيقة واحد عبر المؤسسة.",
  "Trusted by Safety Inspection Teams Across Industries": "موثوقة من فرق تفتيش السلامة في مختلف القطاعات",
  "What types of inspections does EHSWatch Inspections support?": "ما أنواع التفتيش التي تدعمها وحدة التفتيش من EHSWatch؟",
  "Can we customise inspection templates and checklists?": "هل يمكننا تخصيص قوالب التفتيش وقوائم التحقق؟",
  "Are EHSWatch Inspections available on mobile devices?": "هل وحدة التفتيش من EHSWatch متاحة على الأجهزة المحمولة؟",
  "Can we schedule recurring inspections automatically?": "هل يمكننا جدولة تفتيشات متكررة تلقائياً؟",
  "How do inspection findings convert into corrective actions?": "كيف تتحول نتائج التفتيش إلى إجراءات تصحيحية؟",
  "Can inspection records be used as compliance evidence?": "هل يمكن استخدام سجلات التفتيش كأدلة امتثال؟",
  "What analytics and reporting does the module provide?": "ما التحليلات والتقارير التي توفرها الوحدة؟",
  "Ready to Make Every Inspection Count?": "هل أنت مستعد لجعل كل تفتيش ذا قيمة؟",
  "Report and investigate incidents identified during or triggered by inspections — with root cause analysis, investigation workflows and regulatory reporting outputs.":
    "أبلغ عن الحوادث المحددة أثناء التفتيشات أو الناتجة عنها وحقق فيها — بتحليل السبب الجذري وسير عمل التحقيق ومخرجات الإبلاغ التنظيمي.",
  "Assign, monitor and close corrective actions from inspection findings — with defined ownership, due dates, escalation paths and a complete closure audit trail.":
    "أسند الإجراءات التصحيحية من نتائج التفتيش وراقبها وأغلقها — بمسؤولية محددة ومواعيد استحقاق ومسارات تصعيد ومسار تدقيق إغلاق كامل.",
  "Identify hazards and document controls — use inspection trend data to validate control effectiveness and update risk assessments based on field findings.":
    "حدّد المخاطر ووثّق الضوابط — استخدم بيانات اتجاهات التفتيش للتحقق من فعالية الضوابط وتحديث تقييمات المخاطر بناءً على النتائج الميدانية.",
  "Capture unsafe acts and unsafe conditions between formal inspections — observations and inspections together provide a complete picture of field safety conditions.":
    "سجّل الأفعال والظروف غير الآمنة بين التفتيشات الرسمية — توفر الملاحظات والتفتيشات معاً صورة كاملة لظروف السلامة الميدانية.",
  "Apply AI to inspection data to detect recurring finding patterns, predict high-risk inspection areas and generate compliance trend insights automatically.":
    "طبّق الذكاء الاصطناعي على بيانات التفتيش لاكتشاف أنماط النتائج المتكررة، والتنبؤ بمناطق التفتيش عالية الخطورة، وإنشاء رؤى اتجاهات الامتثال تلقائياً.",

  // ── /modules/file-management ──────────────────────────────────────────────
  "Control Your Critical Documents With": "تحكّم في مستنداتك الحيوية بـ",
  "Confidence": "ثقة",
  "EHSWatch File Management gives your teams one secure, centralised place to store, organise, access and manage critical files — from safety policies and SOPs to work instructions, permit templates, risk assessments and compliance records. Every document is version-controlled, access-protected and searchable.":
    "تمنح وحدة إدارة الملفات من EHSWatch فرقك مكاناً آمناً ومركزياً واحداً لتخزين الملفات الحيوية وتنظيمها والوصول إليها وإدارتها — من سياسات السلامة وإجراءات التشغيل الموحدة إلى تعليمات العمل وقوالب التصاريح وتقييمات المخاطر وسجلات الامتثال. كل مستند خاضع للتحكم بالإصدارات ومحمي بالوصول وقابل للبحث.",
  "Built for ISO 45001, 9001 and 14001 document control.": "مصممة لضبط المستندات وفق ISO 45001 وISO 9001 وISO 14001.",
  "Why File Management?": "لماذا إدارة الملفات؟",
  "In many organisations, critical safety and compliance documents are still scattered across desktop folders, shared drives, inboxes and disconnected cloud storage. The result is predictable: teams work from outdated versions without knowing it, documents miss their review cycles because no one is tracking them, and assembling an audit trail takes hours.":
    "في العديد من المؤسسات، لا تزال مستندات السلامة والامتثال الحيوية مبعثرة عبر مجلدات سطح المكتب ومحركات الأقراص المشتركة وصناديق الوارد وتخزين سحابي منفصل. والنتيجة متوقعة: تعمل الفرق من نسخ قديمة دون أن تدري، وتفوت المستندات دورات مراجعتها لأن لا أحد يتتبعها، ويستغرق تجميع مسار التدقيق ساعات.",
  "EHSWatch File Management replaces that fragmentation with a controlled document environment — one system where every file has a current version, a review schedule, an approval record and a complete change history. So when your next ISO audit or inspection arrives, your documentation is already in order.":
    "تستبدل وحدة إدارة الملفات من EHSWatch هذا التشتت ببيئة مستندات محكومة — نظام واحد يكون فيه لكل ملف إصدار حالي وجدول مراجعة وسجل اعتماد وتاريخ تغيير كامل. بحيث تكون مستنداتك منظمة بالفعل عند وصول تدقيق أو تفتيش ISO القادم.",
  "See File Management in Action": "شاهد إدارة الملفات أثناء العمل",
  "Everything your team needs to manage documents securely, efficiently and with full compliance visibility.":
    "كل ما يحتاجه فريقك لإدارة المستندات بأمان وكفاءة ورؤية امتثال كاملة.",
  "Centralised Repository": "مستودع مركزي",
  "Store safety policies, procedures, work instructions, permit templates, risk assessments and compliance records in one secure, structured location — accessible to the right people from any device, across every site.":
    "خزّن سياسات السلامة والإجراءات وتعليمات العمل وقوالب التصاريح وتقييمات المخاطر وسجلات الامتثال في موقع آمن ومنظم واحد — يمكن للأشخاص المناسبين الوصول إليه من أي جهاز، عبر كل موقع.",
  "Access Control": "التحكم في الوصول",
  "Keep documents visible and editable only by authorised users, with permissions configurable by role, department, site or category — protecting sensitive files without restricting legitimate operational access.":
    "أبقِ المستندات مرئية وقابلة للتعديل فقط من قبل المستخدمين المصرَّح لهم، بصلاحيات قابلة للتخصيص حسب الدور أو القسم أو الموقع أو الفئة — لحماية الملفات الحساسة دون تقييد الوصول التشغيلي المشروع.",
  "Advanced Search & Filtering": "بحث وتصفية متقدمان",
  "Locate any document instantly by keyword, category, type, site, date range or review status — eliminating time lost to manual folder navigation across disconnected storage systems.":
    "حدّد موقع أي مستند فوراً بالكلمة المفتاحية أو الفئة أو النوع أو الموقع أو نطاق التاريخ أو حالة المراجعة — لإلغاء الوقت الضائع في تصفح المجلدات يدوياً عبر أنظمة تخزين منفصلة.",
  "Version Control": "التحكم بالإصدارات",
  "Maintain a complete, timestamped version history for every document, so teams always work from the latest approved version — with the full revision trail retained and audit-ready, no manual record-keeping.":
    "احتفظ بتاريخ إصدارات كامل موثَّق زمنياً لكل مستند، بحيث تعمل الفرق دائماً من أحدث نسخة معتمدة — مع الاحتفاظ بمسار المراجعة الكامل وجاهزيته للتدقيق، دون حفظ سجلات يدوي.",
  "Review & Approval Workflows": "سير عمل للمراجعة والاعتماد",
  "Manage the full document lifecycle through configurable review and approval workflows — with reviewer assignments, response deadlines and documented approvals that satisfy ISO and internal governance requirements.":
    "أدر دورة حياة المستند الكاملة عبر سير عمل مراجعة واعتماد قابل للتخصيص — بإسناد مراجعين ومواعيد استجابة نهائية واعتمادات موثقة تلبي متطلبات ISO والحوكمة الداخلية.",
  "Audit Trail Visibility": "رؤية مسار التدقيق",
  "Every action — upload, revision, review, approval, version change and access — is logged with a timestamp and user attribution, giving you a complete trail for audits, inspections and governance reviews.":
    "يُسجَّل كل إجراء — رفع ومراجعة وموافقة وتغيير إصدار ووصول — بطابع زمني ونسب للمستخدم، مما يمنحك مساراً كاملاً للتدقيقات والتفتيش ومراجعات الحوكمة.",
  "Rapid deployment within the wider EHSWatch platform, without needing disconnected document tools.":
    "نشر سريع ضمن منصة EHSWatch الأوسع، دون الحاجة إلى أدوات مستندات منفصلة.",
  "Document lifecycle automation ensures review schedules are met without manual intervention — reducing the risk of expired safety documents being accessed and used in the field.":
    "تضمن أتمتة دورة حياة المستند الوفاء بجداول المراجعة دون تدخل يدوي — مما يقلل خطر الوصول إلى مستندات سلامة منتهية الصلاحية واستخدامها في الميدان.",
  "Configurable approval workflows provide the documented governance trail required by ISO 45001 Clause 7.5, ISO 9001 Clause 7.5 and ISO 14001 Clause 7.5 document control requirements.":
    "يوفر سير عمل الاعتماد القابل للتخصيص مسار الحوكمة الموثَّق المطلوب بموجب متطلبات ضبط المستندات في البند 7.5 من ISO 45001 والبند 7.5 من ISO 9001 والبند 7.5 من ISO 14001.",
  "Supports secure collaboration while maintaining document governance and approval discipline.":
    "يدعم التعاون الآمن مع الحفاظ على حوكمة المستندات وانضباط الاعتماد.",
  "What is EHSWatch File Management?": "ما هي وحدة إدارة الملفات من EHSWatch؟",
  "Can we control who has access to specific documents?": "هل يمكننا التحكم في من لديه وصول إلى مستندات معينة؟",
  "Can we search for documents easily?": "هل يمكننا البحث عن المستندات بسهولة؟",
  "How does version control work?": "كيف يعمل التحكم بالإصدارات؟",
  "How does it support ISO 45001 and other compliance standards?": "كيف تدعم ISO 45001 ومعايير الامتثال الأخرى؟",
  "Can the module automate document review reminders?": "هل يمكن للوحدة أتمتة تذكيرات مراجعة المستندات؟",
  "How secure is document storage?": "ما مدى أمان تخزين المستندات؟",
  "Ready to Take Control of Your Documents?": "هل أنت مستعد للسيطرة على مستنداتك؟",
  "Plan, conduct and close compliance, internal and supplier audits":
    "خطّط لتدقيقات الامتثال والتدقيقات الداخلية وتدقيقات الموردين ونفّذها وأغلقها",
  "Capture and investigate incidents with structured workflows — link the relevant procedures and SOPs to every investigation record and corrective action.":
    "سجّل الحوادث وحقق فيها بسير عمل منظم — اربط الإجراءات وإجراءات التشغيل الموحدة ذات الصلة بكل سجل تحقيق وإجراء تصحيحي.",
  "Assign and close corrective and preventive actions — attach supporting documents and completion evidence to every action record for a complete, auditable closure trail.":
    "أسند الإجراءات التصحيحية والوقائية وأغلقها — أرفق المستندات الداعمة وأدلة الإنجاز بكل سجل إجراء لمسار إغلاق كامل وقابل للتدقيق.",
  "Identify hazards, evaluate risks and document controls in a structured workflow":
    "حدّد المخاطر وقيّمها ووثّق الضوابط ضمن سير عمل منظم",
  "Use AI-powered insights to identify patterns, surface risks and support faster decision-making":
    "استخدم رؤى مدعومة بالذكاء الاصطناعي لتحديد الأنماط وكشف المخاطر ودعم اتخاذ قرارات أسرع",

  // ── /modules/emergency-response-drills ────────────────────────────────────
  "Real": "استجابة",
  "EHSWatch Emergency Response Drills gives safety teams a structured, data-driven way to plan, execute, evaluate and improve emergency drills — from fire evacuations and spill responses to lockdowns and confined-space rescue scenarios.":
    "تمنح وحدة تدريبات الاستجابة للطوارئ من EHSWatch فرق السلامة طريقة منظمة ومبنية على البيانات لتخطيط تدريبات الطوارئ وتنفيذها وتقييمها وتحسينها — من إخلاء الحرائق والاستجابة للانسكابات إلى الإغلاق الأمني وسيناريوهات الإنقاذ في الأماكن المحصورة.",
  "Turn every drill into a better-prepared workplace.": "حوّل كل تدريب إلى مكان عمل أفضل استعداداً.",
  "Why Emergency Response Drills Management?": "لماذا إدارة تدريبات الاستجابة للطوارئ؟",
  "Most high-risk industries are required to run regular emergency drills. But meeting that requirement and genuinely improving readiness are two different things. Drills run without structured evaluation, documented findings and tracked corrective actions prove compliance, not improvement.":
    "يُطلب من معظم الصناعات عالية الخطورة إجراء تدريبات طوارئ منتظمة. لكن الوفاء بهذا المتطلب وتحسين الاستعداد فعلياً أمران مختلفان. تُثبت التدريبات التي تُجرى دون تقييم منظم ونتائج موثقة وإجراءات تصحيحية متتبَّعة الامتثال فقط، لا التحسن.",
  "EHSWatch Emergency Response Drills bridges that gap. Every drill is planned with clear objectives, monitored during execution, scored against predefined criteria and connected to improvement actions tracked to closure — so each drill makes the next real response faster and more coordinated.":
    "تسد وحدة تدريبات الاستجابة للطوارئ من EHSWatch هذه الفجوة. يُخطَّط لكل تدريب بأهداف واضحة، ويُراقَب أثناء التنفيذ، ويُسجَّل مقابل معايير محددة مسبقاً، ويُربَط بإجراءات تحسين متتبَّعة حتى الإغلاق — بحيث يجعل كل تدريب الاستجابة الحقيقية التالية أسرع وأكثر تنسيقاً.",
  "See Emergency Response Drills In Action": "شاهد تدريبات الاستجابة للطوارئ أثناء العمل",
  "Stop running drills in the dark. Start measuring them with clarity.": "توقف عن إجراء التدريبات عشوائياً. ابدأ بقياسها بوضوح.",
  "Drill Planning & Scheduling": "تخطيط التدريبات وجدولتها",
  "Plan fire, evacuation, spill and other scenarios in advance — with defined objectives, participant lists, resources and site-specific settings — and automated reminders that notify the right people ahead of time, reducing missed drills.":
    "خطّط لسيناريوهات الحرائق والإخلاء والانسكابات وغيرها مسبقاً — بأهداف وقوائم مشاركين وموارد وإعدادات خاصة بالموقع محددة — وتذكيرات تلقائية تُشعر الأشخاص المناسبين مسبقاً، مما يقلل التدريبات الفائتة.",
  "Real-Time Monitoring": "مراقبة فورية",
  "Track participation, timing and response quality as drills unfold, giving facilitators a live picture of how the emergency response is performing — not just a post-event summary.":
    "تتبّع المشاركة والتوقيت وجودة الاستجابة أثناء سير التدريبات، مما يمنح الميسرين صورة حية لأداء استجابة الطوارئ — لا مجرد ملخص بعد الحدث.",
  "Scenario-Based Execution": "تنفيذ قائم على السيناريوهات",
  "Support multiple drill types across different sites, roles and emergency scenarios from one central workflow, so every exercise follows a consistent, comparable process.":
    "ادعم أنواع تدريبات متعددة عبر مواقع وأدوار وسيناريوهات طوارئ مختلفة من سير عمل مركزي واحد، بحيث يتبع كل تمرين عملية متسقة وقابلة للمقارنة.",
  "Evaluation & Scoring": "التقييم والتسجيل",
  "Assess outcomes against predefined criteria, identify response strengths and gaps, and score overall readiness — creating a consistent, comparable record across every drill event.":
    "قيّم النتائج مقابل معايير محددة مسبقاً، وحدّد نقاط قوة الاستجابة وفجواتها، وسجّل الاستعداد العام — لإنشاء سجل متسق وقابل للمقارنة عبر كل حدث تدريب.",
  "Improvement Plans & Corrective Actions": "خطط التحسين والإجراءات التصحيحية",
  "Convert evaluation findings directly into tracked corrective actions with assigned owners, due dates and closure requirements — linked to Action Tracker for full follow-through accountability.":
    "حوّل نتائج التقييم مباشرة إلى إجراءات تصحيحية متتبَّعة بمسؤولين مُسندين ومواعيد استحقاق ومتطلبات إغلاق — مرتبطة بمتعقب الإجراءات لمساءلة متابعة كاملة.",
  "Live Analytics & Trend Reporting": "تحليلات حية وتقارير اتجاهات",
  "Access dashboards showing completion rates, response-time trends, recurring gaps, and action close-out rates — giving safety leaders the data to drive continuous improvement in preparedness.":
    "اطّلع على لوحات معلومات تُظهر معدلات الإنجاز واتجاهات وقت الاستجابة والفجوات المتكررة ومعدلات إغلاق الإجراءات — لتزويد قادة السلامة بالبيانات لدفع التحسين المستمر في الاستعداد.",
  "Full drill lifecycle in one platform — from advanced scheduling through live execution, corrective action assignment and closure.":
    "دورة حياة تدريب كاملة في منصة واحدة — من الجدولة المسبقة إلى التنفيذ الحي وإسناد الإجراءات التصحيحية والإغلاق.",
  "Real-time monitoring during drill execution gives facilitators a live picture, not just a post-event summary.":
    "توفر المراقبة الفورية أثناء تنفيذ التدريب صورة حية للميسرين، لا مجرد ملخص بعد الحدث.",
  "Direct integration with Incident Management and Audit Management — drill findings feed into the same corrective action and compliance record as actual safety events.":
    "تكامل مباشر مع إدارة الحوادث وإدارة التدقيق — تُغذّي نتائج التدريب نفس سجل الإجراءات التصحيحية والامتثال الخاص بأحداث السلامة الفعلية.",
  "Mobile-accessible for facilitators and field teams — run, score and document drills from any device during live execution.":
    "قابلة للوصول عبر الجوال للميسرين وفرق الميدان — أجرِ التدريبات وسجّلها ووثّقها من أي جهاز أثناء التنفيذ الحي.",
  "Generates regulatory-ready compliance evidence with a full audit trail of schedules, attendance, scores, findings and improvement actions.":
    "تُنشئ أدلة امتثال جاهزة تنظيمياً بمسار تدقيق كامل للجداول والحضور والنتائج ونتائج التقييم وإجراءات التحسين.",
  "Trusted by Emergency Preparedness Teams Across High-Risk Industries": "موثوقة من فرق الاستعداد للطوارئ في الصناعات عالية الخطورة",
  "What is the EHSWatch Emergency Response Drills module?": "ما هي وحدة تدريبات الاستجابة للطوارئ من EHSWatch؟",
  "Can we manage different types of emergency drills in the same system?": "هل يمكننا إدارة أنواع مختلفة من تدريبات الطوارئ في النظام نفسه؟",
  "Can we track who participates in each drill?": "هل يمكننا تتبع من يشارك في كل تدريب؟",
  "Can drill records be used as evidence during regulatory inspections or audits?": "هل يمكن استخدام سجلات التدريبات كأدلة أثناء التفتيش أو التدقيقات التنظيمية؟",
  "How does it help us improve, not just document?": "كيف تساعدنا في التحسن، لا مجرد التوثيق؟",
  "Can we schedule drills in advance and send reminders automatically?": "هل يمكننا جدولة التدريبات مسبقاً وإرسال تذكيرات تلقائياً؟",
  "Is the module accessible on mobile devices?": "هل الوحدة متاحة على الأجهزة المحمولة؟",
  "Ready to Run Drills That Actually Improve Readiness?": "هل أنت مستعد لإجراء تدريبات تحسّن الاستعداد فعلياً؟",
  "Capture and investigate incidents faster with structured workflows, root cause analysis and full investigation records.":
    "سجّل الحوادث وحقق فيها بشكل أسرع بسير عمل منظم وتحليل سبب جذري وسجلات تحقيق كاملة.",
  "Plan and run compliance audits with configurable checklists, findings capture and direct CAPA integration.":
    "خطّط لتدقيقات الامتثال وشغّلها بقوائم تحقق قابلة للتخصيص والتقاط نتائج وتكامل مباشر مع CAPA.",
  "Assign, track and close corrective and preventive actions with defined ownership, escalation and audit trail.":
    "أسند الإجراءات التصحيحية والوقائية وتتبعها وأغلقها بمسؤولية محددة وتصعيد ومسار تدقيق.",
  "Identify hazards, score risk levels and document controls to prevent incidents before they occur.":
    "حدّد المخاطر وسجّل مستوياتها ووثّق الضوابط لمنع الحوادث قبل وقوعها.",
  "Digitise high-risk work authorisation with configurable approvals, linked controls and live permit visibility.":
    "رقمن اعتماد العمل عالي الخطورة بموافقات قابلة للتخصيص وضوابط مرتبطة ورؤية فورية للتصاريح.",

  // ── /modules/customer-complaints ──────────────────────────────────────────
  "Every Complaint Deserves a Clear": "تستحق كل شكوى",
  "Resolution": "حلاً واضحاً",
  "No more scattered logs, delayed responses or missed follow-ups. EHSWatch Customer Complaints gives your team a structured, end-to-end workflow to capture, assign, investigate and resolve every complaint with full visibility. Part of the unified EHSQ platform, it links complaints to non-conformance, corrective actions and quality reporting — driving measurable improvement.":
    "لا مزيد من السجلات المتناثرة أو الردود المتأخرة أو المتابعات الفائتة. تمنح وحدة شكاوى العملاء من EHSWatch فريقك سير عمل منظماً من البداية إلى النهاية لتسجيل كل شكوى وإسنادها والتحقيق فيها وحلها برؤية كاملة. كجزء من منصة EHSQ الموحدة، تربط الشكاوى بعدم المطابقة والإجراءات التصحيحية وتقارير الجودة — لدفع تحسن قابل للقياس.",
  "See every complaint move from intake to resolution in one connected system.":
    "شاهد كل شكوى تنتقل من الاستلام إلى الحل في نظام واحد متصل.",
  "Why Customer Complaints Management?": "لماذا إدارة شكاوى العملاء؟",
  "Complaints handled slowly, inconsistently or without a documented investigation trail damage customer trust, expose organisations to regulatory scrutiny and repeat the same root causes because no one connected the complaint to a corrective action.":
    "تضر الشكاوى التي تُعالَج ببطء أو بتناقض أو دون مسار تحقيق موثَّق بثقة العملاء، وتعرّض المؤسسات لتدقيق تنظيمي، وتكرر نفس الأسباب الجذرية لأن لا أحد ربط الشكوى بإجراء تصحيحي.",
  "EHSWatch Customer Complaints replaces manual complaint tracking with a structured, accountable workflow. Every complaint is captured in one system, routed to the right handler, investigated with a documented trail and closed with evidence — giving quality managers and leadership real-time visibility over response performance and complaint trends.":
    "تستبدل وحدة شكاوى العملاء من EHSWatch تتبع الشكاوى اليدوي بسير عمل منظم وخاضع للمساءلة. تُسجَّل كل شكوى في نظام واحد، وتُوجَّه إلى المعالج المناسب، ويُحقَّق فيها بمسار موثَّق، وتُغلَق بأدلة — مما يمنح مديري الجودة والقيادة رؤية فورية لأداء الاستجابة واتجاهات الشكاوى.",
  "See Customer Complaints in Action": "شاهد شكاوى العملاء أثناء العمل",
  "Stop juggling complaints manually. Start resolving them systematically.": "توقف عن إدارة الشكاوى يدوياً. ابدأ بحلها منهجياً.",
  "Centralised Complaint Management": "إدارة شكاوى مركزية",
  "Capture and manage complaints in one organised platform with complete visibility from initial reporting through investigation to closure — no spreadsheets, no shared inboxes.":
    "سجّل الشكاوى وأدرها في منصة منظمة واحدة برؤية كاملة من الإبلاغ الأولي عبر التحقيق حتى الإغلاق — دون جداول بيانات، ودون صناديق وارد مشتركة.",
  "Configurable Routing & Workflows": "توجيه وسير عمل قابلان للتخصيص",
  "Direct each complaint to the right team or individual based on type, severity, product category or site, and tailor complaint categories, investigation steps, escalation paths and approvals to your specific quality processes and customer commitments — ensuring timely assignment without manual triage.":
    "وجّه كل شكوى إلى الفريق أو الفرد المناسب بناءً على النوع أو الخطورة أو فئة المنتج أو الموقع، وخصّص فئات الشكاوى وخطوات التحقيق ومسارات التصعيد والموافقات لعمليات الجودة والتزامات العملاء الخاصة بك — بما يضمن إسناداً في الوقت المناسب دون فرز يدوي.",
  "Progress Tracking": "تتبع التقدم",
  "Monitor every complaint from submission to resolution, including all actions taken, communications made and documents attached — with a full, timestamped audit trail.":
    "راقب كل شكوى من التقديم إلى الحل، بما في ذلك كل الإجراءات المتخذة والاتصالات التي جرت والمستندات المرفقة — بمسار تدقيق كامل موثَّق زمنياً.",
  "Automatic Notifications": "إشعارات تلقائية",
  "Set up configurable email and in-app alerts for new complaints, approaching deadlines and overdue responses — keeping all relevant stakeholders informed at every stage.":
    "أعدّ تنبيهات بريد إلكتروني وداخل التطبيق قابلة للتخصيص للشكاوى الجديدة والمواعيد النهائية المقتربة والردود المتأخرة — لإبقاء كل الأطراف المعنية مطّلعة في كل مرحلة.",
  "Reporting & Trend Analytics": "تقارير وتحليلات اتجاهات",
  "Generate complaint volume reports, resolution time analyses and root cause trend summaries to identify systemic quality issues and demonstrate continuous improvement to customers and auditors.":
    "أنشئ تقارير حجم الشكاوى وتحليلات وقت الحل وملخصات اتجاهات الأسباب الجذرية لتحديد مشكلات الجودة المنهجية وإثبات التحسن المستمر للعملاء والمدققين.",
  "API Connectivity": "اتصال عبر واجهة برمجة التطبيقات",
  "Connect to your existing CRM, ERP or customer service systems via API to centralise complaint-related data and eliminate duplicate record-keeping across platforms.":
    "اتصل بأنظمة إدارة علاقات العملاء أو تخطيط موارد المؤسسة أو خدمة العملاء الحالية لديك عبر واجهة برمجة التطبيقات لمركزة البيانات المتعلقة بالشكاوى وإلغاء حفظ السجلات المكررة عبر المنصات.",
  "Built within the unified EHSQ platform — complaints connect directly to non-conformance records, CAPA workflows and quality performance dashboards without manual data transfer.":
    "مبنية ضمن منصة EHSQ الموحدة — تتصل الشكاوى مباشرة بسجلات عدم المطابقة وسير عمل CAPA ولوحات معلومات أداء الجودة دون نقل بيانات يدوي.",
  "Workflow automation helps reduce manual effort and accelerate response.": "تساعد أتمتة سير العمل في تقليل الجهد اليدوي وتسريع الاستجابة.",
  "Integrated root cause analysis tools such as 8D, 5-Why and Fishbone ensure every complaint drives a documented corrective action, not just a response.":
    "تضمن أدوات تحليل السبب الجذري المدمجة مثل 8D والأسباب الخمسة ومخطط إيشيكاوا أن تدفع كل شكوى إجراءً تصحيحياً موثَّقاً، لا مجرد رد.",
  "Analytics and trend reporting give quality managers and leadership the data they need to identify systemic issues and demonstrate programme effectiveness.":
    "تمنح التحليلات وتقارير الاتجاهات مديري الجودة والقيادة البيانات التي يحتاجونها لتحديد المشكلات المنهجية وإثبات فعالية البرنامج.",
  "Complete audit trail supports ISO 9001 quality management audits, regulatory inspections and customer satisfaction reviews.":
    "يدعم مسار التدقيق الكامل تدقيقات إدارة الجودة وفق ISO 9001 والتفتيش التنظيمي ومراجعات رضا العملاء.",
  "Trusted by Quality and EHSQ Teams Across Industries": "موثوقة من فرق الجودة وEHSQ في مختلف القطاعات",
  "What does the Customer Complaints module do?": "ماذا تفعل وحدة شكاوى العملاء؟",
  "Can the module be configured for our specific complaint handling process?": "هل يمكن تخصيص الوحدة لعملية معالجة الشكاوى الخاصة بنا؟",
  "Does it integrate with our CRM or ERP system?": "هل تتكامل مع نظام إدارة علاقات العملاء أو تخطيط موارد المؤسسة لدينا؟",
  "How does the module support ISO 9001 compliance?": "كيف تدعم الوحدة الامتثال لـ ISO 9001؟",
  "Can different complaint types be assigned to different handlers automatically?": "هل يمكن إسناد أنواع شكاوى مختلفة إلى معالجين مختلفين تلقائياً؟",
  "Ready to Manage Customer Complaints with More Speed and Control?": "هل أنت مستعد لإدارة شكاوى العملاء بسرعة وتحكم أكبر؟",
  "Record, investigate and close non-conformances across safety, quality and environmental processes with full corrective action tracking.":
    "سجّل حالات عدم المطابقة عبر عمليات السلامة والجودة والبيئة وحقق فيها وأغلقها بتتبع كامل للإجراءات التصحيحية.",
  "Assign, track and close corrective actions from complaints, audits and incidents with defined ownership and escalation.":
    "أسند الإجراءات التصحيحية من الشكاوى والتدقيقات والحوادث وتتبعها وأغلقها بمسؤولية محددة وتصعيد.",
  "Plan and conduct ISO 9001 quality audits with configurable checklists and direct findings-to-CAPA integration.":
    "خطّط لتدقيقات جودة ISO 9001 ونفّذها بقوائم تحقق قابلة للتخصيص وتكامل مباشر من النتائج إلى CAPA.",
  "Capture and investigate workplace incidents, near misses and safety observations through a structured workflow.":
    "سجّل حوادث مكان العمل والحوادث الوشيكة وملاحظات السلامة وحقق فيها عبر سير عمل منظم.",

  // ── /modules/audit-management ─────────────────────────────────────────────
  "Plan Every": "خطّط لكل",
  "Audit": "تدقيق",
  ". Close Every Gap.": ". وأغلق كل فجوة.",
  "Move beyond scattered checklists and disconnected records. EHSWatch Audit Management gives compliance, HSE and quality teams one platform to plan audits, run structured assessments, capture findings, and drive every gap to closure. From ISO 45001 and supplier assessments to internal audits and regulatory reviews, manage every audit type in one place.":
    "تجاوز قوائم التحقق المتناثرة والسجلات المنفصلة. تمنح وحدة إدارة التدقيق من EHSWatch فرق الامتثال والصحة والسلامة والجودة منصة واحدة لتخطيط التدقيقات وإجراء تقييمات منظمة والتقاط النتائج ودفع كل فجوة نحو الإغلاق. من ISO 45001 وتقييمات الموردين إلى التدقيقات الداخلية والمراجعات التنظيمية، أدر كل نوع تدقيق في مكان واحد.",
  "Run every audit with more structure, better visibility, and faster follow-through.":
    "أجرِ كل تدقيق بمزيد من التنظيم ورؤية أفضل ومتابعة أسرع.",
  "Why Audit Management?": "لماذا إدارة التدقيق؟",
  "Most organisations manage audits across a mix of spreadsheets, PDF checklists, email chains and shared drives. Findings get recorded but not followed up. The same gaps appear in consecutive audits. Leadership has no consolidated view of compliance performance across sites.":
    "تدير معظم المؤسسات التدقيقات عبر مزيج من جداول البيانات وقوائم تحقق بصيغة PDF وسلاسل بريد إلكتروني ومحركات أقراص مشتركة. تُسجَّل النتائج لكن لا تُتابَع. تظهر نفس الفجوات في تدقيقات متتالية. لا تملك القيادة رؤية موحدة لأداء الامتثال عبر المواقع.",
  "EHSWatch Audit Management replaces that fragmentation with a connected audit lifecycle — from scheduling and preparation through to execution, finding capture, corrective action assignment and closure. Every audit produces a measurable, documented improvement rather than just a report that sits in a folder.":
    "تستبدل وحدة إدارة التدقيق من EHSWatch هذا التشتت بدورة حياة تدقيق متصلة — من الجدولة والتحضير عبر التنفيذ والتقاط النتائج وإسناد الإجراءات التصحيحية والإغلاق. يُنتج كل تدقيق تحسناً موثَّقاً وقابلاً للقياس بدلاً من مجرد تقرير يبقى في مجلد.",
  "See Audit Management In Action": "شاهد إدارة التدقيق أثناء العمل",
  "From audit planning to action closure, everything stays connected.": "من تخطيط التدقيق إلى إغلاق الإجراء، يبقى كل شيء متصلاً.",
  "Audit Planning & Scheduling": "تخطيط التدقيق وجدولته",
  "Organise compliance, supplier, internal and site audits through a structured digital workflow with advanced scheduling, resource allocation and objective-setting.":
    "نظّم تدقيقات الامتثال والموردين والتدقيقات الداخلية وتدقيقات المواقع عبر سير عمل رقمي منظم بجدولة متقدمة وتخصيص موارد وتحديد أهداف.",
  "Configurable Audit Checklists": "قوائم تحقق تدقيق قابلة للتخصيص",
  "Mobile Execution & Real-Time Findings": "تنفيذ عبر الجوال ونتائج فورية",
  "Auditors conduct assessments in the field from any smartphone or tablet, capturing observations, photos, non-conformances and improvement opportunities in real time — with offline capability for remote sites and all data kept current, categorised and accessible.":
    "يجري المدققون التقييمات في الميدان من أي هاتف ذكي أو جهاز لوحي، ويلتقطون الملاحظات والصور وحالات عدم المطابقة وفرص التحسين في الوقت الفعلي — مع إمكانية العمل دون اتصال للمواقع النائية وبقاء كل البيانات محدَّثة ومصنَّفة ويمكن الوصول إليها.",
  "Centralised Collaboration": "تعاون مركزي",
  "Give auditors, site managers and leadership a shared platform for audit tasks, progress updates and sign-offs — replacing fragmented email with structured, auditable workflows.":
    "امنح المدققين ومديري المواقع والقيادة منصة مشتركة لمهام التدقيق وتحديثات التقدم والتوقيعات — لاستبدال البريد الإلكتروني المتشتت بسير عمل منظم وقابل للتدقيق.",
  "Analytics & Reporting": "تحليلات وتقارير",
  "Generate audit completion reports, trends and gap summaries that help leadership track compliance performance across sites, identify recurring issues and demonstrate continuous improvement.":
    "أنشئ تقارير إنجاز التدقيق والاتجاهات وملخصات الفجوات التي تساعد القيادة على تتبع أداء الامتثال عبر المواقع وتحديد المشكلات المتكررة وإثبات التحسن المستمر.",
  "Complete Audit Trail": "مسار تدقيق كامل",
  "Every audit record — findings, attachments, corrective actions and closure evidence — is stored with a full, timestamped audit trail for ISO certification audits, regulatory inspections and internal governance reviews.":
    "يُخزَّن كل سجل تدقيق — النتائج والمرفقات والإجراءات التصحيحية وأدلة الإغلاق — بمسار تدقيق كامل موثَّق زمنياً لتدقيقات اعتماد ISO والتفتيش التنظيمي ومراجعات الحوكمة الداخلية.",
  "Built on a unified EHSQ platform, so audits do not sit in isolation, giving leadership a consolidated view of compliance performance.":
    "مبنية على منصة EHSQ موحدة، بحيث لا تبقى التدقيقات معزولة، مما يمنح القيادة رؤية موحدة لأداء الامتثال.",
  "Mobile-accessible for field auditors — no paper, no retrospective data entry, no version control issues.":
    "قابلة للوصول عبر الجوال للمدققين الميدانيين — دون ورق، ودون إدخال بيانات لاحق، ودون مشكلات في التحكم بالإصدارات.",
  "Advanced analytics surface recurring gaps and compliance trends across sites, helping organisations move from reactive audit management to continuous improvement.":
    "تكشف التحليلات المتقدمة الفجوات المتكررة واتجاهات الامتثال عبر المواقع، مما يساعد المؤسسات على الانتقال من إدارة التدقيق التفاعلية إلى التحسين المستمر.",
  "Built and maintained by a team with a deep understanding of ISO management system requirements and sector-specific compliance obligations.":
    "مبنية ومصانة من قبل فريق لديه فهم عميق لمتطلبات نظام إدارة ISO والتزامات الامتثال الخاصة بكل قطاع.",
  "Trusted by Compliance-Focused Organisations Across Industries": "موثوقة من المؤسسات المهتمة بالامتثال في مختلف القطاعات",
  "What types of audits does EHSWatch Audit Management support?": "ما أنواع التدقيقات التي تدعمها وحدة إدارة التدقيق من EHSWatch؟",
  "Can the audit module be customised for our organisation?": "هل يمكن تخصيص وحدة التدقيق لمؤسستنا؟",
  "How does the module handle audit findings and corrective actions?": "كيف تتعامل الوحدة مع نتائج التدقيق والإجراءات التصحيحية؟",
  "Can auditors use it on mobile devices?": "هل يمكن للمدققين استخدامها على الأجهزة المحمولة؟",
  "How does EHSWatch improve audit collaboration?": "كيف تحسّن EHSWatch التعاون في التدقيق؟",
  "How does EHSWatch support compliance with ISO 45001 and other standards?": "كيف تدعم EHSWatch الامتثال لـ ISO 45001 ومعايير أخرى؟",
  "Ready to Strengthen Your Audit Programme?": "هل أنت مستعد لتعزيز برنامج التدقيق لديك؟",
  "Assign, track and close corrective and preventive actions with full ownership and audit trail.":
    "أسند الإجراءات التصحيحية والوقائية وتتبعها وأغلقها بمسؤولية كاملة ومسار تدقيق.",
  "Manage incidents, near misses and investigations through a structured workflow from report to closure.":
    "أدر الحوادث والحوادث الوشيكة والتحقيقات عبر سير عمل منظم من الإبلاغ إلى الإغلاق.",
  "Identify hazards, assess risk levels and document controls to support safer operational decisions.":
    "حدّد المخاطر وقيّم مستوياتها ووثّق الضوابط لدعم قرارات تشغيلية أكثر أماناً.",
  "Conduct digital inspections with configurable checklists, instant findings capture and follow-up workflows.":
    "أجرِ تفتيشات رقمية بقوائم تحقق قابلة للتخصيص والتقاط فوري للنتائج وسير عمل متابعة.",
  "Automatically surface audit finding patterns and generate compliance insights across your EHSQ data.":
    "اكشف تلقائياً أنماط نتائج التدقيق وأنشئ رؤى امتثال عبر بيانات EHSQ لديك.",

  // ── /modules/hse-observations ──────────────────────────────────────────────
  "See Risks": "شاهد المخاطر",
  "Earlier": "مبكراً",
  ". Act Before Incidents Happen.": ". وتصرّف قبل وقوع الحوادث.",
  "EHSWatch HSE Observations gives every level of your organisation — from frontline workers to supervisors and HSE leaders — a fast, structured way to report what they see in the field, classify it correctly and trigger the right response before an observation becomes a recordable event.":
    "تمنح وحدة ملاحظات الصحة والسلامة من EHSWatch كل مستوى في مؤسستك — من عمال الخطوط الأمامية إلى المشرفين وقادة الصحة والسلامة — طريقة سريعة ومنظمة للإبلاغ عما يرونه في الميدان، وتصنيفه بشكل صحيح، وإطلاق الاستجابة المناسبة قبل أن تصبح الملاحظة حدثاً قابلاً للتسجيل.",
  "Stop reacting to incidents. Start acting on the observations that precede them.":
    "توقف عن رد الفعل تجاه الحوادث. ابدأ بالتصرف بناءً على الملاحظات التي تسبقها.",
  "Why HSE Observations?": "لماذا ملاحظات الصحة والسلامة؟",
  "In many organisations, observations are still reported informally — through phone calls, handwritten notes, WhatsApp messages or spreadsheets. That makes it nearly impossible to track trends, respond consistently, demonstrate proactive safety management to regulators, or prove that reporting is driving improvement rather than just generating paperwork.":
    "في العديد من المؤسسات، لا تزال الملاحظات تُبلَّغ بشكل غير رسمي — عبر مكالمات هاتفية أو ملاحظات مكتوبة بخط اليد أو رسائل واتساب أو جداول بيانات. مما يجعل من شبه المستحيل تتبع الاتجاهات، أو الاستجابة بشكل متسق، أو إثبات إدارة السلامة الاستباقية للجهات التنظيمية، أو إثبات أن الإبلاغ يدفع التحسن لا مجرد توليد أعمال ورقية.",
  "EHSWatch HSE Observations captures reports through intuitive forms built for fast completion, routes each one automatically to the responsible person, and tracks it through to acknowledgement and corrective action. Managers gain instant visibility into recurring trends and site-level risk signals — so observation data becomes a prevention tool, not just a reporting metric.":
    "تلتقط وحدة ملاحظات الصحة والسلامة من EHSWatch التقارير عبر نماذج بديهية مصممة للإنجاز السريع، وتوجّه كل واحدة تلقائياً إلى الشخص المسؤول، وتتبعها حتى الإقرار والإجراء التصحيحي. يكتسب المديرون رؤية فورية للاتجاهات المتكررة وإشارات المخاطر على مستوى الموقع — بحيث تصبح بيانات الملاحظات أداة وقاية، لا مجرد مقياس إبلاغ.",
  "See HSE Observations in Action": "شاهد ملاحظات الصحة والسلامة أثناء العمل",
  "Everything your team needs to build a proactive safety reporting culture.":
    "كل ما يحتاجه فريقك لبناء ثقافة إبلاغ سلامة استباقية.",
  "Easy Observation Reporting": "إبلاغ سهل عن الملاحظات",
  "Submit observations through simple, mobile-optimised forms built for fast completion by frontline workers — with offline capture on remote or low-signal sites that syncs automatically once connectivity returns, so no observation is ever lost.":
    "قدّم الملاحظات عبر نماذج بسيطة محسَّنة للجوال ومصممة للإنجاز السريع من قبل عمال الخطوط الأمامية — مع التقاط دون اتصال في المواقع النائية أو ضعيفة الإشارة يتزامن تلقائياً عند عودة الاتصال، بحيث لا تُفقد أي ملاحظة أبداً.",
  "Unsafe Acts & Conditions Classification": "تصنيف الأفعال والظروف غير الآمنة",
  "Positive Safety Reinforcement": "تعزيز السلامة الإيجابي",
  "Recognise and reinforce safe behaviours through a dedicated positive observation category, supporting a culture where recognition is as visible as hazard reporting.":
    "اعترف بالسلوكيات الآمنة وعزّزها من خلال فئة ملاحظة إيجابية مخصصة، لدعم ثقافة يكون فيها التقدير مرئياً بقدر الإبلاغ عن المخاطر.",
  "Real-Time Alerts": "تنبيهات فورية",
  "Notify relevant personnel the moment an observation is submitted, enabling quicker review, acknowledgement and corrective action — because faster notification means faster intervention.":
    "أشعر الأفراد المعنيين لحظة تقديم الملاحظة، مما يتيح مراجعة وإقراراً وإجراءً تصحيحياً أسرع — لأن الإشعار الأسرع يعني تدخلاً أسرع.",
  "Trend & Pattern Analysis": "تحليل الاتجاهات والأنماط",
  "Identify recurring unsafe conditions, repeated behavioural patterns and high-risk areas across sites, teams and time periods, so teams can take targeted preventive action.":
    "حدّد الظروف غير الآمنة المتكررة والأنماط السلوكية المتكررة والمناطق عالية الخطورة عبر المواقع والفرق والفترات الزمنية، بحيث يمكن للفرق اتخاذ إجراء وقائي مستهدف.",
  "Connected, Multi-Site Platform": "منصة متصلة متعددة المواقع",
  "Link observations with Action Tracker, Incident and Audit Management to build a true operational safety record — with site-level filtering and consolidated cross-site dashboards for enterprise-wide visibility.":
    "اربط الملاحظات بمتعقب الإجراءات وإدارة الحوادث والتدقيق لبناء سجل سلامة تشغيلي حقيقي — بتصفية على مستوى الموقع ولوحات معلومات موحدة عبر المواقع لرؤية على مستوى المؤسسة.",
  "Rapid deployment with minimal IT dependency.": "نشر سريع باعتماد أدنى على تقنية المعلومات.",
  "Designed by EHS professionals who understand the realities of field reporting.":
    "مصممة من قبل متخصصي صحة وسلامة يفهمون واقع الإبلاغ الميداني.",
  "Encourages reporting participation without making the process feel administrative or complex.":
    "تشجع على المشاركة في الإبلاغ دون أن تجعل العملية تبدو إدارية أو معقدة.",
  "Strengthens both risk prevention and positive behaviour recognition.": "تعزز كلاً من الوقاية من المخاطر والاعتراف بالسلوك الإيجابي.",
  "Gives managers immediate visibility into trends, recurring issues and intervention priorities.":
    "تمنح المديرين رؤية فورية للاتجاهات والمشكلات المتكررة وأولويات التدخل.",
  "Fits naturally into a connected EHSQ platform rather than functioning as a standalone reporting tool.":
    "تندمج بشكل طبيعي في منصة EHSQ متصلة بدلاً من العمل كأداة إبلاغ مستقلة.",
  "Trusted By EHSQ Teams Across High-Risk Industries": "موثوقة من فرق EHSQ في الصناعات عالية الخطورة",
  "What are EHSWatch HSE Observations?": "ما هي ملاحظات الصحة والسلامة من EHSWatch؟",
  "What types of observations can be reported?": "ما أنواع الملاحظات التي يمكن الإبلاغ عنها؟",
  "Is the observation form easy for frontline teams to complete?": "هل نموذج الملاحظة سهل الإكمال لفرق الخطوط الأمامية؟",
  "Does the module work offline?": "هل تعمل الوحدة دون اتصال؟",
  "Can observation categories be customised?": "هل يمكن تخصيص فئات الملاحظات؟",
  "How do HSE Observations support leading indicator reporting?": "كيف تدعم ملاحظات الصحة والسلامة الإبلاغ عن المؤشرات الاستباقية؟",
  "Can we identify recurring safety trends?": "هل يمكننا تحديد اتجاهات السلامة المتكررة؟",
  "Who typically uses this module?": "من يستخدم هذه الوحدة عادة؟",
  "Can the module support multiple sites?": "هل يمكن للوحدة دعم مواقع متعددة؟",
  "Ready to Build a Safety Observation Programme That Actually Prevents Incidents?":
    "هل أنت مستعد لبناء برنامج ملاحظات سلامة يمنع الحوادث فعلياً؟",
  "Capture and investigate incidents with structured workflows — link observation trends directly to the incident types they precede and the root causes they reveal.":
    "سجّل الحوادث وحقق فيها بسير عمل منظم — اربط اتجاهات الملاحظات مباشرة بأنواع الحوادث التي تسبقها والأسباب الجذرية التي تكشفها.",
  "Plan and conduct site safety audits — use observation trend data to prioritise audit focus areas, direct inspection resources and validate the effectiveness of corrective actions.":
    "خطّط لتدقيقات سلامة الموقع ونفّذها — استخدم بيانات اتجاهات الملاحظات لتحديد أولويات مجالات تركيز التدقيق وتوجيه موارد التفتيش والتحقق من فعالية الإجراءات التصحيحية.",
  "Identify hazards and document controls — observation data provides field-level evidence for risk assessment updates and control effectiveness reviews across sites.":
    "حدّد المخاطر ووثّق الضوابط — توفر بيانات الملاحظات أدلة على المستوى الميداني لتحديثات تقييم المخاطر ومراجعات فعالية الضوابط عبر المواقع.",
  "Assign, track and close corrective actions generated by observations — with defined ownership, escalation paths and a complete audit trail from observation to verified closure.":
    "أسند الإجراءات التصحيحية الناتجة عن الملاحظات وتتبعها وأغلقها — بمسؤولية محددة ومسارات تصعيد ومسار تدقيق كامل من الملاحظة إلى الإغلاق الموثَّق.",

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

  // ── /iris — lead-in text node before the highlighted "more on the way." span.
  "6 AI agents available today,": "6 وكلاء ذكاء اصطناعي متاحون اليوم،",

  // ── /product — remaining 6 module cards (revealed by "View more"), missed
  // by the earlier static-HTML extraction pass since they're client-toggled.
  "Control operational and process changes with structured reviews, risk assessments, approvals, and full implementation traceability.":
    "التحكم في التغييرات التشغيلية والإجرائية من خلال مراجعات منظمة وتقييمات مخاطر وموافقات وتتبع كامل للتنفيذ.",
  "Maintain a central record of legal and regulatory obligations so your teams can monitor updates and stay audit-ready.":
    "الاحتفاظ بسجل مركزي للالتزامات القانونية والتنظيمية بحيث يمكن لفرقك مراقبة التحديثات والبقاء جاهزة للتدقيق.",
  "Manage training records, competency requirements, certification expiries, and gap analysis to keep every worker qualified and current.":
    "إدارة سجلات التدريب ومتطلبات الكفاءة وتواريخ انتهاء الشهادات وتحليل الفجوات للحفاظ على تأهيل جميع العمال وتحديثه.",
  "Digitise high-risk work permits with configurable approvals, linked controls, expiry tracking, and live permit visibility.":
    "رقمنة تصاريح العمل عالية الخطورة بموافقات قابلة للتخصيص وضوابط مرتبطة وتتبع انتهاء الصلاحية ورؤية فورية للتصاريح.",
  "Record non-conformances across safety, quality and environmental processes, investigate root causes, assign corrective actions, and monitor closure to prevent recurrence.":
    "تسجيل حالات عدم المطابقة عبر عمليات السلامة والجودة والبيئة، والتحقيق في الأسباب الجذرية، وإسناد الإجراءات التصحيحية، ومراقبة الإغلاق لمنع التكرار.",
  "Capture meeting decisions, assign actions live, and track follow-through so safety commitments do not get lost after the meeting ends.":
    "تسجيل قرارات الاجتماعات، وإسناد الإجراءات مباشرة، وتتبع المتابعة حتى لا تُفقد التزامات السلامة بعد انتهاء الاجتماع.",
  "View less": "عرض أقل",

  // ── /pricing — "Build Your Package" wizard (4 steps) + FAQ. Descriptions
  // here are package-builder-specific wording, shorter than /product's
  // module-card copy — distinct strings, not duplicates.
  "Build Your Package": "أنشئ باقتك",
  "Build Your": "أنشئ",
  "Package": "باقتك",
  "Select what you need and we will put together a tailored proposal.":
    "حدد ما تحتاجه وسنقوم بإعداد عرض مخصص لك.",
  "Advanced Features (Add-Ons)": "ميزات متقدمة (إضافات)",
  "Organisation Details": "بيانات المؤسسة",
  "Get Proposal": "احصل على عرض",
  "Step": "الخطوة",
  "of": "من",
  "Select the applications you need in your organisation": "حدد التطبيقات التي تحتاجها مؤسستك",
  "Tick every module you need. The package summary on the right updates live.":
    "حدد كل وحدة تحتاجها. يتحدث ملخص الباقة على اليمين مباشرة.",
  "Track corrective actions to closure with accountability.": "تتبّع الإجراءات التصحيحية حتى إغلاقها مع المساءلة.",
  "8D Report": "تقرير 8D",
  "Structured 8-discipline problem-solving reports.": "تقارير حل مشكلات منظمة بمنهجية الانضباطات الثمانية (8D).",
  "Plan audits, capture findings, close compliance gaps.": "خطّط للتدقيقات، وسجّل النتائج، وأغلق فجوات الامتثال.",
  "Communications": "الاتصالات",
  "Share safety alerts, updates and bulletins org-wide.": "شارك تنبيهات السلامة والتحديثات والنشرات على مستوى المؤسسة.",
  "Structured complaints workflow with full audit trail.": "سير عمل منظم للشكاوى مع سجل تدقيق كامل.",
  "Schedule drills and capture lessons learned.": "جدول التدريبات وسجّل الدروس المستفادة.",
  "Version-controlled EHSQ documents with access control.": "وثائق EHSQ بإصدارات موثقة وتحكم في الوصول.",
  "HSE Monthly Statistics": "إحصاءات الصحة والسلامة الشهرية",
  "Aggregate and report monthly HSE performance data.": "تجميع بيانات أداء الصحة والسلامة الشهرية وإعداد تقاريرها.",
  "HSE Plans": "خطط الصحة والسلامة",
  "Build and track health & safety plans across sites.": "أنشئ خطط الصحة والسلامة وتتبعها عبر المواقع.",
  "Capture unsafe acts and positive safety behaviours.": "سجّل التصرفات غير الآمنة والسلوكيات الإيجابية للسلامة.",
  "Conduct digital inspections with custom checklists.": "نفّذ عمليات تفتيش رقمية بقوائم تحقق مخصصة.",
  "Report, investigate and close incidents end-to-end.": "أبلغ عن الحوادث وحقق فيها وأغلقها من البداية للنهاية.",
  "Track regulatory obligations and stay audit-ready.": "تتبّع الالتزامات التنظيمية وابقَ جاهزاً للتدقيق.",
  "Capture decisions and track action follow-through.": "سجّل القرارات وتتبّع متابعة الإجراءات.",
  "Mutual Aid": "المساعدة المتبادلة",
  "Coordinate shared resources and emergency assistance.": "نسّق الموارد المشتركة والمساعدة في حالات الطوارئ.",
  "Non Conformance": "عدم المطابقة",
  "Record, investigate and prevent recurring issues.": "سجّل المشكلات المتكررة وحقق فيها وامنع تكرارها.",
  "Digitise high-risk work permits with approval workflows.": "رقمنة تصاريح العمل عالية الخطورة بسير عمل الموافقات.",
  "Risk Assessments": "تقييمات المخاطر",
  "Identify hazards, assess risk and document controls.": "حدّد المخاطر وقيّمها ووثّق الضوابط.",
  "Survey": "استبيان",
  "Create and distribute safety culture surveys.": "أنشئ استبيانات ثقافة السلامة ووزّعها.",
  "Manage training records and certification expiries.": "أدر سجلات التدريب وتواريخ انتهاء الشهادات.",
  "Your Package": "باقتك",
  "No applications selected yet": "لم يتم اختيار أي تطبيقات بعد",
  "Complete all steps to receive a tailored proposal from our team.":
    "أكمل جميع الخطوات لتصلك عرضاً مخصصاً من فريقنا.",
  // Advanced Features (Add-Ons) step.
  "Enhance your EHSWatch experience (optional)": "عزّز تجربتك مع EHSWatch (اختياري)",
  "API Integrations": "تكاملات API",
  "Connect with existing systems": "الاتصال بالأنظمة الحالية",
  "WhatsApp Reporting": "الإبلاغ عبر واتساب",
  "Report incidents directly from WhatsApp": "أبلغ عن الحوادث مباشرة من واتساب",
  "IRIS AI": "الذكاء الاصطناعي IRIS",
  "AI incident analysis & smart insights": "تحليل الحوادث بالذكاء الاصطناعي ورؤى ذكية",
  "Single Sign On (SSO)": "تسجيل الدخول الموحد (SSO)",
  "Azure / Google / Active Directory login": "تسجيل الدخول عبر Azure / Google / Active Directory",
  "HR Integration": "تكامل الموارد البشرية",
  "Sync users from your HRMS": "مزامنة المستخدمين من نظام إدارة الموارد البشرية لديك",
  "3rd Party BI Connector": "موصل ذكاء أعمال خارجي",
  "Power BI / Tableau connectivity": "الاتصال بـ Power BI / Tableau",
  // Organisation Details step.
  "Tell us about your organisation so we can size the proposal.":
    "أخبرنا عن مؤسستك حتى نتمكن من تحديد حجم العرض المناسب.",
  "Number of Employees": "عدد الموظفين",
  "Select Number of Employees": "حدد عدد الموظفين",
  "Number of Sites": "عدد المواقع",
  "Select Number of Sites": "حدد عدد المواقع",
  "Industry": "القطاع",
  "Select Industry": "حدد القطاع",
  "Organisation": "المؤسسة",
  "Chemical & Pharma": "الكيماويات والأدوية",
  "Facilities Management": "إدارة المرافق",
  "Healthcare": "الرعاية الصحية",
  "Manufacturing": "التصنيع",
  "Mining": "التعدين",
  "Oil & Gas": "النفط والغاز",
  "Retail": "التجزئة",
  "Transportation & Logistics": "النقل والخدمات اللوجستية",
  "Utilities": "المرافق العامة",
  "Other": "أخرى",
  "ADD-ONS": "الإضافات",
  "ORGANISATION": "المؤسسة",
  "Number of Employees :": "عدد الموظفين:",
  "Number of Sites :": "عدد المواقع:",
  "Industry:": "القطاع:",
  // Get Proposal step.
  "Where should we send your tailored proposal?": "إلى أين نرسل عرضك المخصص؟",
  "Phone Number": "رقم الهاتف",
  "Your organisations": "مؤسستك",
  "Message (optional)": "رسالة (اختياري)",
  "Anything specific you would like us to know?": "هل هناك أي شيء محدد تود إخبارنا به؟",
  "Get My EHSWatch Proposal": "احصل على عرض EHSWatch الخاص بي",
  "No commitment required. We'll follow up within 1 business day.":
    "لا يوجد التزام مطلوب. سنتابع معك خلال يوم عمل واحد.",
  "Proposal Request Sent!": "تم إرسال طلب العرض!",
  // FAQ.
  "Are there hidden fees or setup costs?": "هل هناك رسوم خفية أو تكاليف إعداد؟",
  "Is there a free trial or demo?": "هل توجد نسخة تجريبية مجانية أو عرض توضيحي؟",
  "Do you offer customised packages?": "هل تقدمون باقات مخصصة؟",
  "Yes, packages are fully customisable. Select the EHSWatch modules that match your organisation and only pay for what you use.":
    "نعم، الباقات قابلة للتخصيص بالكامل. اختر وحدات EHSWatch التي تناسب مؤسستك وادفع فقط مقابل ما تستخدمه.",

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
  // Support Ticket tab form fields (distinct from the Contact Us tab above).
  "Your Name": "اسمك",
  "Email": "البريد الإلكتروني",
  "Issue Category": "فئة المشكلة",
  "Subject": "الموضوع",
  "Priority": "الأولوية",
  "Describe the Issue": "صف المشكلة",
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
          if (!el.getAttribute("data-ar-en")) el.setAttribute("data-ar-en", enHit);
          el.setAttribute("translate", "no");
          el.classList.add("notranslate");
          // Keep a Latin-brand-led header reading left-to-right in both languages.
          if (FORCE_LTR.has(enHit)) el.setAttribute("dir", "ltr");
          else if (FORCE_RTL.has(enHit)) el.setAttribute("dir", "rtl");
          const want = ar ? EN_TO_AR[enHit] : enHit;

          // A child ELEMENT that itself carries meaningful text (e.g. a nested
          // "IRIS" span inside "About IRIS") is part of the same translatable
          // phrase — the whole-element rewrite below is what applies
          // FORCE_LTR/the curated Arabic there, so it must stay wholesale.
          // But a child contributing NO text — a decorative icon/image, or
          // (critically) one that hasn't mounted yet, e.g. lucide-react's
          // DynamicIcon renders null until its async import resolves — must
          // never be wiped by `el.textContent = ...`: that destroys the very
          // DOM node React expects to insert the icon into moments later, and
          // our own patched insertBefore/removeChild (GoogleTranslate.tsx,
          // installed to stop React crashing on OUR text-node mutations)
          // then silently drops that insert, permanently blanking the icon.
          // Found via a real screenshot: the contact page's trust badges
          // ("Rapid Deployment" etc.) lost their icons in Arabic only,
          // because Arabic is the one case where the text actually changes
          // and el.textContent fires before the icon has loaded.
          const hasContentBearingChildEl = Array.from(el.children).some(
            (c) => (c.textContent || "").trim().length > 0
          );
          if (hasContentBearingChildEl) {
            if (norm(el.textContent) !== want) el.textContent = want;
          } else {
            const textNode = Array.from(el.childNodes).find(
              (n) => n.nodeType === 3 && (n.nodeValue || "").trim().length > 0
            );
            if (textNode) {
              if (norm(textNode.textContent) !== want) textNode.nodeValue = want;
            } else if (el.children.length === 0 && norm(el.textContent) !== want) {
              el.textContent = want;
            }
          }
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
