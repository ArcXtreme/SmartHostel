import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Button, Select, Input, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function WorkerTasks() {
  const { t } = useI18n();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load() {
    try {
      const { data: d } = await api.get("/api/worker/tasks");
      setData(d);
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function patchComplaint(id, status) {
    setBusyId(`c-${id}`);
    try {
      await api.patch(`/api/complaints/${id}/status`, { status });
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    } finally {
      setBusyId("");
    }
  }

  async function startCleaning(id) {
    setBusyId(`cl-${id}`);
    try {
      await api.patch(`/api/cleaning/${id}/start`, {});
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    } finally {
      setBusyId("");
    }
  }

  async function completeCleaning(id) {
    setBusyId(`clc-${id}`);
    try {
      await api.patch(`/api/cleaning/${id}/complete-worker`, {});
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    } finally {
      setBusyId("");
    }
  }

  async function laundryStatus(id, status) {
    setBusyId(`l-${id}`);
    try {
      await api.patch(`/api/laundry/${id}/status`, { status });
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    } finally {
      setBusyId("");
    }
  }

  async function claimLaundry(id) {
    setBusyId(`lc-${id}`);
    try {
      await api.patch(`/api/laundry/${id}/claim`, {});
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    } finally {
      setBusyId("");
    }
  }

  async function cleanlinessMeta(id, payload) {
    setBusyId(`cm-${id}`);
    try {
      await api.patch(`/api/complaints/${id}/cleanliness-meta`, payload);
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    } finally {
      setBusyId("");
    }
  }

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

        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">{t("workersTasks")}</h1>
          <Button variant="ghost" onClick={load}>
            {t("refresh")}
          </Button>
        </div>

        <Card className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("complaintList")}</h2>
          <div className="space-y-4">
            {data.complaints.map((c) => (
              <div key={c._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="font-bold text-slate-900">
                  {c.category} · {c.title}
                </div>
                <div className="text-slate-700">{c.description}</div>
                <div className="mt-2 text-slate-600">
                  {c.studentId?.hostelName} {c.studentId?.roomNumber} ·{" "}
                  {c.studentId?.availabilityNote || "—"}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Select
                    value={c.status}
                    onChange={(e) => patchComplaint(c._id, e.target.value)}
                    disabled={busyId === `c-${c._id}`}
                  >
                    <option value="pending">{t("pending")}</option>
                    <option value="in_progress">{t("inProgress")}</option>
                    <option value="resolved">{t("resolved")}</option>
                  </Select>
                </div>

                {c.category === "cleanliness_common" ? (
                  <form
                    className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      cleanlinessMeta(c._id, {
                        lastCleanedByName: fd.get("lastCleanedByName"),
                        areasUnderCleaning: fd.get("areasUnderCleaning"),
                        lastCleanedAt: fd.get("lastCleanedAt") || new Date().toISOString(),
                      });
                    }}
                  >
                    <Input name="lastCleanedByName" label={t("workerName")} defaultValue={c.lastCleanedByName} />
                    <Input
                      name="lastCleanedAt"
                      label={t("lastCleanedTime")}
                      type="datetime-local"
                      defaultValue={
                        c.lastCleanedAt ? new Date(c.lastCleanedAt).toISOString().slice(0, 16) : ""
                      }
                    />
                    <Input
                      name="areasUnderCleaning"
                      className="sm:col-span-2"
                      label={t("areasCleaning")}
                      defaultValue={c.areasUnderCleaning}
                    />
                    <Button type="submit" disabled={busyId === `cm-${c._id}`}>
                      {t("save")}
                    </Button>
                  </form>
                ) : null}
              </div>
            ))}
            {!data.complaints.length ? <div className="text-slate-500">{t("noData")}</div> : null}
          </div>
        </Card>

        <Card className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">{t("cleaning")}</h2>
          <h3 className="mb-2 text-lg font-semibold text-slate-800">{t("openTasksPool")}</h3>
          <div className="space-y-3">
            {data.cleaning.openPool.map((r) => (
              <div key={r._id} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {r.hostelName} {r.roomNumber} · {r.date} {r.timeSlot}
                </div>
                <Button onClick={() => startCleaning(r._id)} disabled={busyId === `cl-${r._id}`}>
                  {t("takeTask")}
                </Button>
              </div>
            ))}
            {!data.cleaning.openPool.length ? <div className="text-slate-500">{t("noData")}</div> : null}
          </div>

          <h3 className="mb-2 mt-8 text-lg font-semibold">{t("assigned")}</h3>
          <div className="space-y-3">
            {data.cleaning.assigned.map((r) => (
              <div key={r._id} className="rounded-xl border border-slate-200 p-3">
                <div>
                  {r.hostelName} {r.roomNumber} · {r.status}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.status !== "completed" ? (
                    <Button onClick={() => completeCleaning(r._id)} disabled={busyId === `clc-${r._id}`}>
                      {t("markComplete")}
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
            {!data.cleaning.assigned.length ? <div className="text-slate-500">{t("noData")}</div> : null}
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">{t("laundry")}</h2>
          <h3 className="mb-2 text-lg font-semibold">{t("openTasksPool")}</h3>
          <div className="space-y-3">
            {data.laundry.openPool.map((o) => (
              <div key={o._id} className="rounded-xl border border-slate-200 p-3">
                <div className="font-semibold">
                  {o.studentId?.hostelName} {o.studentId?.roomNumber}
                </div>
                <div className="text-slate-700">{o.description}</div>
                <Button className="mt-2" onClick={() => claimLaundry(o._id)} disabled={busyId === `lc-${o._id}`}>
                  {t("takeTask")}
                </Button>
              </div>
            ))}
          </div>
          <h3 className="mb-2 mt-8 text-lg font-semibold">{t("assigned")}</h3>
          <div className="space-y-3">
            {data.laundry.assigned.map((o) => (
              <div key={o._id} className="rounded-xl border border-slate-200 p-3">
                <div className="font-semibold">{o.status}</div>
                <Select
                  value={o.status}
                  onChange={(e) => laundryStatus(o._id, e.target.value)}
                  disabled={busyId === `l-${o._id}`}
                >
                  <option value="pending">{t("pending")}</option>
                  <option value="in_progress">{t("inProgress")}</option>
                  <option value="completed">{t("completed")}</option>
                </Select>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Container>
  );
}
