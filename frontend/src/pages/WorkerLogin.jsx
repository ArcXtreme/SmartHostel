import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Alert, Button, Card, Container, Input, Spinner } from "../components/ui.jsx";
import { api } from "../api/client.js";
import { saveAuth } from "../auth/storage.js";

export default function WorkerLogin() {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/login", { roomNumber, password, role: "worker" });
      saveAuth(res.data.user);
      navigate("/worker");
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
          <h1 className="text-2xl font-semibold text-white">Worker login</h1>
          <p className="mt-2 text-sm text-white/70">Enter your worker ID and password.</p>

          <div className="mt-6">
            <Card>
              <form className="space-y-4" onSubmit={onSubmit}>
                <Input
                  label="Worker ID"
                  placeholder="e.g. worker1"
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

                <div className="flex items-center justify-between">
                  <Button disabled={loading} type="submit">
                    {loading ? "Signing in…" : "Sign in"}
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

