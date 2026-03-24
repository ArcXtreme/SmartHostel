import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function StudentComplaintsList() {
  const { t } = useI18n();
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/complaints/my");
        setRows(data.complaints);
      } catch (e) {
        setErr(e.response?.data?.message || t("error"));
      }
    })();
  }, []);

  if (!rows) {
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
        <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("complaintList")}</h1>
        <div className="space-y-4">
          {rows.map((c) => (
            <Card key={c._id}>
              <div className="text-sm font-semibold uppercase text-sky-800">{c.category}</div>
              <div className="mt-2 text-xl font-bold text-slate-900">{c.title}</div>
              <div className="mt-2 text-slate-700">{c.description}</div>
              <div className="mt-3 text-lg font-semibold text-slate-800">
                {t("status")}: {c.status}
              </div>
            </Card>
          ))}
          {!rows.length ? <div className="text-slate-500">{t("noData")}</div> : null}
        </div>
      </div>
    </Container>
  );
}
