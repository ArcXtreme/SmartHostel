import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminAnalytics() {
  const { t } = useI18n();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data: d } = await api.get("/api/admin/analytics");
        setData(d);
      } catch (e) {
        setErr(e.response?.data?.message || t("error"));
      }
    })();
  }, []);

  if (!data) {
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
        <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("analytics")}</h1>
        <Card className="mb-6">
          <div className="text-lg font-semibold text-slate-800">{t("highestCategory")}</div>
          <div className="text-3xl font-bold text-sky-800">{data.highestCategory}</div>
          <div className="mt-2 text-slate-600">
            {t("total")}: {data.totalComplaints}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-bold">{t("complaintsByCategory")}</h2>
          <ul className="space-y-2">
            {Object.entries(data.complaintCountsByCategory || {}).map(([k, v]) => (
              <li key={k} className="flex justify-between rounded-xl bg-slate-50 px-4 py-3 text-lg">
                <span className="font-medium text-slate-800">{k}</span>
                <span className="font-bold">{v}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Container>
  );
}
