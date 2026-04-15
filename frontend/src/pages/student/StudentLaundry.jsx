import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Button, Input, Alert, Spinner, Select, TextArea } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

function StatusPill({ status }) {
  const map = {
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-900 border-amber-200" },
    in_progress: { label: "Washing", cls: "bg-sky-50 text-sky-900 border-sky-200" },
    completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-900 border-emerald-200" },
  };
  const s = map[status] || { label: status, cls: "bg-slate-50 text-slate-900 border-slate-200" };
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${s.cls}`}>{s.label}</span>;
}

export default function StudentLaundry() {
  const { t } = useI18n();
  const [orders, setOrders] = useState(null);
  const [description, setDescription] = useState("");
  const [bagLabel, setBagLabel] = useState("");
  const [feedbackOrderId, setFeedbackOrderId] = useState("");
  const [rating, setRating] = useState(5);
  const [fb, setFb] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const { data } = await api.get("/api/laundry/my");
      setOrders(data.orders);
      if (data.orders?.[0]?._id && !feedbackOrderId) setFeedbackOrderId(data.orders[0]._id);
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/api/laundry", { description, bagLabel });
      setDescription("");
      setBagLabel("");
      await load();
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
      await api.post("/api/laundry/feedback", { laundryId: feedbackOrderId, rating, description: fb });
      setFb("");
      setRating(5);
      await load();
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  if (!orders) {
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

        <Card className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Smart Laundry</h2>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input label="Name on bucket" value={bagLabel} onChange={(e) => setBagLabel(e.target.value)} required />
            <Input label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Button type="submit" size="lg" disabled={busy}>
              {t("submit")}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">My Laundry</h2>
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o._id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">{o.bagLabel || "—"}</div>
                  <StatusPill status={o.status} />
                </div>
                <div className="mt-1 text-slate-600">Room: {o.studentId?.roomNumber || "—"}</div>
                {o.description ? <div className="mt-1 text-slate-600">{o.description}</div> : null}
              </li>
            ))}
            {!orders.length ? <li className="text-slate-500">{t("noData")}</li> : null}
          </ul>
        </Card>

        <Card className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Feedback</h2>
          <form onSubmit={submitFeedback} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Select order" value={feedbackOrderId} onChange={(e) => setFeedbackOrderId(e.target.value)}>
              {orders.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.bagLabel || "Laundry"} ({o.status})
                </option>
              ))}
            </Select>
            <Select label="Rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
            <div className="sm:col-span-2">
              <TextArea label="Description" value={fb} onChange={(e) => setFb(e.target.value)} />
            </div>
            <Button type="submit" disabled={busy}>
              {t("submit")}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
