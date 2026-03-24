import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function StudentNotices() {
  const { t } = useI18n();
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/notices", { params: { audience: "students" } });
        setRows(data.notices);
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
        <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("noticeBoard")}</h1>
        <div className="space-y-4">
          {rows.map((n) => (
            <Card key={n._id}>
              <div className="text-sm text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{n.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-lg text-slate-700">{n.body}</p>
            </Card>
          ))}
          {!rows.length ? <div className="text-slate-500">{t("noData")}</div> : null}
        </div>
      </div>
    </Container>
  );
}
