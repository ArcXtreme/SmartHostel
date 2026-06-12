import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { Container, Card, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

const features = [
  { to: "/student/cleaning", key: "cleaning", icon: "🧼", glow: "from-emerald-50 to-teal-50" },
  { to: "/student/complaint/internet", key: "internet", icon: "📶", glow: "from-blue-50 to-cyan-50" },
  { to: "/student/complaint/furniture", key: "furniture", icon: "🪑", glow: "from-amber-50 to-orange-50" },
  { to: "/student/complaint/electricity", key: "electricity", icon: "💡", glow: "from-yellow-50 to-amber-50" },
  { to: "/student/complaint/water", key: "water", icon: "💧", glow: "from-cyan-50 to-blue-50" },
  { to: "/student/complaint/cleanliness_common", key: "cleanliness", icon: "🚿", glow: "from-indigo-50 to-violet-50" },
  { to: "/student/laundry", key: "laundry", icon: "🧺", glow: "from-sky-50 to-indigo-50" },
  { to: "/student/mess", key: "mess", icon: "🍛", glow: "from-rose-50 to-orange-50" },
  { to: "/student/lost-found", key: "lostFound", icon: "🔍", glow: "from-fuchsia-50 to-violet-50" },
  { to: "/student/notices", key: "noticeBoard", icon: "📌", glow: "from-blue-50 to-purple-50" },
];

export default function StudentDashboard() {
  const { t } = useI18n();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const { data: d } = await api.get("/api/dashboard");
      setData(d);
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (!data && !err) {
    return (
      <Container>
        <div className="py-16">
          <Spinner label={t("loading")} />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {err ? (
          <div className="mb-4">
            <Alert type="error">{err}</Alert>
          </div>
        ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
              <div className="text-sm font-medium text-slate-500">{t("yourQueries")}</div>
              <div className="mt-2 text-4xl font-bold text-[#0f172a]">{data?.queryCount ?? 0}</div>
          </Card>
          <Card>
              <div className="text-sm font-medium text-slate-500">{t("notifications")}</div>
              <div className="mt-2 text-4xl font-bold text-[#0f172a]">{data?.notifications?.length ?? 0}</div>
          </Card>
          <Card>
              <div className="text-sm font-medium text-slate-500">{t("notices")}</div>
              <div className="mt-2 text-4xl font-bold text-[#0f172a]">{data?.notices?.length ?? 0}</div>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-[#0f172a]" style={{ fontFamily: "Sora, sans-serif" }}>{t("quickSummary")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(data?.cards || {}).map(([k, v]) => (
              <Card key={k} className="py-4">
                <div className="text-sm capitalize text-slate-500">{k}</div>
                <div className="text-2xl font-bold text-[#0f172a]">{v}</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-3 text-xl font-bold text-[#0f172a]">{t("notifications")}</h3>
            <ul className="space-y-3">
              {(data?.notifications || []).slice(0, 6).map((n) => (
                <li
                  key={n._id}
                  className="rounded-xl border-l-4 border-violet-400 border border-slate-100 bg-slate-50 px-3 py-2 text-[#0f172a]"
                >
                  {n.message}
                </li>
              ))}
              {!data?.notifications?.length ? <li className="text-slate-400">{t("noData")}</li> : null}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 text-xl font-bold text-[#0f172a]">{t("fromAdmin")}</h3>
            <ul className="space-y-3">
              {(data?.notices || []).map((n) => (
                <li key={n._id} className="rounded-xl border-l-4 border-purple-400 border border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="font-semibold text-[#0f172a]">{n.title}</div>
                  <div className="text-slate-600">{n.body}</div>
                </li>
              ))}
              {!data?.notices?.length ? <li className="text-slate-400">{t("noData")}</li> : null}
            </ul>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-[#0f172a]" style={{ fontFamily: "Sora, sans-serif" }}>{t("features")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {features.map((f) => (
              <Link
                key={f.to}
                to={f.to}
                className="hms-focus glass lift-hover flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-3xl p-4 text-center transition duration-200"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.glow} text-4xl`}
                >
                  {f.icon}
                </span>
                <span className="text-base font-semibold text-[#0f172a]">{t(f.key)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
