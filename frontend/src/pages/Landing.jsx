import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/ui.jsx";
import { LangToggle } from "../components/LangToggle.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

/* ── Feature cards data ── */
const FEATURES = [
  { icon: "🧼", titleKey: "cleaning", desc: "Schedule room cleaning, track status, and rate your cleaner — all in one place." },
  { icon: "📋", titleKey: "complaintList", desc: "File complaints for internet, furniture, electricity, water & more with image uploads." },
  { icon: "🧺", titleKey: "laundry", desc: "Submit laundry orders, track pickup & delivery, and leave feedback effortlessly." },
  { icon: "🍛", titleKey: "mess", desc: "Rate daily meals, upload food photos, and help the mess committee improve quality." },
  { icon: "🔍", titleKey: "lostFound", desc: "Post lost items or report found ones — reunite belongings across hostels." },
  { icon: "📌", titleKey: "noticeBoard", desc: "Stay updated with official notices from the hostel administration in real time." },
];

/* ── Trust logos ── */
const TRUST_NAMES = ["IIT Ropar", "Chenab Hostel", "Raavi Hostel", "Beas Hostel", "Satluj Hostel", "Brahmaputra Hostel"];

/* ── Role cards ── */
function RoleCard({ icon, title, toLogin, toSignup, loginLabel, signupLabel }) {
  return (
    <div className="glass lift-hover flex flex-col gap-4 rounded-3xl p-6 fade-up">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 text-5xl"
        aria-hidden
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-[#0f172a]">{title}</h3>
      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <Link
          className="hms-focus flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-lg font-semibold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:shadow-violet-500/30 hover:brightness-110"
          to={toLogin}
        >
          {loginLabel}
        </Link>
        <Link
          className="hms-focus flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white text-lg font-semibold text-[#0f172a] transition duration-200 hover:bg-slate-50 hover:border-violet-300"
          to={toSignup}
        >
          {signupLabel}
        </Link>
      </div>
    </div>
  );
}

export default function Landing() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const featuresRef = useRef(null);

  /* Sticky header scroll detection */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToFeatures() {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ═══ Sticky Header ═══ */}
      <header className={`site-header ${scrolled ? "scrolled" : ""} border-b border-slate-100`}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-lg font-bold text-white shadow-md shadow-violet-500/25">
              S
            </div>
            <span className="text-xl font-bold text-[#0f172a]" style={{ fontFamily: "Sora, sans-serif" }}>
              SmartHostel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LangToggle />
            <Link
              to="/login"
              className="hidden sm:inline-flex hms-focus items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f172a] transition hover:bg-slate-50 hover:border-violet-300"
            >
              {t("login")}
            </Link>
            <Link
              to="/signup/student"
              className="hidden sm:inline-flex hms-focus items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:brightness-110"
            >
              {t("signup")}
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ Hero Section ═══ */}
      <section className="mesh-bg relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl float-anim" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl float-anim" style={{ animationDelay: "2s" }} />

        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-36">
          <div className="fade-up">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-700">
              ✨ Modern Hostel Management
            </span>
          </div>
          <h1
            className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl fade-up-delay-1"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Hostel Management,{" "}
            <span className="gradient-text">Reimagined</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 fade-up-delay-2">
            {t("homeBlurb") || "A unified platform for students, admins, and workers to manage cleaning, complaints, laundry, mess, lost & found, and hostel notices — effortlessly."}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row fade-up-delay-3">
            <Link
              to="/login"
              className="hms-focus inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition duration-200 hover:shadow-violet-500/35 hover:brightness-110"
            >
              Get Started →
            </Link>
            <button
              onClick={scrollToFeatures}
              className="hms-focus inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-8 text-lg font-semibold text-[#0f172a] transition duration-200 hover:bg-slate-50 hover:border-violet-300 cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Trust Bar ═══ */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-5 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
            Trusted across hostels
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUST_NAMES.map((name) => (
              <span key={name} className="text-lg font-bold text-slate-300 transition hover:text-violet-400" style={{ fontFamily: "Sora, sans-serif" }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Features Section ═══ */}
      <section ref={featuresRef} className="py-20 sm:py-28" id="features">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-700">
              🚀 Features
            </span>
            <h2
              className="mt-6 text-3xl font-extrabold text-[#0f172a] sm:text-4xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Everything you need,{" "}
              <span className="gradient-text">in one place</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
              From room cleaning to lost & found — every aspect of hostel life, streamlined.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.titleKey}
                className={`glass lift-hover flex flex-col gap-4 rounded-3xl p-6 fade-up-delay-${Math.min(i % 3 + 1, 3)}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 text-3xl">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0f172a]">{t(f.titleKey)}</h3>
                <p className="text-base leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Role Cards Section ═══ */}
      <section className="bg-slate-50/60 py-20 sm:py-28">
        <Container>
          <div className="text-center fade-up">
            <h2
              className="text-3xl font-extrabold text-[#0f172a] sm:text-4xl"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Choose your <span className="gradient-text">role</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500">Sign in or create an account based on your role</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <RoleCard
              icon="🎓"
              title={t("student")}
              toLogin="/login"
              toSignup="/signup/student"
              loginLabel={`${t("student")} — ${t("roleLogin")}`}
              signupLabel={t("signup")}
            />
            <RoleCard
              icon="🛡️"
              title={t("admin")}
              toLogin="/login"
              toSignup="/signup/admin"
              loginLabel={`${t("admin")} — ${t("roleLogin")}`}
              signupLabel={t("signup")}
            />
            <RoleCard
              icon="🧑‍🔧"
              title={t("worker")}
              toLogin="/login"
              toSignup="/signup/worker"
              loginLabel={`${t("worker")} — ${t("roleLogin")}`}
              signupLabel={t("signup")}
            />
          </div>
        </Container>
      </section>

      {/* ═══ Gradient CTA Banner ═══ */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 py-16 text-center sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-60" />
          <h2
            className="relative text-3xl font-extrabold text-white sm:text-4xl"
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            Ready to streamline your hostel?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/80">
            Join hundreds of students and staff already using SmartHostel for a smoother hostel experience.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup/student"
              className="hms-focus inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-white px-8 text-lg font-semibold text-violet-700 shadow-lg transition duration-200 hover:bg-slate-50"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="hms-focus inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/30 px-8 text-lg font-semibold text-white transition duration-200 hover:bg-white/10"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-sm font-bold text-white">
              S
            </div>
            <span className="text-lg font-bold text-[#0f172a]" style={{ fontFamily: "Sora, sans-serif" }}>
              SmartHostel
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            © {new Date().getFullYear()} SmartHostel — IIT Ropar. Built for better hostel living.
          </p>
        </div>
      </footer>
    </div>
  );
}
