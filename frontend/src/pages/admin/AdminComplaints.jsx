import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Button, Select, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminComplaints() {
  const { t } = useI18n();
  const [rows, setRows] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [category, setCategory] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    try {
      const params = {};
      if (category) params.category = category;
      const [c, w] = await Promise.all([
        api.get("/api/complaints", { params }),
        api.get("/api/admin/workers"),
      ]);
      setRows(c.data.complaints);
      setWorkers(w.data.workers || []);
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  useEffect(() => {
    load();
  }, [category]);

  async function assign(id, workerMongoId) {
    if (!workerMongoId) return;
    try {
      await api.patch(`/api/complaints/${id}/assign`, { workerId: workerMongoId });
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  async function setStatus(id, status) {
    try {
      await api.patch(`/api/complaints/${id}/status`, { status });
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

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

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <h1 className="text-3xl font-bold text-slate-900">{t("complaintList")}</h1>
          <Select
            label={t("filterCategory")}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="max-w-xs"
          >
            <option value="">{t("all")}</option>
            <option value="internet">{t("internet")}</option>
            <option value="furniture">{t("furniture")}</option>
            <option value="electricity">{t("electricity")}</option>
            <option value="water">{t("water")}</option>
            <option value="cleanliness_common">{t("cleanliness")}</option>
          </Select>
          <Button variant="ghost" onClick={load}>
            {t("refresh")}
          </Button>
        </div>

        <div className="space-y-4">
          {rows.map((c) => (
            <Card key={c._id}>
              <div className="text-sm font-bold uppercase text-sky-800">{c.category}</div>
              <div className="text-xl font-bold text-slate-900">{c.title}</div>
              <div className="mt-2 text-slate-700">{c.description}</div>
              <div className="mt-2 text-slate-600">
                {c.studentId?.hostelName} {c.studentId?.roomNumber} · {c.studentId?.email}
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Select
                  label={t("assignWorker")}
                  defaultValue=""
                  onChange={(e) => assign(c._id, e.target.value)}
                >
                  <option value="">—</option>
                  {workers.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.name} ({w.workerId})
                    </option>
                  ))}
                </Select>
                <Select
                  label={t("status")}
                  value={c.status}
                  onChange={(e) => setStatus(c._id, e.target.value)}
                >
                  <option value="pending">{t("pending")}</option>
                  <option value="in_progress">{t("inProgress")}</option>
                  <option value="resolved">{t("resolved")}</option>
                </Select>
              </div>
            </Card>
          ))}
          {!rows.length ? <div className="text-slate-500">{t("noData")}</div> : null}
        </div>
      </div>
    </Container>
  );
}
