import React, { useState } from "react";
import { api } from "../../api/client.js";
import { Container, Card, Button, Input, TextArea, Select, Alert } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function AdminNotices() {
  const { t } = useI18n();
  const [audience, setAudience] = useState("students");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setBusy(true);
    try {
      await api.post("/api/notices", { audience, title, body });
      setOk(t("submittedOk"));
      setTitle("");
      setBody("");
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container>
      <div className="py-8">
        {err ? (
          <div className="mb-4">
            <Alert type="error">{err}</Alert>
          </div>
        ) : null}
        {ok ? (
          <div className="mb-4">
            <Alert type="success">{ok}</Alert>
          </div>
        ) : null}
        <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("postNotice")}</h1>
        <Card>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Select label={t("audienceLabel")} value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value="students">{t("audienceStudents")}</option>
              <option value="workers">{t("audienceWorkers")}</option>
            </Select>
            <Input label={t("noticeTitle")} value={title} onChange={(e) => setTitle(e.target.value)} required />
            <TextArea label={t("noticeBody")} value={body} onChange={(e) => setBody(e.target.value)} required />
            <Button type="submit" size="lg" disabled={busy}>
              {t("submit")}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
