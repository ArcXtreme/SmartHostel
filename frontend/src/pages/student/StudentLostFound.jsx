import React, { useEffect, useState } from "react";
import { api, assetUrl } from "../../api/client.js";
import { Container, Card, Button, Input, TextArea, Select, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function StudentLostFound() {
  const { t } = useI18n();
  const [items, setItems] = useState(null);
  const [mine, setMine] = useState(null);
  const [type, setType] = useState("lost");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [collectAt, setCollectAt] = useState("");
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const [all, m] = await Promise.all([api.get("/api/lost-found"), api.get("/api/lost-found/mine")]);
      setItems(all.data.items);
      setMine(m.data.items);
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
      const fd = new FormData();
      fd.append("type", type);
      fd.append("description", description);
      fd.append("location", location);
      fd.append("collectAt", collectAt);
      for (const f of files) fd.append("images", f);
      await api.post("/api/lost-found", fd);
      setDescription("");
      setLocation("");
      setCollectAt("");
      setFiles([]);
      await load();
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  if (!items || !mine) {
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

        <Card className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("lostFound")}</h2>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Select label={t("lostOrFound")} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="lost">{t("lost")}</option>
              <option value="found">{t("found")}</option>
            </Select>
            <TextArea
              label={t("itemDescription")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Input label={t("location")} value={location} onChange={(e) => setLocation(e.target.value)} required />
            <Input label={t("collectAt")} value={collectAt} onChange={(e) => setCollectAt(e.target.value)} />
            <label className="block">
              <div className="mb-2 text-base font-medium text-slate-700">{t("images")}</div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>
            <Button type="submit" size="lg" disabled={busy}>
              {t("submit")}
            </Button>
          </form>
        </Card>

        <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("allItems")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it._id} className="overflow-hidden">
              <div className="text-sm font-semibold uppercase text-sky-700">{it.type}</div>
              <div className="mt-2 text-lg font-bold text-slate-900">{it.description}</div>
              <div className="mt-2 text-slate-600">
                {t("location")}: {it.location}
              </div>
              {it.collectAt ? (
                <div className="text-slate-600">
                  {t("collectAt")}: {it.collectAt}
                </div>
              ) : null}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(it.images || []).map((im) => (
                  <img key={im} src={assetUrl(im)} alt="" className="h-28 w-full rounded-lg object-cover" />
                ))}
              </div>
            </Card>
          ))}
        </div>

        <h2 className="mb-4 mt-12 text-2xl font-bold text-slate-900">{t("myPosts")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mine.map((it) => (
            <Card key={it._id}>
              <div className="font-semibold text-slate-900">{it.description}</div>
              <div className="text-slate-600">{it.type}</div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
