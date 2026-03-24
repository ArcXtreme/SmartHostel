import React, { useEffect, useState } from "react";
import { api, assetUrl } from "../../api/client.js";
import { Container, Card, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminMess() {
  const { t } = useI18n();
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/mess-feedback/all");
        setRows(data.feedback);
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
        <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("messFeedback")}</h1>
        <div className="space-y-4">
          {rows.map((r) => (
            <Card key={r._id}>
              <div className="font-semibold text-slate-900">
                {r.studentId?.name} · {r.studentId?.roomNumber}
              </div>
              <div className="text-lg text-slate-800">
                {t("breakfast")}: {r.breakfast} · {t("lunch")}: {r.lunch} · {t("dinner")}: {r.dinner}
              </div>
              {r.comment ? <div className="mt-2 text-slate-700">{r.comment}</div> : null}
              {r.image ? (
                <img src={assetUrl(r.image)} alt="" className="mt-3 max-h-56 rounded-xl border" />
              ) : null}
            </Card>
          ))}
          {!rows.length ? <div className="text-slate-500">{t("noData")}</div> : null}
        </div>
      </div>
    </Container>
  );
}
