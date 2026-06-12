import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { Container, Card, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function WorkerDashboard() {
  const { t } = useI18n();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data: d } = await api.get("/api/dashboard");
        setData(d);
      } catch (e) {
        setErr(e.response?.data?.message || t("error"));
      }
    })();
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

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <div className="text-sm font-medium text-slate-500">{t("workersTasks")}</div>
            <div className="mt-2 text-4xl font-bold text-[#0f172a]">{data?.queryCount ?? 0}</div>
          </Card>
          <Card>
            <div className="text-sm font-medium text-slate-500">{t("notifications")}</div>
            <div className="mt-2 text-4xl font-bold text-[#0f172a]">{data?.notifications?.length ?? 0}</div>
          </Card>
          <Card>
            <Link
              className="flex h-full min-h-[120px] items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-violet-500/20 hover:brightness-110 transition"
              to="/worker/tasks"
            >
              {t("workersTasks")}
            </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-3 text-xl font-bold text-[#0f172a]">{t("notifications")}</h3>
            <ul className="space-y-3">
              {(data?.notifications || []).slice(0, 8).map((n) => (
                <li key={n._id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[#0f172a]">
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
                <li key={n._id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="font-semibold text-[#0f172a]">{n.title}</div>
                  <div className="text-slate-600">{n.body}</div>
                </li>
              ))}
              {!data?.notices?.length ? <li className="text-slate-400">{t("noData")}</li> : null}
            </ul>
          </Card>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(data?.cards || {}).map(([k, v]) => (
            <Card key={k} className="py-4">
              <div className="text-sm capitalize text-slate-500">{k}</div>
              <div className="text-3xl font-bold text-[#0f172a]">{v}</div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
