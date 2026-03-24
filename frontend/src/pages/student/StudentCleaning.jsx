import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Button, Input, Select, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function StudentCleaning() {
  const { t } = useI18n();
  const [slots, setSlots] = useState([]);
  const [today, setToday] = useState({ date: "", requests: [] });
  const [mine, setMine] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [availabilityNote, setAvailabilityNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [banner, setBanner] = useState(null);
  const [confirmId, setConfirmId] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  async function refresh() {
    setErr("");
    try {
      const [s, td, my] = await Promise.all([
        api.get("/api/cleaning/slots"),
        api.get("/api/cleaning/today"),
        api.get("/api/cleaning/my"),
      ]);
      setSlots(s.data.slots || []);
      setToday(td.data);
      setMine(my.data);
      if (my.data?.requests?.[0]?._id && !confirmId) setConfirmId(my.data.requests[0]._id);
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!mine?.requests?.length) return;
    const needsConfirm = mine.requests.find((r) => r.status === "completed" && !r.studentConfirmedAt);
    setConfirmId((prev) => needsConfirm?._id || prev || mine.requests[0]._id);
  }, [mine]);

  async function submitRequest(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/api/cleaning/request", { timeSlot, studentNote });
      setBanner({ type: "success", text: t("submittedOk") });
      setTimeSlot("");
      setStudentNote("");
      await refresh();
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  async function saveAvailability(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.patch("/api/student/availability", { availabilityNote });
      setBanner({ type: "success", text: t("savedOk") });
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  async function confirmCleaning(e) {
    e.preventDefault();
    if (!confirmId) return;
    setBusy(true);
    try {
      await api.patch(`/api/cleaning/${confirmId}/confirm-student`, { rating, feedback });
      setBanner({ type: "success", text: t("savedOk") });
      await refresh();
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  if (!mine) {
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
        {banner ? (
          <div className="mb-4">
            <Alert type="success">{banner.text}</Alert>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">{t("lastCleaned")}</h2>
            <div className="text-lg text-slate-700">
              {mine.lastCleanedAt
                ? new Date(mine.lastCleanedAt).toLocaleString()
                : t("noData")}
            </div>
            {mine.lastCleanedBy ? (
              <div className="mt-2 text-slate-600">
                {t("workerName")}: {mine.lastCleanedBy}
              </div>
            ) : null}
          </Card>

          <Card>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">{t("studentAvailability")}</h2>
            <form onSubmit={saveAvailability} className="flex flex-col gap-3">
              <Input value={availabilityNote} onChange={(e) => setAvailabilityNote(e.target.value)} />
              <Button type="submit" disabled={busy}>
                {t("save")}
              </Button>
            </form>
          </Card>
        </div>

        <Card className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("requestSlot")}</h2>
          <form onSubmit={submitRequest} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label={t("timeSlot")} value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
              <option value="">—</option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Input
              label={t("studentNote")}
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
            />
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={busy}>
                {t("submit")}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("todayCleaning")}</h2>
          <div className="text-sm text-slate-500">{today.date}</div>
          <ul className="mt-3 space-y-2">
            {(today.requests || []).map((r) => (
              <li key={r._id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="font-semibold">
                  {r.hostelName} {r.roomNumber}
                </span>{" "}
                · {r.timeSlot} · {r.status}
              </li>
            ))}
            {!today.requests?.length ? <li className="text-slate-500">{t("noData")}</li> : null}
          </ul>
        </Card>

        <Card className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("myCleaning")}</h2>
          <ul className="space-y-2">
            {(mine.requests || []).map((r) => (
              <li key={r._id} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                {r.date} {r.timeSlot} — {r.status}
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="mb-3 text-xl font-bold text-slate-900">{t("confirmRate")}</h3>
            <form onSubmit={confirmCleaning} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Select label={t("selectRequest")} value={confirmId} onChange={(e) => setConfirmId(e.target.value)}>
                {(mine.requests || []).map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.date} {r.timeSlot} ({r.status})
                  </option>
                ))}
              </Select>
              <Input
                label={t("rating")}
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
              <div className="sm:col-span-2">
                <label className="block">
                  <div className="mb-2 text-base font-medium text-slate-700">{t("feedback")}</div>
                  <textarea
                    className="hms-focus w-full min-h-[100px] rounded-2xl border border-slate-300 px-4 py-3 text-lg"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </label>
              </div>
              <Button type="submit" disabled={busy}>
                {t("confirmRate")}
              </Button>
            </form>
          </div>
        </Card>

        <div className="mt-6">
          <Button variant="ghost" onClick={refresh}>
            {t("refresh")}
          </Button>
        </div>
      </div>
    </Container>
  );
}
