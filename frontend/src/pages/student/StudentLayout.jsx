import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearAuth, loadAuth } from "../../auth/storage.js";
import { Container } from "../../components/ui.jsx";
import { LangToggle } from "../../components/LangToggle.jsx";
import { Button } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

const links = [
  ["", "dashboard"],
  ["profile", "profile"],
  ["complaints-list", "complaintList"],
  ["cleaning", "cleaning"],
  ["complaint/internet", "internet"],
  ["complaint/furniture", "furniture"],
  ["complaint/electricity", "electricity"],
  ["complaint/water", "water"],
  ["complaint/cleanliness_common", "cleanliness"],
  ["laundry", "laundry"],
  ["mess", "mess"],
  ["lost-found", "lostFound"],
  ["notices", "noticeBoard"],
];

export default function StudentLayout() {
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
              <div className="text-sm text-slate-300">{t("student")}</div>
              <div className="text-xl font-bold text-slate-100">
                {auth?.user?.name}{" "}
                <span className="font-normal text-slate-300">
                  · {auth?.user?.hostelName} {auth?.user?.roomNumber}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LangToggle />
              <Link
                className="hms-focus rounded-2xl border border-white/25 bg-white/10 px-4 py-2 text-base font-semibold text-slate-100"
                to="/student/profile"
                aria-label="My Profile"
                title="My Profile"
              >
                👤
              </Link>
              <Link
                className="hms-focus rounded-2xl border border-white/25 bg-white/10 px-4 py-2 text-base font-semibold text-slate-100"
                to="/student"
              >
                {t("dashboard")}
              </Link>
              <Button variant="ghost" onClick={logout}>
                {t("logout")}
              </Button>
            </div>
          </div>
          <nav className="no-scrollbar flex gap-2 overflow-x-auto pb-4">
            {links.map(([path, key]) => {
                const target = path ? `/student/${path}` : "/student";
                const active = location.pathname === target;
                return (
                  <Link
                    key={path || "home"}
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
