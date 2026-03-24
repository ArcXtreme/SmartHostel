import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Button, Input, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function StudentLaundry() {
  const { t } = useI18n();
  const [orders, setOrders] = useState(null);
  const [description, setDescription] = useState("");
  const [bagLabel, setBagLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const { data } = await api.get("/api/laundry/my");
      setOrders(data.orders);
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
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("orderLaundry")}</h2>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input label={t("description")} value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input label={t("bagLabel")} value={bagLabel} onChange={(e) => setBagLabel(e.target.value)} />
            <Button type="submit" size="lg" disabled={busy}>
              {t("submit")}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("myLaundry")}</h2>
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o._id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="font-semibold text-slate-900">{o.status}</div>
                <div className="text-slate-600">{o.description || "—"}</div>
              </li>
            ))}
            {!orders.length ? <li className="text-slate-500">{t("noData")}</li> : null}
          </ul>
        </Card>
      </div>
    </Container>
  );
}
