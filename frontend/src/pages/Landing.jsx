import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/ui.jsx";
import { LangToggle } from "../components/LangToggle.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";
import iitRoparLogo from "../assets/iit-ropar-logo.svg";

function RoleCard({ icon, title, toLogin, toSignup, loginLabel, signupLabel }) {
  return (
    <div className="glass lift-hover flex flex-col gap-4 rounded-3xl p-6">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 via-violet-500/30 to-purple-500/30 text-5xl shadow-lg shadow-blue-900/40"
        aria-hidden
      >
        {typeof icon === "string" ? icon : icon}
      </div>
      <h2 className="text-2xl font-bold text-slate-50">{title}</h2>
      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <Link
          className="hms-focus flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 text-lg font-semibold text-white shadow-lg shadow-blue-900/35 transition duration-200 hover:brightness-110"
          to={toLogin}
        >
          {loginLabel}
        </Link>
        <Link
          className="hms-focus flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border border-white/35 bg-white/5 text-lg font-semibold text-slate-100 transition duration-200 hover:bg-white/10"
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

  return (
    <div className="app-shell mesh-bg relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/45 backdrop-blur-xl">
        <Container>
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium text-slate-300">{t("welcome")}</div>
              <h1 className="gradient-text text-3xl font-bold tracking-tight">{t("appTitle")}</h1>
            </div>
            <LangToggle />
          </div>
        </Container>
      </header>

      <Container>
        <div className="py-10 text-center">
          <h2 className="text-4xl font-extrabold text-slate-100 sm:text-5xl">
            Hostel Management, <span className="gradient-text">Reimagined</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{t("homeBlurb")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-3">
          <RoleCard
            icon="🎓"
            title={t("student")}
            toLogin="/login"
            toSignup="/signup/student"
            loginLabel={`${t("student")} — ${t("roleLogin")}`}
            signupLabel={t("signup")}
          />
          <RoleCard
            icon={<img src={iitRoparLogo} alt="IIT Ropar" className="h-14 w-14 object-contain" />}
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
    </div>
  );
}
