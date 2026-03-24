import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { Container, Card, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

const features = [
  { to: "/student/cleaning", key: "cleaning", icon: "🧼" },
  { to: "/student/complaint/internet", key: "internet", icon: "📶" },
  { to: "/student/complaint/furniture", key: "furniture", icon: "🪑" },
  { to: "/student/complaint/electricity", key: "electricity", icon: "💡" },
  { to: "/student/complaint/water", key: "water", icon: "💧" },
  { to: "/student/complaint/cleanliness_common", key: "cleanliness", icon: "🚿" },
  { to: "/student/laundry", key: "laundry", icon: "🧺" },
  { to: "/student/mess", key: "mess", icon: "🍛" },
  { to: "/student/lost-found", key: "lostFound", icon: "🔍" },
  { to: "/student/notices", key: "noticeBoard", icon: "📌" },
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
            <div className="mt-2 text-4xl font-bold text-slate-900">{data?.queryCount ?? 0}</div>
          </Card>
          <Card>
            <div className="text-sm font-medium text-slate-500">{t("notifications")}</div>
            <div className="mt-2 text-4xl font-bold text-slate-900">{data?.notifications?.length ?? 0}</div>
          </Card>
          <Card>
            <div className="text-sm font-medium text-slate-500">{t("notices")}</div>
            <div className="mt-2 text-4xl font-bold text-slate-900">{data?.notices?.length ?? 0}</div>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("quickSummary")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(data?.cards || {}).map(([k, v]) => (
              <Card key={k} className="py-4">
                <div className="text-sm capitalize text-slate-500">{k}</div>
                <div className="text-2xl font-bold text-slate-900">{v}</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-3 text-xl font-bold text-slate-900">{t("notifications")}</h3>
            <ul className="space-y-3">
              {(data?.notifications || []).slice(0, 6).map((n) => (
                <li key={n._id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">
                  {n.message}
                </li>
              ))}
              {!data?.notifications?.length ? <li className="text-slate-500">{t("noData")}</li> : null}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 text-xl font-bold text-slate-900">{t("fromAdmin")}</h3>
            <ul className="space-y-3">
              {(data?.notices || []).map((n) => (
                <li key={n._id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="font-semibold text-slate-900">{n.title}</div>
                  <div className="text-slate-600">{n.body}</div>
                </li>
              ))}
              {!data?.notices?.length ? <li className="text-slate-500">{t("noData")}</li> : null}
            </ul>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("features")}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {features.map((f) => (
              <Link
                key={f.to}
                to={f.to}
                className="hms-focus flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white p-4 text-center shadow-sm hover:border-sky-300"
              >
                <span className="text-4xl">{f.icon}</span>
                <span className="text-base font-semibold text-slate-900">{t(f.key)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
