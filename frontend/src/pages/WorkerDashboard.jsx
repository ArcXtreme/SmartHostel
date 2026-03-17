import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Alert, Button, Card, Container, Spinner } from "../components/ui.jsx";
import { api } from "../api/client.js";
import { loadAuth } from "../auth/storage.js";

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const auth = loadAuth();

  const [tab, setTab] = React.useState("today"); // today | all
  const [today, setToday] = React.useState({ date: "", requests: [] });
  const [all, setAll] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [busyId, setBusyId] = React.useState("");

  React.useEffect(() => {
    if (!auth || auth.role !== "worker") navigate("/worker/login");
  }, [auth, navigate]);

  async function refresh() {
    setError("");
    setLoading(true);
    try {
      const [t, h] = await Promise.all([api.get("/today-requests"), api.get("/history")]);
      setToday({ date: t.data.date, requests: t.data.requests || [] });
      setAll(h.data.history || []);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to load requests";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
  }, []);

  async function markComplete(id) {
    setError("");
    setBusyId(id);
    try {
      await api.patch("/mark-complete", { id });
      await refresh();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to mark complete";
      setError(msg);
    } finally {
      setBusyId("");
    }
  }

  const rows = tab === "today" ? today.requests : all;

  return (
    <div className="min-h-dvh">
      <Navbar />
      <Container>
        <div className="py-8 sm:py-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm text-white/60">Worker dashboard</div>
              <h1 className="mt-1 text-2xl font-semibold text-white">Cleaning Requests</h1>
              <div className="mt-1 text-sm text-white/60">Today: {today.date || "—"}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={tab === "today" ? "primary" : "ghost"} onClick={() => setTab("today")}>
                Today
              </Button>
              <Button variant={tab === "all" ? "primary" : "ghost"} onClick={() => setTab("all")}>
                All history
              </Button>
              <Button variant="ghost" onClick={refresh} disabled={loading}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Card>
              <div className="text-sm text-white/70">
                {tab === "today"
                  ? "All requests for today (mark completed when done)."
                  : "All stored requests (latest first)."}
              </div>

              {error ? (
                <div className="mt-4">
                  <Alert type="error">{error}</Alert>
                </div>
              ) : null}

              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <div className="grid grid-cols-4 gap-2 bg-white/5 px-4 py-3 text-xs text-white/70">
                  <div>Room</div>
                  <div>{tab === "today" ? "Time" : "Date"}</div>
                  <div>Status</div>
                  <div className="text-right">Action</div>
                </div>
                <div className="divide-y divide-white/10">
                  {loading ? (
                    <div className="px-4 py-4">
                      <Spinner />
                    </div>
                  ) : rows.length ? (
                    rows.map((r) => (
                      <div key={r._id} className="grid grid-cols-4 items-center gap-2 px-4 py-3 text-sm">
                        <div className="text-white">{r.roomNumber}</div>
                        <div className="text-white/80">{tab === "today" ? r.timeSlot : r.date}</div>
                        <div className={r.status === "completed" ? "text-emerald-300" : "text-amber-200"}>
                          {r.status}
                        </div>
                        <div className="flex justify-end">
                          {r.status === "completed" ? (
                            <span className="text-xs text-white/50">Done</span>
                          ) : (
                            <Button
                              variant="primary"
                              className="px-3 py-1.5 text-xs"
                              onClick={() => markComplete(r._id)}
                              disabled={busyId === r._id}
                            >
                              {busyId === r._id ? "Saving…" : "Mark complete"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-white/70">No requests found.</div>
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

