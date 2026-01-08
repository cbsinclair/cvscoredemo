"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Wand2,
  ClipboardList,
  Download,
  ArrowRight,
  Shield,
  Lock,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Investor demo prototype for CVScore
// - No backend
// - Mock scoring + matching + improvements
// - Designed to demo the full user journey quickly

const palette = {
  navy: "#0F1A2A",
  teal: "#00B8A9",
  bg: "#F8FAFC",
};

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function scoreColor(score) {
  // Use semantic icons rather than explicit colors; Progress component handles visuals.
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  return "bad";
}

function formatPct(n) {
  return `${Math.round(n)}%`;
}

const mockCvText = `CHRIS SINCLAIR\n\nM&E / Data Centre Recruitment | Executive Search\n\nSUMMARY\nRecruitment specialist focused on senior M&E professionals across data centres, construction and energy. Experienced in building new divisions, market mapping and talent intelligence.\n\nEXPERIENCE\nExecutive Search Consultant — Samuel Knight (Data Centres)\n- Built a new sector desk focused on senior M&E and project delivery hires\n- Delivered shortlists across PM, CM, HSE, design engineering\n\nEDUCATION\nBusiness & Management\n\nSKILLS\nStakeholder management, market mapping, talent intelligence, client advisory\n`;

const mockJobDesc = `Senior Project Manager — Data Centres (UK)\n\nResponsibilities:\n- Lead end-to-end delivery of data centre build projects\n- Manage programme, budget, procurement and contractors\n- Drive H&S compliance and reporting\n- Coordinate MEP design and commissioning activities\n\nRequirements:\n- Strong project management background in mission critical / data centres\n- Familiar with MEP systems, commissioning, change control\n- Excellent stakeholder management\n- NEC / JCT contract experience preferred\n`;

const initialTracker = [
  {
    id: "1",
    title: "Senior Project Manager (Data Centres)",
    company: "Example Colo Provider",
    status: "Saved",
    scoreSnapshot: 72,
    updated: "Today",
  },
  {
    id: "2",
    title: "M&E Project Manager",
    company: "Design & Build Contractor",
    status: "Applied",
    scoreSnapshot: 78,
    updated: "Yesterday",
  },
];

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm"
        style={{ background: "white", border: "1px solid rgba(15,26,42,0.08)" }}
      >
        <Icon className="h-5 w-5" style={{ color: palette.navy }} />
      </div>
      <div>
        <div className="text-lg font-semibold" style={{ color: palette.navy }}>
          {title}
        </div>
        {subtitle ? (
          <div className="text-sm text-slate-600 leading-snug">{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium text-slate-700 bg-white">
      {children}
    </span>
  );
}

function Divider() {
  return <div className="h-px w-full bg-slate-200" />;
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-white shadow-sm border border-slate-200"
          : "hover:bg-white/60 text-slate-700"
      }`}
      style={active ? { color: palette.navy } : { color: "#334155" }}
      aria-pressed={active}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ScoreCard({ label, score, description }) {
  const kind = scoreColor(score);
  const Icon = kind === "good" ? CheckCircle2 : kind === "warn" ? AlertTriangle : XCircle;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium" style={{ color: palette.navy }}>
            {label}
          </div>
          <div className="text-xs text-slate-600 mt-0.5">{description}</div>
        </div>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <div className="text-sm font-semibold" style={{ color: palette.navy }}>
            {score}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Progress value={score} />
      </div>
    </div>
  );
}

function ScoreDial({ score }) {
  // Lightweight "dial" without relying on chart libs.
  const pct = clamp(score, 0, 100);
  const angle = (pct / 100) * 270 - 225; // -225..45 degrees
  return (
    <div className="relative h-44 w-44">
      <div className="absolute inset-0 rounded-full bg-white border border-slate-200 shadow-sm" />
      <div className="absolute inset-4 rounded-full bg-slate-50 border border-slate-200" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color: palette.navy }}>
            {Math.round(pct)}
          </div>
          <div className="text-xs font-medium text-slate-600">out of 100</div>
        </div>
      </div>
      <div
        className="absolute left-1/2 top-1/2 h-1 w-16 origin-left rounded-full"
        style={{
          background: palette.teal,
          transform: `translate(-0%, -50%) rotate(${angle}deg)`,
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full"
        style={{ background: palette.navy, transform: "translate(-50%, -50%)" }}
      />
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
        <Pill>ATS-style scoring</Pill>
      </div>
    </div>
  );
}

function Highlight({ title, items }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base" style={{ color: palette.navy }}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div
                className="mt-0.5 h-6 w-6 rounded-xl flex items-center justify-center text-xs font-semibold"
                style={{ background: "rgba(0,184,169,0.12)", color: palette.navy }}
              >
                {idx + 1}
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: palette.navy }}>
                  {it.title}
                </div>
                <div className="text-xs text-slate-600">{it.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ExportButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" className="rounded-xl gap-2">
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
      <Button variant="secondary" className="rounded-xl gap-2">
        <Download className="h-4 w-4" />
        Export Word
      </Button>
      <Button className="rounded-xl gap-2" style={{ background: palette.navy }}>
        <Sparkles className="h-4 w-4" />
        Upgrade to Pro
      </Button>
    </div>
  );
}

function App() {
  const [step, setStep] = useState("landing"); // landing | upload | scoring | match | cover | tracker
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [tracker, setTracker] = useState(initialTracker);

  const scoring = useMemo(() => {
    // Mock scoring that reacts to presence of job text and CV length.
    const base = cvText ? 62 + Math.min(18, Math.floor(cvText.length / 140)) : 72;
    const matchBoost = jobText ? 6 : 0;
    const overall = clamp(base + matchBoost, 30, 92);

    const keyword = clamp(overall - (jobText ? 6 : 14), 35, 95);
    const skills = clamp(overall - 8, 35, 95);
    const exp = clamp(overall - 2, 35, 95);
    const format = clamp(overall + 10, 35, 98);
    const structure = clamp(overall + 4, 35, 98);

    const issues = [
      {
        title: "Missing role-specific keywords",
        detail:
          "Add commissioning, change control, NEC/JCT, and stakeholder reporting terms where truthful.",
      },
      {
        title: "Bullets lack measurable outcomes",
        detail:
          "Rewrite 6–10 bullets to include metrics (time saved, revenue, cost, delivery speed).",
      },
      {
        title: "Skills section not aligned to target roles",
        detail:
          "Group skills into Delivery, Contracts, Technical (MEP), and Leadership for scanability.",
      },
      {
        title: "CV reads as generalist",
        detail:
          "Tailor the Summary to the job title and reflect 3–5 relevant competencies.",
      },
    ];

    return {
      overall,
      subs: {
        "Keyword relevance": keyword,
        "Skills alignment": skills,
        "Experience relevance": exp,
        "ATS readability": format,
        "Structure & clarity": structure,
      },
      issues,
    };
  }, [cvText, jobText]);

  const match = useMemo(() => {
    if (!jobText) return null;
    // Naive keyword simulation for demo.
    const keywords = ["commissioning", "MEP", "NEC", "JCT", "change control", "budget", "H&S", "procurement"];
    const cvLower = (cvText || mockCvText).toLowerCase();
    const found = keywords.filter((k) => cvLower.includes(k.toLowerCase()));
    const pct = clamp((found.length / keywords.length) * 100 + 35, 40, 92);
    const missing = keywords.filter((k) => !found.includes(k));
    return { pct, found, missing };
  }, [jobText, cvText]);

  const coverLetter = useMemo(() => {
    if (!jobText) return "Paste a job description to generate a tailored cover letter.";
    const company = "[Company Name]";
    const role = "Senior Project Manager (Data Centres)";
    const intro =
      tone === "Concise"
        ? `Dear Hiring Manager,\n\nI’m applying for the ${role} role at ${company}. I bring proven delivery leadership across complex, time-critical projects, with strong stakeholder management and structured reporting.`
        : tone === "Confident"
        ? `Dear Hiring Manager,\n\nI’m excited to apply for the ${role} role at ${company}. I have a track record of leading complex programmes with clear governance, decisive problem-solving, and consistent delivery against time, cost, and quality.`
        : `Dear Hiring Manager,\n\nI’m writing to apply for the ${role} position at ${company}. I offer strong project delivery experience, rigorous organisation, and a practical approach to stakeholder alignment and reporting.`;

    const body =
      tone === "Concise"
        ? `\n\nFrom the role description, you need someone who can manage programme, budget, contractors and MEP coordination. I work well in fast-paced environments, building clear plans, managing risks, and keeping teams aligned.\n\nI’m particularly strong in:\n- Establishing delivery cadence (weekly reporting, risk logs, action tracking)\n- Managing suppliers and change control\n- Communicating clearly with technical and non-technical stakeholders\n\nI’d welcome the opportunity to discuss how I can support your delivery outcomes.`
        : tone === "Confident"
        ? `\n\nYour requirements align closely with my strengths: structured programme control, supplier management, and stakeholder-facing delivery leadership. I build momentum quickly, set clear governance, and drive accountability—especially when timelines are tight and priorities compete.\n\nHighlights I would bring:\n- Clear delivery governance: RAID, milestones, change control\n- Contractor and supplier management with pragmatic escalation\n- Strong communication across technical MEP teams and business stakeholders\n\nI would value the chance to walk you through how I operate in live delivery environments and how I would add value from day one.`
        : `\n\nThe role calls for strong end-to-end project delivery, contractor management, and coordination with MEP stakeholders. I’m highly organised, comfortable leading multiple workstreams, and disciplined on planning, reporting, and risk management.\n\nI would bring:\n- A structured delivery approach (milestones, risks, actions, reporting cadence)\n- Strong stakeholder management and clear communication\n- A practical, outcomes-focused mindset\n\nThank you for your consideration. I’d welcome the opportunity to discuss the role further.`;

    const close = `\n\nYours faithfully,\n\n[Your Name]`;
    return `${intro}${body}${close}`;
  }, [jobText, tone]);

  const shell = (content) => (
    <div className="min-h-screen" style={{ background: palette.bg }}>
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ background: palette.navy }}
            >
              <div className="h-4 w-4" style={{ background: palette.teal }} />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-wide" style={{ color: palette.navy }}>
                CVSCORE
              </div>
              <div className="text-[11px] text-slate-600">Investor demo prototype • UK-first</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Pill><Shield className="h-3.5 w-3.5 mr-1" /> GDPR-minded</Pill>
            <Pill><Lock className="h-3.5 w-3.5 mr-1" /> Private by default</Pill>
            <Pill><Zap className="h-3.5 w-3.5 mr-1" /> AI-assisted</Pill>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => {
                setCvText(mockCvText);
                setJobText("");
                setStep("scoring");
              }}
            >
              Load Demo
            </Button>
            <Button
              className="rounded-xl"
              style={{ background: palette.navy }}
              onClick={() => setStep("upload")}
            >
              Try Flow
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="md:w-64 shrink-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="text-xs font-semibold text-slate-600 px-2 py-1">Demo navigation</div>
              <div className="mt-2 grid gap-1">
                <TabButton
                  active={step === "landing"}
                  onClick={() => setStep("landing")}
                  icon={Gauge}
                  label="Landing"
                />
                <TabButton
                  active={step === "upload"}
                  onClick={() => setStep("upload")}
                  icon={Upload}
                  label="Upload CV"
                />
                <TabButton
                  active={step === "scoring"}
                  onClick={() => setStep("scoring")}
                  icon={FileText}
                  label="Score dashboard"
                />
                <TabButton
                  active={step === "match"}
                  onClick={() => setStep("match")}
                  icon={Search}
                  label="Job match"
                />
                <TabButton
                  active={step === "cover"}
                  onClick={() => setStep("cover")}
                  icon={Wand2}
                  label="Cover letter"
                />
                <TabButton
                  active={step === "tracker"}
                  onClick={() => setStep("tracker")}
                  icon={ClipboardList}
                  label="Job tracker"
                />
              </div>
              <div className="mt-3 px-2">
                <Divider />
                <div className="mt-3 text-xs text-slate-600 leading-relaxed">
                  <div className="font-semibold" style={{ color: palette.navy }}>Investor story</div>
                  <div className="mt-1">Upload → Score → Fix → Match → Apply. A simple loop that drives retention and conversion.</div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold" style={{ color: palette.navy }}>MVP KPIs (demo)</div>
              <div className="mt-3 grid gap-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-600">Time to first score</div>
                  <Badge variant="secondary">&lt; 30s</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-600">Primary conversion</div>
                  <Badge variant="secondary">Upgrade to Pro</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-600">Retention loop</div>
                  <Badge variant="secondary">Job tracker</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">{content}</div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: palette.navy }}>Demo disclaimer</div>
              <div className="text-xs text-slate-600">This prototype uses mock logic and sample data. Production build will use real parsing, scoring and secure storage.</div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="rounded-xl" onClick={() => setStep("landing")}>Restart</Button>
              <Button className="rounded-xl" style={{ background: palette.navy }} onClick={() => setStep("upload")}>Run the flow</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  const Landing = (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden relative">
        <div
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full"
          style={{ background: "rgba(0,184,169,0.12)" }}
        />
        <div
          className="absolute -right-10 top-24 h-48 w-48 rounded-full"
          style={{ background: "rgba(15,26,42,0.06)" }}
        />

        <div className="relative">
          <div className="flex flex-wrap gap-2 mb-4">
            <Pill>UK-first CV scoring</Pill>
            <Pill>ATS-style analysis</Pill>
            <Pill>Job matching</Pill>
            <Pill>Cover letters</Pill>
            <Pill>Tracker</Pill>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: palette.navy }}>
            Score your CV like recruiters and ATS systems scan it.
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl">
            A UK-focused career toolkit: CV scoring, explainable improvements, job description matching, cover letter generation, and a lightweight application tracker.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              className="rounded-xl gap-2"
              style={{ background: palette.navy }}
              onClick={() => setStep("upload")}
            >
              Start demo <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              className="rounded-xl gap-2"
              onClick={() => {
                setCvText(mockCvText);
                setJobText(mockJobDesc);
                setStep("scoring");
              }}
            >
              View completed journey
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm" style={{ color: palette.navy }}>Explainable scoring</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Clear breakdown across keywords, skills, relevance, structure and ATS readability.
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm" style={{ color: palette.navy }}>Controlled AI improvements</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Before/after rewrites and reasons. The user stays in control.
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm" style={{ color: palette.navy }}>Retention loop</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Save jobs, match descriptions, generate cover letters, track outcomes.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <SectionTitle icon={Gauge} title="Investor demo narrative" subtitle="Show the loop: score → fix → match → apply → track." />
          </CardHeader>
          <CardContent className="text-sm text-slate-600 leading-relaxed">
            This prototype is designed for pitching: it demonstrates the end-to-end journey and the UI surfaces where monetisation and retention naturally occur.
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <SectionTitle icon={Shield} title="UK-first" subtitle="Language, tone and CV conventions aligned to the UK market." />
          </CardHeader>
          <CardContent className="text-sm text-slate-600 leading-relaxed">
            The product copy avoids hype, prioritises clarity, and frames scoring as "ATS-style"—not claiming to be an ATS.
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const UploadStep = (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <CardHeader>
          <SectionTitle
            icon={Upload}
            title="Upload your CV"
            subtitle="For the demo, upload is simulated. Paste text or load sample CV." 
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold" style={{ color: palette.navy }}>Option A: Paste CV text</div>
              <div className="text-xs text-slate-600 mt-1">(In production, this is PDF/DOCX upload and parsing.)</div>
              <Textarea
                className="mt-3 min-h-[180px] rounded-xl"
                placeholder="Paste CV text here..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold" style={{ color: palette.navy }}>Option B: Load sample</div>
              <div className="text-xs text-slate-600 mt-1">Use a sample CV to move quickly through the demo.</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  className="rounded-xl gap-2"
                  style={{ background: palette.navy }}
                  onClick={() => setCvText(mockCvText)}
                >
                  <FileText className="h-4 w-4" /> Load sample CV
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-xl gap-2"
                  onClick={() => {
                    setCvText("");
                    setJobText("");
                  }}
                >
                  Clear
                </Button>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
                Tip: Investors respond well to the "aha" moment—jump to the score dashboard once text is loaded.
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Badge variant="secondary" className="rounded-full">Free</Badge>
              <span>1 CV score included</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="rounded-xl" onClick={() => setStep("landing")}>
                Back
              </Button>
              <Button
                className="rounded-xl gap-2"
                style={{ background: palette.navy }}
                onClick={() => setStep("scoring")}
                disabled={!cvText}
              >
                Analyse CV <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ScoringStep = (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <CardHeader>
          <SectionTitle
            icon={Gauge}
            title="Your CV score"
            subtitle="ATS-style scoring with explainable breakdown and concrete fixes."
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col items-center">
              <ScoreDial score={scoring.overall} />
              <div className="mt-4 text-center">
                <div className="text-sm font-semibold" style={{ color: palette.navy }}>
                  Interpretation
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {scoring.overall >= 80
                    ? "Strong CV. Minor tailoring will improve consistency."
                    : scoring.overall >= 60
                    ? "Good base. Targeted keyword and impact edits recommended."
                    : "High risk of ATS drop-off. Prioritise structure and keyword alignment."}
                </div>
              </div>
              <div className="mt-4 w-full">
                <ExportButtons />
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(scoring.subs).map(([k, v]) => (
                <ScoreCard
                  key={k}
                  label={k}
                  score={v}
                  description={
                    k === "Keyword relevance"
                      ? "How well your language matches target roles."
                      : k === "Skills alignment"
                      ? "Coverage of role-relevant skills and tools."
                      : k === "Experience relevance"
                      ? "Clarity of relevant outcomes and responsibilities."
                      : k === "ATS readability"
                      ? "Formatting likely to parse cleanly."
                      : "Scanability, headings and logical structure."
                  }
                />
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Highlight title="What’s hurting your score" items={scoring.issues} />
            </div>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base" style={{ color: palette.navy }}>
                  Quick improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full rounded-xl gap-2"
                  style={{ background: palette.navy }}
                  onClick={() => setStep("match")}
                >
                  <Search className="h-4 w-4" /> Match a job description
                </Button>
                <Button
                  variant="secondary"
                  className="w-full rounded-xl gap-2"
                  onClick={() => {
                    setJobText(mockJobDesc);
                    setStep("match");
                  }}
                >
                  Load sample job
                </Button>
                <Button
                  variant="secondary"
                  className="w-full rounded-xl gap-2"
                  onClick={() => {
                    // Mock "improve" by appending keyword section.
                    setCvText((t) =>
                      t.includes("KEYWORDS")
                        ? t
                        : `${t}\n\nKEYWORDS\nCommissioning, change control, procurement, NEC/JCT, H&S reporting, MEP coordination`
                    );
                  }}
                >
                  <Sparkles className="h-4 w-4" /> Apply demo improvements
                </Button>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  In production, improvements are reviewed as before/after edits.
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <SectionTitle icon={FileText} title="CV preview (demo)" subtitle="This is text-only for the prototype. Export and template selection are Phase 2." />
        </CardHeader>
        <CardContent>
          <Textarea className="min-h-[220px] rounded-2xl" value={cvText || mockCvText} onChange={(e) => setCvText(e.target.value)} />
        </CardContent>
      </Card>
    </div>
  );

  const MatchStep = (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <CardHeader>
          <SectionTitle
            icon={Search}
            title="Job description match"
            subtitle="Paste a job description to see match %, missing keywords, and next steps."
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold" style={{ color: palette.navy }}>Job description</div>
              <Textarea
                className="mt-3 min-h-[220px] rounded-2xl"
                placeholder="Paste job description here..."
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="rounded-xl"
                  onClick={() => setJobText(mockJobDesc)}
                >
                  Load sample job
                </Button>
                <Button variant="secondary" className="rounded-xl" onClick={() => setJobText("")}>Clear</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold" style={{ color: palette.navy }}>Match score</div>
                  <div className="text-xs text-slate-600">Based on keyword and competency overlap.</div>
                </div>
                <Badge variant="secondary" className="rounded-full">Demo</Badge>
              </div>

              {match ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl bg-white border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-extrabold" style={{ color: palette.navy }}>{formatPct(match.pct)}</div>
                      <div className="text-xs text-slate-600">Overall match</div>
                    </div>
                    <div className="mt-3"><Progress value={match.pct} /></div>
                    <div className="mt-3 text-xs text-slate-600">
                      {match.pct >= 80
                        ? "Strong match. Tailor the summary and apply."
                        : match.pct >= 65
                        ? "Good match. Add missing keywords and strengthen impact bullets."
                        : "Medium match. Prioritise keyword alignment and role-specific language."}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-2xl bg-white border border-slate-200 p-4">
                      <div className="text-sm font-semibold" style={{ color: palette.navy }}>Found keywords</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {match.found.length ? match.found.map((k) => (
                          <Badge key={k} variant="secondary" className="rounded-full">{k}</Badge>
                        )) : <div className="text-xs text-slate-600">None detected yet.</div>}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white border border-slate-200 p-4">
                      <div className="text-sm font-semibold" style={{ color: palette.navy }}>Missing keywords</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {match.missing.map((k) => (
                          <Badge key={k} className="rounded-full" style={{ background: "rgba(15,26,42,0.06)", color: palette.navy }}>
                            {k}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-slate-600">
                        Add these only where truthful. Overstuffing reduces credibility.
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="rounded-xl gap-2"
                      style={{ background: palette.navy }}
                      onClick={() => setStep("cover")}
                    >
                      Generate cover letter <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      className="rounded-xl gap-2"
                      onClick={() => {
                        // Save job to tracker
                        const id = String(Date.now());
                        setTracker((t) => [
                          {
                            id,
                            title: "Senior Project Manager (Data Centres)",
                            company: "[Company]",
                            status: "Saved",
                            scoreSnapshot: scoring.overall,
                            updated: "Today",
                          },
                          ...t,
                        ]);
                        setStep("tracker");
                      }}
                    >
                      Save job to tracker
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
                  Paste a job description to see match results.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CoverStep = (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <CardHeader>
          <SectionTitle
            icon={Wand2}
            title="Cover letter generator"
            subtitle="Uses your CV + the job description to draft a UK-style cover letter."
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold" style={{ color: palette.navy }}>Tone</div>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="w-[180px] rounded-xl">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Concise">Concise</SelectItem>
                  <SelectItem value="Confident">Confident</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="rounded-xl" onClick={() => setStep("match")}>Back</Button>
              <Button className="rounded-xl" style={{ background: palette.navy }} onClick={() => setStep("tracker")}>Add to tracker</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold" style={{ color: palette.navy }}>Job description</div>
              <div className="mt-2 text-xs text-slate-600">(Used to tailor the letter.)</div>
              <Textarea className="mt-3 min-h-[220px] rounded-2xl" value={jobText} onChange={(e) => setJobText(e.target.value)} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold" style={{ color: palette.navy }}>Generated cover letter</div>
                <Badge variant="secondary" className="rounded-full">Editable</Badge>
              </div>
              <Textarea className="mt-3 min-h-[220px] rounded-2xl" value={coverLetter} readOnly={false} />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" className="rounded-xl gap-2"><Download className="h-4 w-4" /> Export PDF</Button>
                <Button variant="secondary" className="rounded-xl gap-2"><Download className="h-4 w-4" /> Export Word</Button>
                <Button className="rounded-xl gap-2" style={{ background: palette.navy }}><Sparkles className="h-4 w-4" /> Upgrade to Pro</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TrackerStep = (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <CardHeader>
          <SectionTitle
            icon={ClipboardList}
            title="Job tracker"
            subtitle="A lightweight retention loop: save roles, track status, and keep the CV score snapshot." 
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input className="rounded-xl" placeholder="Job title" />
              <Input className="rounded-xl" placeholder="Company" />
              <Button
                className="rounded-xl gap-2"
                style={{ background: palette.navy }}
                onClick={() => {
                  const id = String(Date.now());
                  setTracker((t) => [
                    {
                      id,
                      title: "New role (demo)",
                      company: "Company",
                      status: "Saved",
                      scoreSnapshot: scoring.overall,
                      updated: "Today",
                    },
                    ...t,
                  ]);
                }}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="grid grid-cols-12 gap-0 px-4 py-3 text-xs font-semibold text-slate-600 bg-slate-50">
              <div className="col-span-4">Role</div>
              <div className="col-span-3">Company</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">CV score</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {tracker.map((row) => (
                <div key={row.id} className="grid grid-cols-12 px-4 py-3 items-center">
                  <div className="col-span-4">
                    <div className="text-sm font-medium" style={{ color: palette.navy }}>{row.title}</div>
                    <div className="text-xs text-slate-600">Updated: {row.updated}</div>
                  </div>
                  <div className="col-span-3 text-sm text-slate-700">{row.company}</div>
                  <div className="col-span-2">
                    <Select
                      value={row.status}
                      onValueChange={(v) =>
                        setTracker((t) => t.map((r) => (r.id === row.id ? { ...r, status: v, updated: "Today" } : r)))
                      }
                    >
                      <SelectTrigger className="rounded-xl h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Saved">Saved</SelectItem>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold" style={{ color: palette.navy }}>{row.scoreSnapshot}</div>
                      <div className="w-20"><Progress value={row.scoreSnapshot} /></div>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      className="rounded-xl"
                      onClick={() => setTracker((t) => t.filter((r) => r.id !== row.id))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="rounded-xl" onClick={() => setStep("scoring")}>Back to score</Button>
            <Button className="rounded-xl" style={{ background: palette.navy }} onClick={() => setStep("upload")}>Score another CV</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return shell(
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
      >
        {step === "landing" && Landing}
        {step === "upload" && UploadStep}
        {step === "scoring" && ScoringStep}
        {step === "match" && MatchStep}
        {step === "cover" && CoverStep}
        {step === "tracker" && TrackerStep}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
