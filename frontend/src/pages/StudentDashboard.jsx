import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Alert, Button, Card, Container, Input, Spinner } from "../components/ui.jsx";
import { api } from "../api/client.js";
import { loadAuth } from "../auth/storage.js";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const auth = loadAuth();

  const [timeSlot, setTimeSlot] = React.useState("10:00");
  const [today, setToday] = React.useState({ date: "", requests: [] });
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    if (!auth || auth.role !== "student") navigate("/student/auth");
  }, [auth, navigate]);

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const [t, h] = await Promise.all([
        api.get("/today-requests"),
        api.get("/history", { params: { roomNumber: auth.roomNumber } }),
      ]);
      setToday({ date: t.data.date, requests: t.data.requests || [] });
      setHistory(h.data.history || []);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to load dashboard";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (auth?.roomNumber) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.roomNumber]);

  async function submitRequest() {
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.post("/request-cleaning", { roomNumber: auth.roomNumber, timeSlot });
      setSuccess("Cleaning request scheduled!");
      await refresh();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to create request";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <Navbar />
      <Container>
        <div className="py-8 sm:py-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm text-white/60">Student dashboard</div>
              <h1 className="mt-1 text-2xl font-semibold text-white">
                Room <span className="text-indigo-300">{auth?.roomNumber}</span>
              </h1>
              <div className="mt-1 text-sm text-white/60">Today: {today.date || "—"}</div>
            </div>
            <Button variant="ghost" onClick={refresh} disabled={loading}>
              Refresh
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <div className="text-lg font-semibold text-white">Schedule Cleaning Request</div>
              <p className="mt-1 text-sm text-white/70">
                Pick any time for today and submit.
              </p>

              <div className="mt-4 space-y-4">
                <Input
                  label="Time"
                  type="time"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  required
                />

                <Button onClick={submitRequest} disabled={submitting || loading}>
                  {submitting ? "Submitting…" : "Submit request"}
                </Button>

                {submitting ? <Spinner /> : null}
                {error ? <Alert type="error">{error}</Alert> : null}
                {success ? <Alert type="success">{success}</Alert> : null}
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <div className="text-lg font-semibold text-white">Today’s Requests</div>
              <p className="mt-1 text-sm text-white/70">All booked slots for today (avoid conflicts).</p>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <div className="grid grid-cols-3 gap-2 bg-white/5 px-4 py-3 text-xs text-white/70">
                  <div>Room</div>
                  <div>Time</div>
                  <div>Status</div>
                </div>
                <div className="divide-y divide-white/10">
                  {loading ? (
                    <div className="px-4 py-4">
                      <Spinner />
                    </div>
                  ) : today.requests.length ? (
                    today.requests.map((r) => (
                      <div key={r._id} className="grid grid-cols-3 gap-2 px-4 py-3 text-sm">
                        <div className="text-white">{r.roomNumber}</div>
                        <div className="text-white/80">{r.timeSlot}</div>
                        <div className={r.status === "completed" ? "text-emerald-300" : "text-amber-200"}>
                          {r.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-white/70">No requests yet today.</div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-4">
            <Card>
              <div className="text-lg font-semibold text-white">Cleaning History</div>
              <p className="mt-1 text-sm text-white/70">Your previous cleaning requests.</p>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <div className="grid grid-cols-3 gap-2 bg-white/5 px-4 py-3 text-xs text-white/70">
                  <div>Date</div>
                  <div>Time</div>
                  <div>Status</div>
                </div>
                <div className="divide-y divide-white/10">
                  {loading ? (
                    <div className="px-4 py-4">
                      <Spinner />
                    </div>
                  ) : history.length ? (
                    history.map((r) => (
                      <div key={r._id} className="grid grid-cols-3 gap-2 px-4 py-3 text-sm">
                        <div className="text-white">{r.date}</div>
                        <div className="text-white/80">{r.timeSlot}</div>
                        <div className={r.status === "completed" ? "text-emerald-300" : "text-amber-200"}>
                          {r.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-white/70">No history yet.</div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

