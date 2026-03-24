import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { Container, Card, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminDashboard() {
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

        <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("adminPanel")}</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <div className="text-sm text-slate-500">{t("openComplaints")}</div>
            <div className="text-4xl font-bold">{data?.queryCount ?? 0}</div>
            <Link className="mt-3 inline-block text-sky-700 hover:underline" to="/admin/complaints">
              {t("complaintList")}
            </Link>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">{t("notifications")}</div>
            <div className="text-4xl font-bold">{data?.notifications?.length ?? 0}</div>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">{t("notices")}</div>
            <div className="text-4xl font-bold">{data?.notices?.length ?? 0}</div>
            <Link className="mt-3 inline-block text-sky-700 hover:underline" to="/admin/notices">
              {t("postNotice")}
            </Link>
          </Card>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-3 text-xl font-bold">{t("notifications")}</h3>
            <ul className="space-y-2">
              {(data?.notifications || []).slice(0, 8).map((n) => (
                <li key={n._id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  {n.message}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="mb-3 text-xl font-bold">{t("notices")}</h3>
            <ul className="space-y-2">
              {(data?.notices || []).map((n) => (
                <li key={n._id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-slate-700">{n.body}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </Container>
  );
}
