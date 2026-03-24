import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Button, Select, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminCleaning() {
  const { t } = useI18n();
  const [today, setToday] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const [td, w] = await Promise.all([api.get("/api/cleaning/today"), api.get("/api/admin/workers")]);
      setToday(td.data);
      setWorkers(w.data.workers || []);
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function assign(id, workerMongoId) {
    if (!workerMongoId) return;
    try {
      await api.patch(`/api/admin/cleaning/${id}/assign`, { workerId: workerMongoId });
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  if (!today) {
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
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">{t("cleaningAssign")}</h1>
          <Button variant="ghost" onClick={load}>
            {t("refresh")}
          </Button>
        </div>
        <div className="text-slate-600">{today.date}</div>
        <div className="mt-6 space-y-4">
          {(today.requests || []).map((r) => (
            <Card key={r._id}>
              <div className="text-xl font-bold text-slate-900">
                {r.hostelName} {r.roomNumber}
              </div>
              <div className="text-slate-700">
                {r.timeSlot} · {r.status}
              </div>
              <Select
                label={t("assignWorker")}
                defaultValue=""
                onChange={(e) => assign(r._id, e.target.value)}
                className="mt-3 max-w-md"
              >
                <option value="">—</option>
                {workers.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name} ({w.workerId})
                  </option>
                ))}
              </Select>
            </Card>
          ))}
          {!today.requests?.length ? <div className="text-slate-500">{t("noData")}</div> : null}
        </div>
      </div>
    </Container>
  );
}
