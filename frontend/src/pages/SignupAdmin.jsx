import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { saveAuth } from "../auth/storage.js";
import { Container, Alert, Button, Input } from "../components/ui.jsx";
import { LangToggle } from "../components/LangToggle.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function SignupAdmin() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    idNumber: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const { data } = await api.post("/api/auth/signup/admin", form);
      saveAuth({ token: data.token, user: data.user });
      navigate("/admin", { replace: true });
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell min-h-screen">
      <header className="border-b border-white/10 bg-slate-900/45 backdrop-blur-xl">
        <Container>
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <Link className="text-xl font-bold text-slate-100" to="/">
              ← {t("appTitle")}
            </Link>
            <LangToggle />
          </div>
        </Container>
      </header>

      <Container>
        <div className="mx-auto max-w-lg py-10">
          <h1 className="mb-2 text-3xl font-bold text-slate-100">{t("signup")}</h1>
          <div className="mb-6 text-slate-300">{t("admin")}</div>

          {err ? (
            <div className="mb-4">
              <Alert type="error">{err}</Alert>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="glass flex flex-col gap-4 rounded-3xl p-6">
            <Input label={t("name")} value={form.name} onChange={(e) => set("name", e.target.value)} required />
            <Input
              label={t("idNumber")}
              value={form.idNumber}
              onChange={(e) => set("idNumber", e.target.value)}
              required
            />
            <Input
              label={t("email")}
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
            <Input
              label={t("password")}
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? t("loading") : t("signup")}
            </Button>
            <Link className="text-center text-blue-300 hover:text-blue-200 hover:underline" to="/login">
              {t("login")}
            </Link>
          </form>
        </div>
      </Container>
    </div>
  );
}
