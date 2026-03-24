import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Button, Select, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminLaundry() {
  const { t } = useI18n();
  const [orders, setOrders] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const [o, w] = await Promise.all([api.get("/api/laundry/all"), api.get("/api/admin/workers")]);
      setOrders(o.data.orders);
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
      await api.patch(`/api/laundry/${id}/assign`, { workerId: workerMongoId });
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
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
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">{t("laundryOrders")}</h1>
          <Button variant="ghost" onClick={load}>
            {t("refresh")}
          </Button>
        </div>
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o._id}>
              <div className="font-bold text-slate-900">
                {o.studentId?.hostelName} {o.studentId?.roomNumber}
              </div>
              <div className="text-slate-700">{o.description}</div>
              <div className="mt-2 font-semibold">{o.status}</div>
              <Select
                label={t("assignWorker")}
                defaultValue=""
                onChange={(e) => assign(o._id, e.target.value)}
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
        </div>
      </div>
    </Container>
  );
}
