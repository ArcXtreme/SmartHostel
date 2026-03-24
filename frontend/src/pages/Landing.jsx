import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/ui.jsx";
import { LangToggle } from "../components/LangToggle.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

function RoleCard({ icon, title, toLogin, toSignup, loginLabel, signupLabel }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-5xl" aria-hidden>
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <Link
          className="hms-focus flex min-h-[52px] flex-1 items-center justify-center rounded-2xl bg-sky-600 text-lg font-semibold text-white hover:bg-sky-500"
          to={toLogin}
        >
          {loginLabel}
        </Link>
        <Link
          className="hms-focus flex min-h-[52px] flex-1 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white text-lg font-semibold text-slate-800 hover:bg-slate-50"
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
    <div className="min-h-screen bg-[#e8f4fc]">
      <header className="border-b border-sky-100 bg-white/90 backdrop-blur">
        <Container>
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">{t("welcome")}</div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("appTitle")}</h1>
            </div>
            <LangToggle />
          </div>
        </Container>
      </header>

      <Container>
        <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-3">
          <RoleCard
            icon="🎓"
            title={t("student")}
            toLogin="/login?role=student"
            toSignup="/signup/student"
            loginLabel={`${t("student")} — ${t("roleLogin")}`}
            signupLabel={t("signup")}
          />
          <RoleCard
            icon="🛡️"
            title={t("admin")}
            toLogin="/login?role=admin"
            toSignup="/signup/admin"
            loginLabel={`${t("admin")} — ${t("roleLogin")}`}
            signupLabel={t("signup")}
          />
          <RoleCard
            icon="🧹"
            title={t("worker")}
            toLogin="/login?role=worker"
            toSignup="/signup/worker"
            loginLabel={`${t("worker")} — ${t("roleLogin")}`}
            signupLabel={t("signup")}
          />
        </div>
        <p className="pb-10 text-center text-slate-600">{t("homeBlurb")}</p>
      </Container>
    </div>
  );
}
