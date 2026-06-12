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
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <Container>
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium text-violet-600">{t("student")}</div>
              <div className="text-xl font-bold text-[#0f172a]" style={{ fontFamily: "Sora, sans-serif" }}>
                {auth?.user?.name}{" "}
                <span className="font-normal text-slate-500">
                  · {auth?.user?.hostelName} {auth?.user?.roomNumber}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LangToggle />
              <Link
                className="hms-focus rounded-2xl border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-[#0f172a] transition hover:bg-slate-50 hover:border-violet-300"
                to="/student/profile"
                aria-label="My Profile"
                title="My Profile"
              >
                👤
              </Link>
              <Link
                className="hms-focus rounded-2xl border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-[#0f172a] transition hover:bg-slate-50 hover:border-violet-300"
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
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/20 border-transparent"
                        : "text-slate-600 hover:bg-slate-100 hover:text-[#0f172a]"
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
