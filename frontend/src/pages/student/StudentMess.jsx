import React, { useEffect, useState } from "react";
import { api, assetUrl } from "../../api/client.js";
import { Container, Card, Button, Input, TextArea, Alert, Spinner } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function StudentMess() {
  const { t } = useI18n();
  const [rows, setRows] = useState(null);
  const [breakfast, setBreakfast] = useState(5);
  const [lunch, setLunch] = useState(5);
  const [dinner, setDinner] = useState(5);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const { data } = await api.get("/api/mess-feedback/my");
      setRows(data.feedback);
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
      fd.append("breakfast", String(breakfast));
      fd.append("lunch", String(lunch));
      fd.append("dinner", String(dinner));
      fd.append("comment", comment);
      if (file) fd.append("image", file);
      await api.post("/api/mess-feedback", fd);
      setComment("");
      setFile(null);
      await load();
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  if (!rows) {
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
          <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("mess")}</h2>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label={t("breakfast")}
              type="number"
              min={1}
              max={5}
              value={breakfast}
              onChange={(e) => setBreakfast(Number(e.target.value))}
            />
            <Input
              label={t("lunch")}
              type="number"
              min={1}
              max={5}
              value={lunch}
              onChange={(e) => setLunch(Number(e.target.value))}
            />
            <Input
              label={t("dinner")}
              type="number"
              min={1}
              max={5}
              value={dinner}
              onChange={(e) => setDinner(Number(e.target.value))}
            />
            <div className="sm:col-span-3">
              <TextArea label={t("comment")} value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            <div className="sm:col-span-3">
              <label className="block">
                <div className="mb-2 text-base font-medium text-slate-700">{t("foodPhoto")}</div>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <Button type="submit" size="lg" disabled={busy}>
              {t("submit")}
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="mb-4 text-xl font-bold text-slate-900">{t("myPosts")}</h3>
          <ul className="space-y-4">
            {rows.map((r) => (
              <li key={r._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="font-semibold text-slate-900">
                  {t("breakfast")}: {r.breakfast} · {t("lunch")}: {r.lunch} · {t("dinner")}: {r.dinner}
                </div>
                {r.comment ? <div className="mt-2 text-slate-700">{r.comment}</div> : null}
                {r.image ? (
                  <img
                    src={assetUrl(r.image)}
                    alt=""
                    className="mt-3 max-h-48 rounded-xl border border-slate-200"
                  />
                ) : null}
              </li>
            ))}
            {!rows.length ? <li className="text-slate-500">{t("noData")}</li> : null}
          </ul>
        </Card>
      </div>
    </Container>
  );
}
