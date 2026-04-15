import React, { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { loadAuth, saveAuth } from "../auth/storage.js";
import { Container, Card, Button, Input, Alert, Select, Spinner } from "../components/ui.jsx";

const HOSTELS = ["Chenab", "Raavi", "Beas", "Satluj", "Brahmaputra"];

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", hostelName: "", roomNumber: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function load() {
    const { data } = await api.get("/api/profile");
    setUser(data.user);
    setForm({
      name: data.user?.name || "",
      hostelName: data.user?.hostelName || "",
      roomNumber: data.user?.roomNumber || "",
      email: data.user?.email || "",
    });
  }

  useEffect(() => {
    load().catch((e) => setErr(e.response?.data?.message || "Error"));
  }, []);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setBusy(true);
    try {
      const { data } = await api.patch("/api/profile", form);
      setUser(data.user);
      setEdit(false);
      setOk("Saved");
      const auth = loadAuth();
      if (auth?.token) saveAuth({ token: auth.token, user: data.user });
    } catch (e2) {
      setErr(e2.response?.data?.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <Container>
        <div className="py-16">
          <Spinner label="Loading" />
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
        {ok ? (
          <div className="mb-4">
            <Alert type="success">{ok}</Alert>
          </div>
        ) : null}

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <Button variant="ghost" onClick={() => setEdit((v) => !v)}>
              {edit ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {!edit ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-slate-600">Name</div>
                <div className="text-lg text-slate-900">{user.name || "—"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600">Roll number</div>
                <div className="text-lg text-slate-900">{user.rollNumber || "—"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600">Hostel</div>
                <div className="text-lg text-slate-900">{user.hostelName || "—"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600">Room number</div>
                <div className="text-lg text-slate-900">{user.roomNumber || "—"}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-sm font-medium text-slate-600">Email</div>
                <div className="text-lg text-slate-900">{user.email || "—"}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
              <Select label="Hostel" value={form.hostelName} onChange={(e) => set("hostelName", e.target.value)}>
                <option value="">—</option>
                {HOSTELS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </Select>
              <Input label="Room number" value={form.roomNumber} onChange={(e) => set("roomNumber", e.target.value)} />
              <div className="sm:col-span-2">
                <Button type="submit" disabled={busy}>
                  {busy ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </Container>
  );
}

