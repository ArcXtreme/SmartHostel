import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { loadAuth } from "../auth/storage.js";

export function ProtectedRoute({ roles }) {
  const auth = loadAuth();
  if (!auth?.token || !auth?.user) {
    return <Navigate to="/" replace />;
  }
  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
