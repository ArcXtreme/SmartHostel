import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Button, Input, Select, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function StudentCleaning() {
  const { t } = useI18n();
  const [slots, setSlots] = useState([]);
  const [mine, setMine] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [banner, setBanner] = useState(null);
  const [cleanerName, setCleanerName] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [lastCleanedHistory, setLastCleanedHistory] = useState([]);

  async function refresh() {
    setErr("");
    try {
      const [s, my] = await Promise.all([
        api.get("/api/cleaning/slots"),
        api.get("/api/cleaning/my"),
      ]);
      setSlots(s.data.slots || []);
      setMine(my.data);
      setLastCleanedHistory(my.data.lastCleanedHistory || []);
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

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

  async function submitFeedback(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/api/cleaning/feedback", { cleanerName, rating, description: feedback });
      setBanner({ type: "success", text: t("savedOk") });
      setCleanerName("");
      setRating(5);
      setFeedback("");
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
          </Card>

          <Card>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Last Cleaned Dates</h2>
            <ul className="mt-2 space-y-2">
              {(lastCleanedHistory || []).slice(0, 5).map((h) => (
                <li key={h._id || h.cleanedAt} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="font-semibold text-slate-900">{new Date(h.cleanedAt).toLocaleString()}</div>
                  <div className="text-slate-600">{h.cleanerName || "—"}</div>
                </li>
              ))}
              {!lastCleanedHistory?.length ? <li className="text-slate-500">{t("noData")}</li> : null}
            </ul>
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
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Feedback</h2>
          <form onSubmit={submitFeedback} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Cleaner Name" value={cleanerName} onChange={(e) => setCleanerName(e.target.value)} required />
            <Select label={t("rating")} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
            <div className="sm:col-span-2">
              <label className="block">
                <div className="mb-2 text-base font-medium text-slate-700">Description</div>
                <textarea
                  className="hms-focus w-full min-h-[100px] rounded-2xl border border-slate-300 px-4 py-3 text-lg"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
              </label>
            </div>
            <Button type="submit" disabled={busy}>
              {t("submit")}
            </Button>
          </form>
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
