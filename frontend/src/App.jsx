import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import StudentAuth from "./pages/StudentAuth.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import WorkerLogin from "./pages/WorkerLogin.jsx";
import WorkerDashboard from "./pages/WorkerDashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/student/auth" element={<StudentAuth />} />
        <Route path="/student" element={<StudentDashboard />} />

        <Route path="/worker/login" element={<WorkerLogin />} />
        <Route path="/worker" element={<WorkerDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
