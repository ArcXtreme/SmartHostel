import React, { useEffect, useState } from "react";
import { api, assetUrl } from "../../api/client.js";
import { Container, Card, Button, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminLostFound() {
  const { t } = useI18n();
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const { data } = await api.get("/api/lost-found");
      setItems(data.items);
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function resolve(id) {
    try {
      await api.patch(`/api/lost-found/${id}/resolve`, {});
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || t("error"));
    }
  }

  if (!items) {
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
        <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("lostFoundAdmin")}</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((it) => (
            <Card key={it._id}>
              <div className="text-sm font-bold uppercase text-sky-800">{it.type}</div>
              <div className="text-xl font-bold text-slate-900">{it.description}</div>
              <div className="text-slate-700">{it.location}</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(it.images || []).map((im) => (
                  <img key={im} src={assetUrl(im)} alt="" className="h-28 w-full rounded-lg object-cover" />
                ))}
              </div>
              <Button className="mt-4" onClick={() => resolve(it._id)}>
                {t("markItemResolved")}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
