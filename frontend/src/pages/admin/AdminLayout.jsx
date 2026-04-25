import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearAuth, loadAuth } from "../../auth/storage.js";
import { Container, Button } from "../../components/ui.jsx";
import { LangToggle } from "../../components/LangToggle.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

const links = [
  ["", "dashboard"],
  ["/admin/profile", "profile"],
  ["/admin/complaints", "complaintList"],
  ["/admin/analytics", "analytics"],
  ["/admin/notices", "postNotice"],
  ["/admin/cleaning", "cleaningAssign"],
  ["/admin/laundry", "laundry"],
  ["/admin/mess", "messFeedback"],
  ["/admin/lost-found", "lostFoundAdmin"],
];

export default function AdminLayout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = loadAuth();

  function logout() {
    clearAuth();
    navigate("/", { replace: true });
  }

  return (
    <div className="app-shell min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/45 backdrop-blur-xl">
        <Container>
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-slate-300">{t("admin")}</div>
              <div className="text-xl font-bold text-slate-100">{auth?.user?.name}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LangToggle />
              <Link
                className="hms-focus rounded-2xl border border-white/25 bg-white/10 px-4 py-2 text-base font-semibold text-slate-100"
                to="/admin/profile"
                aria-label="My Profile"
                title="My Profile"
              >
                👤
              </Link>
              <Button variant="ghost" onClick={logout}>
                {t("logout")}
              </Button>
            </div>
          </div>
          <nav className="no-scrollbar flex gap-2 overflow-x-auto pb-4">
            {links.map(([path, key]) => {
              const target = path || "/admin";
              const active = location.pathname === target;
              return (
                <Link
                  key={path || "dash"}
                  className={`hms-focus pill-tab shrink-0 px-4 py-2 text-sm font-semibold transition duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-500/80 via-violet-500/80 to-purple-500/80 text-white shadow-md shadow-violet-900/35"
                      : "bg-slate-900/35 text-slate-200 hover:bg-slate-800/55"
                  }`}
                  to={target}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>
        </Container>
      </header>
      <Outlet />
    </div>
  );
}
