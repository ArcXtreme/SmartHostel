import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Alert, Button, Card, Container, Input, Spinner } from "../components/ui.jsx";
import { api } from "../api/client.js";
import { saveAuth } from "../auth/storage.js";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function StudentAuth() {
  const navigate = useNavigate();
  const query = useQuery();
  const initialMode = query.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = React.useState(initialMode);
  const [roomNumber, setRoomNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await api.post("/signup", { roomNumber, password, role: "student" });
        setSuccess((res.data?.message || "Signup successful") + ". Please sign in.");
        setMode("login");
        setPassword("");
        return;
      }
      const res2 = await api.post("/login", { roomNumber, password, role: "student" });
      saveAuth(res2.data.user);
      navigate("/student");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <Navbar />
      <Container>
        <div className="mx-auto max-w-xl py-10 sm:py-14">
          <h1 className="text-2xl font-semibold text-white">Student {mode === "signup" ? "Sign up" : "Sign in"}</h1>
          <p className="mt-2 text-sm text-white/70">Use your room number and password.</p>

          <div className="mt-6">
            <Card>
              <div className="mb-4 flex gap-2">
                <Button
                  variant={mode === "login" ? "primary" : "ghost"}
                  onClick={() => setMode("login")}
                  type="button"
                >
                  Sign in
                </Button>
                <Button
                  variant={mode === "signup" ? "primary" : "ghost"}
                  onClick={() => setMode("signup")}
                  type="button"
                >
                  Sign up
                </Button>
              </div>

              <form className="space-y-4" onSubmit={onSubmit}>
                <Input
                  label="Room number"
                  placeholder="e.g. 101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error ? <Alert type="error">{error}</Alert> : null}
                {success ? <Alert type="success">{success}</Alert> : null}

                <div className="flex items-center justify-between">
                  <Button disabled={loading} type="submit">
                    {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
                  </Button>
                  {loading ? <Spinner /> : null}
                </div>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

