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
    <div className="min-h-screen bg-[#f4f7fb]">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <Container>
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-slate-500">{t("worker")}</div>
              <div className="text-xl font-bold text-slate-900">
                {auth?.user?.name} · {auth?.user?.workerId}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LangToggle />
              <Link
                className="hms-focus rounded-2xl border border-slate-300 bg-white px-4 py-2 text-base font-semibold"
                to="/worker"
              >
                {t("dashboard")}
              </Link>
              <Link
                className="hms-focus rounded-2xl border border-slate-300 bg-white px-4 py-2 text-base font-semibold"
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
