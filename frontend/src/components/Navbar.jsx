import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container } from "./ui.jsx";
import { clearAuth, loadAuth } from "../auth/storage.js";

export default function Navbar() {
  const navigate = useNavigate();
  const auth = loadAuth();

  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="font-semibold tracking-tight text-white">
            Smart Hostel Cleaning
          </Link>
          <div className="flex items-center gap-2">
            {auth?.role === "student" ? (
              <div className="hidden text-sm text-white/70 sm:block">
                Room <span className="text-white">{auth.roomNumber}</span>
              </div>
            ) : null}
            {auth ? (
              <Button
                variant="ghost"
                onClick={() => {
                  clearAuth();
                  navigate("/");
                }}
              >
                Sign out
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/")}>
                Home
              </Button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

