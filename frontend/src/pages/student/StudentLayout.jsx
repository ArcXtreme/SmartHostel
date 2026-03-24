import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, loadAuth } from "../../auth/storage.js";
import { Container } from "../../components/ui.jsx";
import { LangToggle } from "../../components/LangToggle.jsx";
import { Button } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

const links = [
  ["", "dashboard"],
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
              <div className="text-sm text-slate-500">{t("student")}</div>
              <div className="text-xl font-bold text-slate-900">
                {auth?.user?.name}{" "}
                <span className="font-normal text-slate-600">
                  · {auth?.user?.hostelName} {auth?.user?.roomNumber}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LangToggle />
              <Link
                className="hms-focus rounded-2xl border border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-800"
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
            {links.map(([path, key]) => (
              <Link
                key={path || "home"}
                className="hms-focus shrink-0 rounded-2xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-900 hover:bg-sky-100"
                to={path ? `/student/${path}` : "/student"}
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </Container>
      </header>
      <Outlet />
    </div>
  );
}
