import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client.js";
import { saveAuth } from "../auth/storage.js";
import { Container, Alert, Button, Input, Select } from "../components/ui.jsx";
import { LangToggle } from "../components/LangToggle.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Login() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const defaultRole = params.get("role") || "student";

  const [role, setRole] = useState(
    ["student", "admin", "worker"].includes(defaultRole) ? defaultRole : "student"
  );
  const [email, setEmail] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const signupPath = useMemo(() => {
    if (role === "admin") return "/signup/admin";
    if (role === "worker") return "/signup/worker";
    return "/signup/student";
  }, [role]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const body = { role, password };
      if (role === "worker") body.workerId = workerId.trim();
      else body.email = email.trim().toLowerCase();

      const { data } = await api.post("/api/auth/login", body);
      saveAuth({ token: data.token, user: data.user });

      if (data.user.role === "student") navigate("/student", { replace: true });
      else if (data.user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/worker", { replace: true });
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
          <h1 className="mb-6 text-3xl font-bold text-slate-900">{t("login")}</h1>

          {err ? (
            <div className="mb-4">
              <Alert type="error">{err}</Alert>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Select label={t("role")} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">{t("student")}</option>
              <option value="admin">{t("admin")}</option>
              <option value="worker">{t("worker")}</option>
            </Select>

            {role === "worker" ? (
              <Input label={t("workerId")} value={workerId} onChange={(e) => setWorkerId(e.target.value)} required />
            ) : (
              <Input
                label={t("email")}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}

            <Input
              label={t("password")}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy ? t("loading") : t("login")}
            </Button>

            <Link className="text-center text-sky-700 hover:underline" to={signupPath}>
              {t("signup")}
            </Link>
          </form>
        </div>
      </Container>
    </div>
  );
}
