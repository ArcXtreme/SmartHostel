import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { saveAuth } from "../auth/storage.js";
import { Container, Alert, Button, Input, Select } from "../components/ui.jsx";
import { LangToggle } from "../components/LangToggle.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

const HOSTELS = ["Chenab", "Raavi", "Beas", "Satluj", "Brahmaputra"];
const ROLL_RE = /^[0-9]{4}[a-z]{3}[0-9]{4}$/;

export default function SignupStudent() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
    hostelName: "",
    roomNumber: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!ROLL_RE.test(String(form.rollNumber || "").trim())) {
      setErr("Roll number must match format like 2024eeb1179");
      return;
    }
    if (!HOSTELS.includes(String(form.hostelName || "").trim())) {
      setErr("Please select a valid hostel name");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/api/auth/signup/student", form);
      saveAuth({ token: data.token, user: data.user });
      navigate("/student", { replace: true });
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#e8f4fc]">
      <header className="border-b border-sky-100 bg-white">
        <Container>
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <Link className="text-xl font-bold text-slate-900" to="/">
              ← {t("appTitle")}
            </Link>
            <LangToggle />
          </div>
        </Container>
      </header>

      <Container>
        <div className="mx-auto max-w-lg py-10">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">{t("signup")}</h1>
          <div className="mb-6 text-slate-600">{t("student")}</div>

          {err ? (
            <div className="mb-4">
              <Alert type="error">{err}</Alert>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Input label={t("name")} value={form.name} onChange={(e) => set("name", e.target.value)} required />
            <Input
              label={t("rollNumber")}
              value={form.rollNumber}
              onChange={(e) => set("rollNumber", e.target.value)}
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
            <Select label={t("hostelName")} value={form.hostelName} onChange={(e) => set("hostelName", e.target.value)} required>
              <option value="">—</option>
              {HOSTELS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </Select>
            <Input
              label={t("roomNumber")}
              value={form.roomNumber}
              onChange={(e) => set("roomNumber", e.target.value)}
              required
            />

            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? t("loading") : t("signup")}
            </Button>
            <Link className="text-center text-sky-700 hover:underline" to="/login">
              {t("login")}
            </Link>
          </form>
        </div>
      </Container>
    </div>
  );
}
