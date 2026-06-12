import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, loadAuth } from "../../auth/storage.js";
import { Container, Button } from "../../components/ui.jsx";
import { LangToggle } from "../../components/LangToggle.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function WorkerLayout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const auth = loadAuth();

  function logout() {
    clearAuth();
    navigate("/", { replace: true });
  }

  return (
    <div className="app-shell min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <Container>
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium text-violet-600">{t("worker")}</div>
              <div className="text-xl font-bold text-[#0f172a]" style={{ fontFamily: "Sora, sans-serif" }}>
                {auth?.user?.name} · {auth?.user?.workerId}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LangToggle />
              <Link
                className="hms-focus rounded-2xl border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-[#0f172a] transition hover:bg-slate-50 hover:border-violet-300"
                to="/worker/profile"
                aria-label="My Profile"
                title="My Profile"
              >
                👤
              </Link>
              <Link
                className="hms-focus rounded-2xl border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-[#0f172a] transition hover:bg-slate-50 hover:border-violet-300"
                to="/worker"
              >
                {t("dashboard")}
              </Link>
              <Link
                className="hms-focus rounded-2xl border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-[#0f172a] transition hover:bg-slate-50 hover:border-violet-300"
                to="/worker/tasks"
              >
                {t("workersTasks")}
              </Link>
              <Button variant="ghost" onClick={logout}>
                {t("logout")}
              </Button>
            </div>
          </div>
        </Container>
      </header>
      <Outlet />
    </div>
  );
}
