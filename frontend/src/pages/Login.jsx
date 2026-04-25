import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { saveAuth } from "../auth/storage.js";
import { Container, Alert, Button, Input } from "../components/ui.jsx";
import { LangToggle } from "../components/LangToggle.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function Login() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [info, setInfo] = useState("");

  const signupPath = useMemo(() => {
    return "/signup/student";
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setBusy(true);
    try {
      const body = { password, email: email.trim().toLowerCase() };
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

  async function requestOtp(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setBusy(true);
    try {
      await api.post("/api/auth/forgot-password/request-otp", { email: email.trim().toLowerCase() });
      setOtpSent(true);
      setInfo("OTP sent (if email is registered).");
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setBusy(true);
    try {
      await api.post("/api/auth/forgot-password/verify-otp", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
      setInfo("OTP verified. You can now reset your password.");
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setBusy(true);
    try {
      await api.post("/api/auth/forgot-password/reset", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });
      setInfo("Password updated. Please sign in.");
      setForgotMode(false);
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
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
          <h1 className="mb-6 text-3xl font-bold text-slate-100">{forgotMode ? "Forgot Password" : t("login")}</h1>

          {err ? (
            <div className="mb-4">
              <Alert type="error">{err}</Alert>
            </div>
          ) : null}
          {info ? (
            <div className="mb-4">
              <Alert type="success">{info}</Alert>
            </div>
          ) : null}

          {!forgotMode ? (
            <form onSubmit={onSubmit} className="glass flex flex-col gap-4 rounded-3xl p-6">
              <Input
                label={t("email")}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

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

              <button
                type="button"
                className="text-center text-blue-300 hover:text-blue-200 hover:underline"
                onClick={() => setForgotMode(true)}
              >
                Forgot Password?
              </button>

              <Link className="text-center text-blue-300 hover:text-blue-200 hover:underline" to={signupPath}>
                {t("signup")}
              </Link>
            </form>
          ) : (
            <div className="glass flex flex-col gap-4 rounded-3xl p-6">
              <form onSubmit={requestOtp} className="flex flex-col gap-3">
                <Input
                  label="Registered Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={busy}>
                  {busy ? t("loading") : "Send OTP"}
                </Button>
              </form>

              {otpSent ? (
                <>
                  <form onSubmit={verifyOtp} className="flex flex-col gap-3">
                    <Input label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    <Button type="submit" disabled={busy}>
                      {busy ? t("loading") : "Verify OTP"}
                    </Button>
                  </form>

                  <form onSubmit={resetPassword} className="flex flex-col gap-3">
                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Button type="submit" disabled={busy}>
                      {busy ? t("loading") : "Reset Password"}
                    </Button>
                  </form>
                </>
              ) : null}

              <button
                type="button"
                className="text-center text-blue-300 hover:text-blue-200 hover:underline"
                onClick={() => {
                  setForgotMode(false);
                  setOtpSent(false);
                  setOtp("");
                  setNewPassword("");
                  setInfo("");
                  setErr("");
                }}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
