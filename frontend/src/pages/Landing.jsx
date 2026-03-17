import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Button, Card, Container } from "../components/ui.jsx";
import { loadAuth } from "../auth/storage.js";

export default function Landing() {
  const navigate = useNavigate();
  const auth = loadAuth();

  React.useEffect(() => {
    if (auth?.role === "student") navigate("/student");
    if (auth?.role === "worker") navigate("/worker");
  }, [auth, navigate]);

  return (
    <div className="min-h-dvh">
      <Navbar />
      <Container>
        <div className="py-10 sm:py-14">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
              Hostel cleaning requests • web app
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Book cleaning in seconds.
            </h1>
            <p className="mt-4 text-white/70">
              Students can schedule a slot and see today’s bookings. Workers can view requests and
              mark them completed.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="text-left">
              <div className="text-sm text-white/70">I’m a</div>
              <div className="mt-1 text-xl font-semibold text-white">Student</div>
              <p className="mt-2 text-sm text-white/70">
                Sign up/sign in using your room number, then schedule a cleaning request.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={() => navigate("/student/auth")}>Continue</Button>
              </div>
            </Card>

            <Card className="text-left">
              <div className="text-sm text-white/70">I’m a</div>
              <div className="mt-1 text-xl font-semibold text-white">Worker</div>
              <p className="mt-2 text-sm text-white/70">
                Log in and manage all cleaning requests for the hostel.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={() => navigate("/worker/login")}>Continue</Button>
              </div>
            </Card>
          </div>

          <div className="mx-auto mt-10 max-w-4xl text-center text-xs text-white/50">
            Tip: create a worker account by signing up with role “worker” (admin flow can be added
            later).
          </div>
        </div>
      </Container>
    </div>
  );
}

